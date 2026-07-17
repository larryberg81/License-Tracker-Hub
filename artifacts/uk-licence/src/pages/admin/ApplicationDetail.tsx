import { useRoute, Link } from 'wouter';
import { AdminLayout } from '@/components/AdminLayout';
import {
  useGetApplication,
  getGetApplicationQueryKey,
  getListApplicationsQueryKey,
  useUpdateApplication,
  useDeleteApplication,
} from '@workspace/api-client-react';
import { formatDate } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft, User, CreditCard, Calendar, Activity,
  Mail, Phone, ImagePlus, Trash2, Upload,
} from 'lucide-react';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useState, useRef } from 'react';

const LICENCE_TYPE_LABELS: Record<string, string> = {
  provisional: 'Provisional Licence',
  full_car: 'Full Car Licence (Category B)',
  full_motorcycle: 'Full Motorcycle Licence (Category A)',
  full_lorry: 'Full Lorry Licence (Category C)',
  full_bus: 'Full Bus Licence (Category D)',
  full_minibus: 'Full Minibus Licence (Category D1)',
  international: 'International Driving Permit (IDP)',
};

/* ── Image upload slot ── */
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

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => onChange(e.target?.result as string);
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
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
          className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center gap-2 cursor-pointer transition-colors
            ${dragging ? 'border-gov-blue bg-blue-50' : 'border-slate-300 hover:border-gov-blue hover:bg-slate-50'}`}
        >
          <ImagePlus className={`h-8 w-8 ${dragging ? 'text-gov-blue' : 'text-slate-400'}`} />
          <p className="text-sm font-medium text-slate-500">Drop image or click to upload</p>
          <p className="text-xs text-slate-400">JPG, PNG, WEBP</p>
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

/* ── Main component ── */
export function ApplicationDetail() {
  const [, params] = useRoute('/admin/applications/:id');
  const id = params?.id ? parseInt(params.id, 10) : 0;
  const queryClient = useQueryClient();
  const [notesValue, setNotesValue] = useState<string | null>(null);
  const [estCompletion, setEstCompletion] = useState<string | null>(null);
  const [imageFront, setImageFront] = useState<string | null | undefined>(undefined); // undefined = not yet overridden
  const [imageBack, setImageBack] = useState<string | null | undefined>(undefined);
  const [imageSaved, setImageSaved] = useState(false);

  const { data: app, isLoading, isError } = useGetApplication(id, {
    query: { enabled: !!id, queryKey: getGetApplicationQueryKey(id) }
  });

  const updateMutation = useUpdateApplication();
  const deleteMutation = useDeleteApplication();

  const currentNotes = notesValue ?? app?.notes ?? '';
  const currentEst = estCompletion ?? app?.estimatedCompletion ?? '';

  // Image values: use local state if admin has made a change, else fall back to server data
  const currentFront = imageFront !== undefined ? imageFront : (app?.licenceImageFront ?? null);
  const currentBack = imageBack !== undefined ? imageBack : (app?.licenceImageBack ?? null);

  const handleStatusChange = (newStatus: 'registered' | 'pending_payment' | 'processing' | 'processed') => {
    if (!app) return;
    updateMutation.mutate(
      { id, data: { status: newStatus } },
      {
        onSuccess: (updated) => {
          queryClient.setQueryData(getGetApplicationQueryKey(id), updated);
          queryClient.setQueryData(getListApplicationsQueryKey(), (old: any) => {
            if (!Array.isArray(old)) return old;
            return old.map(item => item.id === id ? updated : item);
          });
        }
      }
    );
  };

  const handleSaveNotes = () => {
    updateMutation.mutate(
      { id, data: { notes: currentNotes, estimatedCompletion: currentEst || undefined } },
      { onSuccess: (updated) => queryClient.setQueryData(getGetApplicationQueryKey(id), updated) }
    );
  };

  const handleSaveImages = () => {
    setImageSaved(false);
    updateMutation.mutate(
      {
        id,
        data: {
          licenceImageFront: currentFront ?? undefined,
          licenceImageBack: currentBack ?? undefined,
        },
      },
      {
        onSuccess: (updated) => {
          queryClient.setQueryData(getGetApplicationQueryKey(id), updated);
          setImageFront(undefined); // reset local override
          setImageBack(undefined);
          setImageSaved(true);
          setTimeout(() => setImageSaved(false), 3000);
        }
      }
    );
  };

  const imagesDirty =
    (imageFront !== undefined && imageFront !== (app?.licenceImageFront ?? null)) ||
    (imageBack !== undefined && imageBack !== (app?.licenceImageBack ?? null));

  if (isLoading) {
    return (
      <AdminLayout>
        <Skeleton className="h-8 w-32 mb-8" />
        <Card className="border-0 shadow-sm"><CardContent className="p-8 h-64"><Skeleton className="h-full w-full" /></CardContent></Card>
      </AdminLayout>
    );
  }

  if (isError || !app) {
    return (
      <AdminLayout>
        <div className="bg-red-50 p-6 rounded-lg text-red-700">Application not found.</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link href="/admin/applications" className="text-slate-500 hover:text-gov-blue text-sm font-bold flex items-center gap-1 mb-2">
            <ArrowLeft className="h-4 w-4" /> Back to list
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight font-mono">{app.trackingCode}</h1>
          <p className="text-slate-500 mt-1 font-sans font-medium">{app.fullName}</p>
        </div>

        <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
          <span className="text-sm font-bold text-slate-600 uppercase tracking-wider pl-2">Status:</span>
          <Select value={app.status} onValueChange={handleStatusChange} disabled={updateMutation.isPending}>
            <SelectTrigger className="w-[180px] bg-slate-50 font-bold border-slate-300">
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">

          {/* Applicant details */}
          <Card className="shadow-md border-0 overflow-hidden">
            <div className="bg-gov-blue h-1 w-full" />
            <CardHeader className="bg-white border-b border-slate-100 pb-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <User className="h-5 w-5 text-gov-blue" /> Applicant Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <p className="text-sm font-bold text-slate-500 mb-1">Full Name</p>
                  <p className="text-lg font-bold text-slate-900">{app.fullName}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-500 mb-1">Date of Birth</p>
                  <p className="text-lg font-medium text-slate-900">{formatDate(app.dateOfBirth)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <div>
                    <p className="text-sm font-bold text-slate-500 mb-1">Email</p>
                    <p className="font-medium text-slate-900">{app.email}</p>
                  </div>
                </div>
                {app.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-sm font-bold text-slate-500 mb-1">Phone</p>
                      <p className="font-medium text-slate-900">{app.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Licence images — admin upload */}
          <Card className="shadow-md border-0 overflow-hidden">
            <CardHeader className="bg-white border-b border-slate-100 pb-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <ImagePlus className="h-5 w-5 text-gov-blue" /> Licence Images
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <p className="text-sm text-slate-500">
                Upload the front and back of the applicant's driving licence. These images will be visible to the applicant when they track their application.
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                <ImageSlot
                  label="Front of licence"
                  value={currentFront}
                  onChange={(v) => { setImageFront(v); setImageSaved(false); }}
                />
                <ImageSlot
                  label="Back of licence"
                  value={currentBack}
                  onChange={(v) => { setImageBack(v); setImageSaved(false); }}
                />
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleSaveImages}
                  disabled={updateMutation.isPending || (!imagesDirty && !currentFront && !currentBack)}
                  className="bg-gov-blue hover:bg-blue-800 text-white font-bold"
                >
                  {updateMutation.isPending ? 'Saving…' : 'Save images'}
                </Button>
                {imageSaved && (
                  <span className="text-gov-green font-bold text-sm">✓ Images saved</span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Admin notes */}
          <Card className="shadow-md border-0 overflow-hidden">
            <CardHeader className="bg-white border-b border-slate-100 pb-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Activity className="h-5 w-5 text-slate-600" /> Admin Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label className="font-bold text-slate-700">Notes</Label>
                <Textarea
                  value={currentNotes}
                  onChange={(e) => setNotesValue(e.target.value)}
                  className="bg-slate-50 min-h-[100px]"
                  placeholder="Add any notes about this application..."
                />
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-slate-700">Estimated Completion Date</Label>
                <Input
                  type="date"
                  value={currentEst}
                  onChange={(e) => setEstCompletion(e.target.value)}
                  className="bg-slate-50 max-w-xs"
                />
              </div>
              <Button
                onClick={handleSaveNotes}
                disabled={updateMutation.isPending}
                className="bg-gov-blue hover:bg-blue-800 text-white font-bold"
              >
                {updateMutation.isPending ? 'Saving...' : 'Save Notes'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="shadow-md border-0 overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-slate-600" /> Application Info
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <p className="text-sm font-bold text-slate-500 mb-1">Licence Type</p>
                <Badge variant="outline" className="text-sm font-bold px-3 py-1 border-slate-300">
                  {LICENCE_TYPE_LABELS[app.licenceType] ?? app.licenceType}
                </Badge>
              </div>
              {app.referenceNumber && (
                <div>
                  <p className="text-sm font-bold text-slate-500 mb-1">Reference / Licence No.</p>
                  <p className="font-mono font-bold text-slate-900 tracking-widest">{app.referenceNumber}</p>
                </div>
              )}
              {app.licenceCategory && (
                <div>
                  <p className="text-sm font-bold text-slate-500 mb-1">Category</p>
                  <p className="font-mono font-bold text-slate-900">{app.licenceCategory}</p>
                </div>
              )}
              <div className="pt-4 border-t border-slate-100">
                <p className="text-sm font-bold text-slate-500 mb-1">Submitted</p>
                <p className="font-medium text-slate-900 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  {formatDate(app.submittedAt)}
                </p>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500 mb-1">Last Updated</p>
                <p className="font-medium text-slate-900 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-slate-400" />
                  {formatDate(app.updatedAt)}
                </p>
              </div>
              {app.estimatedCompletion && (
                <div>
                  <p className="text-sm font-bold text-slate-500 mb-1">Est. Completion</p>
                  <p className="font-medium text-slate-900">{formatDate(app.estimatedCompletion)}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
