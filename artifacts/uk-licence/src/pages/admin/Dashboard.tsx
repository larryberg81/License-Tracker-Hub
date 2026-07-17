import { useGetStats, getGetStatsQueryKey, useHealthCheck } from '@workspace/api-client-react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Clock, CheckCircle2, AlertCircle, Activity, ChevronRight } from 'lucide-react';
import { Link } from 'wouter';
import { cn, formatDate } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export function Dashboard() {
  const { data: stats, isLoading } = useGetStats({ query: { queryKey: getGetStatsQueryKey() } });
  const { data: health } = useHealthCheck();

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Dashboard</h1>
          <p className="text-slate-600 font-medium">Overview of driving licence applications</p>
        </div>
        {health && (
          <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-sm font-bold border border-green-200">
            <Activity className="h-4 w-4" />
            System {health.status}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <Skeleton className="h-6 w-10 mb-4" />
                <Skeleton className="h-10 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-slate-600 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total</p>
                  <h3 className="text-4xl font-black text-slate-800">{stats?.total ?? 0}</h3>
                </div>
                <div className="p-3 bg-slate-100 rounded-lg"><FileText className="h-6 w-6 text-slate-600" /></div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-amber-700 uppercase tracking-wider mb-1">Pending</p>
                  <h3 className="text-4xl font-black text-amber-600">
                    {((stats?.registered ?? 0) + (stats?.pending_payment ?? 0))}
                  </h3>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg"><AlertCircle className="h-6 w-6 text-amber-500" /></div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-gov-blue shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-blue-700 uppercase tracking-wider mb-1">Processing</p>
                  <h3 className="text-4xl font-black text-gov-blue">{stats?.processing ?? 0}</h3>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg"><Clock className="h-6 w-6 text-gov-blue" /></div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-gov-green shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-green-700 uppercase tracking-wider mb-1">Processed</p>
                  <h3 className="text-4xl font-black text-gov-green">{stats?.processed ?? 0}</h3>
                </div>
                <div className="p-3 bg-green-50 rounded-lg"><CheckCircle2 className="h-6 w-6 text-gov-green" /></div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="bg-white border-b border-slate-100 flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold">Recent Applications</CardTitle>
          <Link href="/admin/applications" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'font-bold inline-flex')}>
            View all
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : (stats?.recentApplications?.length ?? 0) === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <Activity className="h-10 w-10 mx-auto text-slate-300 mb-3" />
              <p className="font-medium">No applications yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {stats?.recentApplications.map((app) => (
                <Link key={app.id} href={`/admin/applications/${app.id}`} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-bold text-slate-900">{app.fullName}</p>
                      <p className="text-sm text-slate-500 font-mono">{app.trackingCode}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={
                      app.status === 'processed' ? 'default' :
                      app.status === 'processing' ? 'default' :
                      app.status === 'pending_payment' ? 'outline' : 'secondary'
                    } className={cn(
                      app.status === 'processed' && 'bg-gov-green',
                      app.status === 'processing' && 'bg-gov-blue',
                      app.status === 'pending_payment' && 'border-amber-400 text-amber-700 bg-amber-50',
                      app.status === 'registered' && 'bg-slate-200 text-slate-800',
                    )}>
                      {app.status === 'pending_payment' ? 'Pending Payment' : app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </Badge>
                    <span className="text-sm text-slate-500">{formatDate(app.submittedAt)}</span>
                    <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-gov-blue transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
