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
import { ArrowLeft, User, CreditCard, Calendar, Activity, Mail, Phone } from 'lucide-react';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

const LICENCE_TYPE_LABELS: Record<string, string> = {
  provisional: 'Provisional Licence',
  full_car: 'Full Car Licence (Category B)',
  full_motorcycle: 'Full Motorcycle Licence (Category A)',
  full_lorry: 'Full Lorry Licence (Category C)',
  full_bus: 'Full Bus Licence (Category D)',
  full_minibus: 'Full Minibus Licence (Category D1)',
  international: 'International Driving Permit (IDP)',
};

export function ApplicationDetail() {
  const [, params] = useRoute('/admin/applications/:id');
  const id = params?.id ? parseInt(params.id, 10) : 0;
  const queryClient = useQueryClient();
  const [notesValue, setNotesValue] = useState<string | null>(null);
  const [estCompletion, setEstCompletion] = useState<string | null>(null);

  const { data: app, isLoading, isError } = useGetApplication(id, {
    query: { enabled: !!id, queryKey: getGetApplicationQueryKey(id) }
  });

  const updateMutation = useUpdateApplication();
  const deleteMutation = useDeleteApplication();

  const currentNotes = notesValue ?? app?.notes ?? '';
  const currentEst = estCompletion ?? app?.estimatedCompletion ?? '';

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
      {
        onSuccess: (updated) => {
          queryClient.setQueryData(getGetApplicationQueryKey(id), updated);
        }
      }
    );
  };

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
          <Card className="shadow-md border-0 overflow-hidden">
            <div className="bg-gov-blue h-1 w-full"></div>
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
