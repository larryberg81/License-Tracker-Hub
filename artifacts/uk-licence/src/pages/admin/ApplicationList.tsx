import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { AdminLayout } from '@/components/AdminLayout';
import {
  useListApplications,
  getListApplicationsQueryKey,
  useDeleteApplication,
} from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { cn, formatDate } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Plus, Filter, FileText, ChevronRight, Trash2 } from 'lucide-react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const LICENCE_TYPE_LABELS: Record<string, string> = {
  provisional: 'Provisional',
  full_car: 'Car (B)',
  full_motorcycle: 'Motorcycle (A)',
  full_lorry: 'Lorry (C)',
  full_bus: 'Bus (D)',
  full_minibus: 'Minibus (D1)',
  international: 'IDP',
};

export function ApplicationList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

  const queryClient = useQueryClient();

  const { data: applications, isLoading, isError } = useListApplications(
    undefined,
    { query: { queryKey: getListApplicationsQueryKey() } }
  );

  const { mutate: deleteApplication, isPending: isDeleting } = useDeleteApplication({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListApplicationsQueryKey() });
        setDeleteTarget(null);
      },
    },
  });

  const filteredApps = useMemo(() => {
    if (!applications) return [];
    return applications.filter(app => {
      const q = searchTerm.toLowerCase();
      const matchesSearch = !q ||
        app.trackingCode.toLowerCase().includes(q) ||
        app.fullName.toLowerCase().includes(q) ||
        (app.email ?? '').toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [applications, searchTerm, statusFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'registered': return <Badge variant="secondary" className="bg-slate-200 text-slate-800">Registered</Badge>;
      case 'pending_payment': return <Badge variant="outline" className="border-amber-400 text-amber-700 bg-amber-50">Pending Payment</Badge>;
      case 'processing': return <Badge className="bg-gov-blue hover:bg-blue-800">Processing</Badge>;
      case 'processed': return <Badge className="bg-gov-green hover:bg-green-700">Processed</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Applications</h1>
          <p className="text-slate-600 font-medium mt-1">Manage driving licence applications</p>
        </div>
        <Link href="/admin/applications/new" className={cn(buttonVariants(), 'bg-gov-blue hover:bg-blue-800 text-white font-bold shadow-md inline-flex')}>
          <Plus className="mr-2 h-4 w-4" /> New Application
        </Link>
      </div>

      <Card className="border-0 shadow-md mb-6">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 bg-white rounded-t-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by tracking code, name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-slate-50 border-slate-200"
            />
          </div>
          <div className="w-full sm:w-48 flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400 shrink-0" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-slate-50 border-slate-200">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="registered">Registered</SelectItem>
                <SelectItem value="pending_payment">Pending Payment</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="processed">Processed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-white rounded-b-xl overflow-hidden">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : isError ? (
            <div className="p-8 text-center text-red-600 bg-red-50">
              <p className="font-bold">Error loading applications.</p>
              <p className="text-sm mt-1">Please try refreshing the page.</p>
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="p-16 text-center text-slate-500 flex flex-col items-center">
              <FileText className="h-12 w-12 text-slate-300 mb-4" />
              <p className="text-lg font-bold text-slate-700">No applications found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow className="hover:bg-slate-50 border-b-2 border-slate-200">
                    <TableHead className="font-bold text-slate-900 w-[160px]">Tracking Code</TableHead>
                    <TableHead className="font-bold text-slate-900">Applicant Name</TableHead>
                    <TableHead className="font-bold text-slate-900 w-[120px]">Type</TableHead>
                    <TableHead className="font-bold text-slate-900 w-[150px]">Status</TableHead>
                    <TableHead className="font-bold text-slate-900 w-[140px]">Date Submitted</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApps.map((app) => (
                    <TableRow key={app.id} className="hover:bg-slate-50 cursor-pointer group transition-colors">
                      <TableCell className="font-mono text-sm font-bold text-slate-700">{app.trackingCode}</TableCell>
                      <TableCell className="font-bold text-slate-900">{app.fullName}</TableCell>
                      <TableCell className="text-slate-600 font-medium text-sm">
                        {LICENCE_TYPE_LABELS[app.licenceType] ?? app.licenceType}
                      </TableCell>
                      <TableCell>{getStatusBadge(app.status)}</TableCell>
                      <TableCell className="text-slate-600 text-sm">{formatDate(app.submittedAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 hover:text-red-600 text-slate-400"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setDeleteTarget({ id: app.id, name: app.fullName });
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Link
                            href={`/admin/applications/${app.id}`}
                            className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'group-hover:bg-blue-100 group-hover:text-gov-blue transition-colors inline-flex')}
                          >
                            <ChevronRight className="h-5 w-5" />
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </Card>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the application for{' '}
              <span className="font-semibold text-slate-900">{deleteTarget?.name}</span>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isDeleting}
              onClick={() => deleteTarget && deleteApplication({ id: deleteTarget.id })}
            >
              {isDeleting ? 'Deleting…' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
