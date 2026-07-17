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
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft, User, CreditCard, Calendar, Activity,
  ImagePlus, Trash2, Upload, Save, CheckCircle2,
} from 'lucide-react';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useState, useRef, useEffect } from 'react';
import type { Application } from '@workspace/api-client-react';

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

/* ── Saved indicator ── */
function SavedBadge({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <span className="inline-flex items-center gap-1.5 text-gov-green font-bold text-sm">
      <CheckCircle2 className="h-4 w-4" /> Saved
    </span>
  );
}

/* ── Section editable fields state ── */
type ApplicantFields = {
  fullName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
};

type LicenceFields = {
  licenceType: Application['licenceType'];
  licenceCategory: string;
  referenceNumber: string;
};

type NotesFields = {
  notes: string;
  estimatedCompletion: string;
};

function toDateInput(val: string | null | undefined): string {
  if (!val) return '';
  // Already YYYY-MM-DD or ISO string
  return val.slice(0, 10);
}

/* ── Main component ── */
export function ApplicationDetail() {
  const [, params] = useRoute('/admin/applications/:id');
  const id = params?.id ? parseInt(params.id, 10) : 0;
  const queryClient = useQueryClient();

  const { data: app, isLoading, isError } = useGetApplication(id, {
    query: { enabled: !!id, queryKey: getGetApplicationQueryKey(id) }
  });

  const updateMutation = useUpdateApplication();
  const deleteMutation = useDeleteApplication();

  // ── Applicant fields state
  const [applicant, setApplicant] = useState<ApplicantFields | null>(null);
  const [applicantSaved, setApplicantSaved] = useState(false);

  // ── Licence info fields state
  const [licence, setLicence] = useState<LicenceFields | null>(null);
  const [licenceSaved, setLicenceSaved] = useState(false);

  // ── Notes / completion state
  const [notes, setNotes] = useState<NotesFields | null>(null);
  const [notesSaved, setNotesSaved] = useState(false);

  // ── Image state
  const [imageFront, setImageFront] = useState<string | null | undefined>(undefined);
  const [imageBack, setImageBack] = useState<string | null | undefined>(undefined);
  const [imagesSaved, setImagesSaved] = useState(false);

  // Seed local state once data arrives (only if not yet set)
  useEffect(() => {
    if (!app) return;
    if (!applicant) {
      setApplicant({
        fullName: app.fullName,
        dateOfBirth: toDateInput(app.dateOfBirth),
        email: app.email ?? '',
        phone: app.phone ?? '',
      });
    }
    if (!licence) {
      setLicence({
        licenceType: app.licenceType,
        licenceCategory: app.licenceCategory ?? '',
        referenceNumber: app.referenceNumber ?? '',
      });
    }
    if (!notes) {
      setNotes({
        notes: app.notes ?? '',
        estimatedCompletion: toDateInput(app.estimatedCompletion),
      });
    }
  }, [app]);

  const currentFront = imageFront !== undefined ? imageFront : (app?.licenceImageFront ?? null);
  const currentBack  = imageBack  !== undefined ? imageBack  : (app?.licenceImageBack  ?? null);

  const imagesDirty =
    (imageFront !== undefined && imageFront !== (app?.licenceImageFront ?? null)) ||
    (imageBack  !== undefined && imageBack  !== (app?.licenceImageBack  ?? null));

  const invalidate = (updated: Application) => {
    queryClient.setQueryData(getGetApplicationQueryKey(id), updated);
    queryClient.setQueryData(getListApplicationsQueryKey(), (old: any) => {
      if (!Array.isArray(old)) return old;
      return old.map(item => item.id === id ? updated : item);
    });
  };

  const flash = (setter: (v: boolean) => void) => {
    setter(true);
    setTimeout(() => setter(false), 3000);
  };

  const handleSaveApplicant = () => {
    if (!applicant) return;
    updateMutation.mutate(
      { id, data: { fullName: applicant.fullName, dateOfBirth: applicant.dateOfBirth, email: applicant.email || undefined, phone: applicant.phone || undefined } },
      { onSuccess: (u) => { invalidate(u); flash(setApplicantSaved); } }
    );
  };

  const handleSaveLicence = () => {
    if (!licence) return;
    updateMutation.mutate(
      { id, data: { licenceType: licence.licenceType, licenceCategory: licence.licenceCategory || undefined, referenceNumber: licence.referenceNumber ? licence.referenceNumber.toUpperCase() : undefined } },
      { onSuccess: (u) => { invalidate(u); flash(setLicenceSaved); } }
    );
  };

  const handleSaveNotes = () => {
    if (!notes) return;
    updateMutation.mutate(
      { id, data: { notes: notes.notes || undefined, estimatedCompletion: notes.estimatedCompletion || undefined } },
      { onSuccess: (u) => { invalidate(u); flash(setNotesSaved); } }
    );
  };

  const handleSaveImages = () => {
    updateMutation.mutate(
      { id, data: { licenceImageFront: currentFront ?? undefined, licenceImageBack: currentBack ?? undefined } },
      {
        onSuccess: (u) => {
          invalidate(u);
          setImageFront(undefined);
          setImageBack(undefined);
          flash(setImagesSaved);
        }
      }
    );
  };

  const handleStatusChange = (newStatus: 'registered' | 'pending_payment' | 'processing' | 'processed') => {
    updateMutation.mutate(
      { id, data: { status: newStatus } },
      { onSuccess: invalidate }
    );
  };

  if (isLoading || !applicant || !licence || !notes) {
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
      {/* Header */}
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

          {/* ── Applicant Details ── */}
          <Card className="shadow-md border-0 overflow-hidden">
            <div className="bg-gov-blue h-1 w-full" />
            <CardHeader className="bg-white border-b border-slate-100 pb-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <User className="h-5 w-5 text-gov-blue" /> Applicant Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="font-bold text-slate-700">Full Name</Label>
                  <Input
                    value={applicant.fullName}
                    onChange={(e) => setApplicant(p => p && ({ ...p, fullName: e.target.value }))}
                    className="bg-slate-50"
                    placeholder="Full legal name"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-bold text-slate-700">Date of Birth</Label>
                  <Input
                    type="date"
                    value={applicant.dateOfBirth}
                    onChange={(e) => setApplicant(p => p && ({ ...p, dateOfBirth: e.target.value }))}
                    className="bg-slate-50"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-bold text-slate-700">Email Address</Label>
                  <Input
                    type="email"
                    value={applicant.email}
                    onChange={(e) => setApplicant(p => p && ({ ...p, email: e.target.value }))}
                    className="bg-slate-50"
                    placeholder="optional"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-bold text-slate-700">Phone Number</Label>
                  <Input
                    type="tel"
                    value={applicant.phone}
                    onChange={(e) => setApplicant(p => p && ({ ...p, phone: e.target.value }))}
                    className="bg-slate-50"
                    placeholder="optional"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Button
                  onClick={handleSaveApplicant}
                  disabled={updateMutation.isPending}
                  className="bg-gov-blue hover:bg-blue-800 text-white font-bold"
                >
                  <Save className="h-4 w-4 mr-1.5" />
                  {updateMutation.isPending ? 'Saving…' : 'Save Details'}
                </Button>
                <SavedBadge show={applicantSaved} />
              </div>
            </CardContent>
          </Card>

          {/* ── Licence Images ── */}
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
                  onChange={(v) => { setImageFront(v); setImagesSaved(false); }}
                />
                <ImageSlot
                  label="Back of licence"
                  value={currentBack}
                  onChange={(v) => { setImageBack(v); setImagesSaved(false); }}
                />
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleSaveImages}
                  disabled={updateMutation.isPending || (!imagesDirty && !currentFront && !currentBack)}
                  className="bg-gov-blue hover:bg-blue-800 text-white font-bold"
                >
                  <Save className="h-4 w-4 mr-1.5" />
                  {updateMutation.isPending ? 'Saving…' : 'Save Images'}
                </Button>
                <SavedBadge show={imagesSaved} />
              </div>
            </CardContent>
          </Card>

          {/* ── Admin Notes ── */}
          <Card className="shadow-md border-0 overflow-hidden">
            <CardHeader className="bg-white border-b border-slate-100 pb-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Activity className="h-5 w-5 text-slate-600" /> Admin Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1.5">
                <Label className="font-bold text-slate-700">Notes</Label>
                <Textarea
                  value={notes.notes}
                  onChange={(e) => setNotes(p => p && ({ ...p, notes: e.target.value }))}
                  className="bg-slate-50 min-h-[100px]"
                  placeholder="Add any notes about this application..."
                />
              </div>
              <div className="space-y-1.5">
                <Label className="font-bold text-slate-700">Estimated Completion Date</Label>
                <Input
                  type="date"
                  value={notes.estimatedCompletion}
                  onChange={(e) => setNotes(p => p && ({ ...p, estimatedCompletion: e.target.value }))}
                  className="bg-slate-50 max-w-xs"
                />
              </div>
              <div className="flex items-center gap-3 pt-1">
                <Button
                  onClick={handleSaveNotes}
                  disabled={updateMutation.isPending}
                  className="bg-gov-blue hover:bg-blue-800 text-white font-bold"
                >
                  <Save className="h-4 w-4 mr-1.5" />
                  {updateMutation.isPending ? 'Saving…' : 'Save Notes'}
                </Button>
                <SavedBadge show={notesSaved} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Sidebar: Licence Info ── */}
        <div className="space-y-6">
          <Card className="shadow-md border-0 overflow-hidden">
            <div className="bg-slate-700 h-1 w-full" />
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-slate-600" /> Licence Info
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1.5">
                <Label className="font-bold text-slate-700">Licence Type</Label>
                <Select
                  value={licence.licenceType}
                  onValueChange={(v) => setLicence(p => p && ({ ...p, licenceType: v as Application['licenceType'] }))}
                >
                  <SelectTrigger className="bg-white font-medium text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="provisional">Provisional</SelectItem>
                    <SelectItem value="full_car">Full Car (B)</SelectItem>
                    <SelectItem value="full_motorcycle">Full Motorcycle (A)</SelectItem>
                    <SelectItem value="full_lorry">Full Lorry (C)</SelectItem>
                    <SelectItem value="full_bus">Full Bus (D)</SelectItem>
                    <SelectItem value="full_minibus">Full Minibus (D1)</SelectItem>
                    <SelectItem value="international">International (IDP)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="font-bold text-slate-700">Category</Label>
                <Input
                  value={licence.licenceCategory}
                  onChange={(e) => setLicence(p => p && ({ ...p, licenceCategory: e.target.value }))}
                  className="bg-white text-sm"
                  placeholder="e.g. A, B"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="font-bold text-slate-700">Reference / Licence No.</Label>
                <Input
                  value={licence.referenceNumber}
                  onChange={(e) => setLicence(p => p && ({ ...p, referenceNumber: e.target.value.toUpperCase() }))}
                  className="bg-white font-mono text-sm tracking-widest"
                  placeholder="optional"
                />
              </div>

              <div className="flex items-center gap-3 pt-1">
                <Button
                  onClick={handleSaveLicence}
                  disabled={updateMutation.isPending}
                  size="sm"
                  className="bg-gov-blue hover:bg-blue-800 text-white font-bold"
                >
                  <Save className="h-3.5 w-3.5 mr-1.5" />
                  {updateMutation.isPending ? 'Saving…' : 'Save'}
                </Button>
                <SavedBadge show={licenceSaved} />
              </div>

              {/* Read-only timestamps */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div>
                  <p className="text-sm font-bold text-slate-500 mb-1">Submitted</p>
                  <p className="font-medium text-slate-900 flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    {formatDate(app.submittedAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-500 mb-1">Last Updated</p>
                  <p className="font-medium text-slate-900 flex items-center gap-2 text-sm">
                    <Activity className="h-4 w-4 text-slate-400" />
                    {formatDate(app.updatedAt)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
