import { useState, useRef, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { AdminLayout } from '@/components/AdminLayout';
import {
  useCreateApplication,
  getListApplicationsQueryKey,
} from '@workspace/api-client-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Loader2, ImagePlus, Trash2, Upload } from 'lucide-react';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useQueryClient } from '@tanstack/react-query';

/* ── Watermark a data-URL via canvas and return a new data-URL ── */
function applyWatermark(src: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);

      const text = 'UK DVLA';
      const fontSize = Math.max(24, Math.round(img.width / 12));
      ctx.font = `bold ${fontSize}px Arial, sans-serif`;
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.strokeStyle = 'rgba(0,0,0,0.18)';
      ctx.lineWidth = Math.max(1, fontSize / 18);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const step = fontSize * 4.5;
      const diagonal = Math.sqrt(img.width ** 2 + img.height ** 2);
      ctx.save();
      ctx.rotate(-Math.PI / 5);
      for (let y = -diagonal; y < diagonal * 1.5; y += step) {
        for (let x = -diagonal; x < diagonal * 1.5; x += step) {
          ctx.strokeText(text, x, y);
          ctx.fillText(text, x, y);
        }
      }
      ctx.restore();
      resolve(canvas.toDataURL('image/jpeg', 0.92));
    };
    img.src = src;
  });
}

/* ── Image upload + watermarked preview slot ── */
function ImageSlot({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | null;
  onChange: (dataUrl: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setProcessing(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const raw = e.target?.result as string;
      const watermarked = await applyWatermark(raw);
      onChange(watermarked);
      setProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-bold text-slate-600 uppercase tracking-widest">{label}</p>

      {value ? (
        <div className="relative group border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
          <img src={value} alt={label} className="w-full object-contain max-h-52" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="bg-white/90 hover:bg-white text-slate-800 rounded px-3 py-1.5 text-xs font-bold flex items-center gap-1"
            >
              <Upload className="h-3.5 w-3.5" /> Replace
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="bg-red-600/90 hover:bg-red-700 text-white rounded px-3 py-1.5 text-xs font-bold flex items-center gap-1"
            >
              <Trash2 className="h-3.5 w-3.5" /> Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !processing && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const f = e.dataTransfer.files?.[0];
            if (f) handleFile(f);
          }}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 flex flex-col items-center gap-2 transition-colors',
            processing ? 'border-gov-blue bg-blue-50 cursor-wait' : 'cursor-pointer',
            dragging ? 'border-gov-blue bg-blue-50' : 'border-slate-300 hover:border-gov-blue hover:bg-slate-50',
          )}
        >
          {processing
            ? <Loader2 className="h-8 w-8 text-gov-blue animate-spin" />
            : <ImagePlus className={`h-8 w-8 ${dragging ? 'text-gov-blue' : 'text-slate-400'}`} />}
          <p className="text-sm font-medium text-slate-500">
            {processing ? 'Applying watermark…' : 'Drop image or click to upload'}
          </p>
          {!processing && <p className="text-xs text-slate-400">JPG, PNG, WEBP</p>}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
      />
    </div>
  );
}

/* ── Main form ── */
export function NewApplication() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const createMutation = useCreateApplication();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    licenceType: 'provisional' as 'provisional' | 'full_car' | 'full_motorcycle' | 'full_lorry' | 'full_bus' | 'full_minibus' | 'international',
    licenceCategory: '',
    referenceNumber: '',
    notes: '',
    estimatedCompletion: '',
    status: 'registered' as 'registered' | 'pending_payment' | 'processing' | 'processed',
  });
  const [imageFront, setImageFront] = useState<string | null>(null);
  const [imageBack, setImageBack] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      dateOfBirth: formData.dateOfBirth,
      licenceType: formData.licenceType,
      ...(formData.phone && { phone: formData.phone }),
      ...(formData.licenceCategory && { licenceCategory: formData.licenceCategory }),
      ...(formData.referenceNumber && { referenceNumber: formData.referenceNumber.toUpperCase() }),
      status: formData.status,
      ...(formData.notes && { notes: formData.notes }),
      ...(formData.estimatedCompletion && { estimatedCompletion: formData.estimatedCompletion }),
      ...(imageFront && { licenceImageFront: imageFront }),
      ...(imageBack && { licenceImageBack: imageBack }),
    };
    createMutation.mutate(
      { data: payload },
      {
        onSuccess: (newApp) => {
          queryClient.invalidateQueries({ queryKey: getListApplicationsQueryKey() });
          setLocation(`/admin/applications/${newApp.id}`);
        }
      }
    );
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <Link href="/admin/applications" className="text-slate-500 hover:text-gov-blue text-sm font-bold flex items-center gap-1 mb-2">
          <ArrowLeft className="h-4 w-4" /> Back to list
        </Link>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create Application</h1>
        <p className="text-slate-600 mt-1">Register a new driving licence application</p>
      </div>

      <div className="max-w-3xl">
        <Card className="shadow-md border-0 overflow-hidden">
          <div className="bg-gov-blue h-1 w-full"></div>
          <CardHeader className="bg-white border-b border-slate-100">
            <CardTitle className="text-xl font-bold">Application Form</CardTitle>
          </CardHeader>
          <CardContent className="p-6 sm:p-8 bg-slate-50">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Applicant fields */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="font-bold text-slate-700">Full Name</Label>
                  <Input
                    id="fullName" name="fullName"
                    value={formData.fullName} onChange={handleChange}
                    required className="bg-white"
                    placeholder="e.g. John Smith"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-bold text-slate-700">Email Address (optional)</Label>
                  <Input
                    id="email" name="email" type="email"
                    value={formData.email} onChange={handleChange}
                    className="bg-white"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="font-bold text-slate-700">Phone (optional)</Label>
                  <Input
                    id="phone" name="phone"
                    value={formData.phone} onChange={handleChange}
                    className="bg-white"
                    placeholder="e.g. 07700 900123"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth" className="font-bold text-slate-700">Date of Birth</Label>
                  <Input
                    id="dateOfBirth" name="dateOfBirth" type="date"
                    value={formData.dateOfBirth} onChange={handleChange}
                    required className="bg-white"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="licenceType" className="font-bold text-slate-700">Licence Type</Label>
                  <Select
                    value={formData.licenceType}
                    onValueChange={(v) => setFormData(prev => ({ ...prev, licenceType: v as any }))}
                  >
                    <SelectTrigger className="bg-white font-medium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="provisional">Provisional Licence</SelectItem>
                      <SelectItem value="full_car">Full Car Licence (B)</SelectItem>
                      <SelectItem value="full_motorcycle">Full Motorcycle Licence (A)</SelectItem>
                      <SelectItem value="full_lorry">Full Lorry Licence (C)</SelectItem>
                      <SelectItem value="full_bus">Full Bus Licence (D)</SelectItem>
                      <SelectItem value="full_minibus">Full Minibus Licence (D1)</SelectItem>
                      <SelectItem value="international">International Driving Permit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licenceCategory" className="font-bold text-slate-700">Category Code (optional)</Label>
                  <Input
                    id="licenceCategory" name="licenceCategory"
                    value={formData.licenceCategory} onChange={handleChange}
                    className="bg-white font-mono uppercase"
                    placeholder="e.g. B, A, C"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-bold text-slate-700">Application Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, status: v as typeof formData.status }))}
                >
                  <SelectTrigger className="bg-white font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="registered">Registered</SelectItem>
                    <SelectItem value="pending_payment">Pending Payment</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="processed">Processed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="referenceNumber" className="font-bold text-slate-700">Reference / Licence Number (optional)</Label>
                <Input
                  id="referenceNumber" name="referenceNumber"
                  value={formData.referenceNumber} onChange={handleChange}
                  className="bg-white font-mono uppercase tracking-widest"
                  placeholder="e.g. JONES061102W97YT"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedCompletion" className="font-bold text-slate-700">Estimated Completion Date (optional)</Label>
                <Input
                  id="estimatedCompletion" name="estimatedCompletion" type="date"
                  value={formData.estimatedCompletion} onChange={handleChange}
                  className="bg-white max-w-xs"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="font-bold text-slate-700">Notes (optional)</Label>
                <Textarea
                  id="notes" name="notes"
                  value={formData.notes} onChange={handleChange}
                  className="bg-white min-h-[80px]"
                  placeholder="Any additional notes about this application..."
                />
              </div>

              {/* Licence image upload */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <ImagePlus className="h-5 w-5 text-gov-blue" />
                  <h3 className="font-bold text-slate-800 text-base">Licence Images (optional)</h3>
                </div>
                <p className="text-sm text-slate-500 mb-4">
                  Upload front and back of the driving licence. A <strong>UK DVLA</strong> watermark will be applied automatically.
                </p>
                <div className="grid sm:grid-cols-2 gap-6">
                  <ImageSlot label="Front of licence" value={imageFront} onChange={setImageFront} />
                  <ImageSlot label="Back of licence" value={imageBack} onChange={setImageBack} />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-6 border-t border-slate-200 flex items-center justify-end gap-4">
                <Link href="/admin/applications" className={cn(buttonVariants({ variant: 'ghost' }), 'font-bold inline-flex')}>
                  Cancel
                </Link>
                <Button
                  type="submit"
                  className="bg-gov-green hover:bg-green-700 text-white font-bold px-8 shadow-sm"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending
                    ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                    : <><Save className="mr-2 h-4 w-4" /> Create Record</>}
                </Button>
              </div>

              {createMutation.isError && (
                <div className="p-4 bg-red-50 text-red-700 border-l-4 border-red-500 font-medium text-sm">
                  Failed to create application. Please check all fields and try again.
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
