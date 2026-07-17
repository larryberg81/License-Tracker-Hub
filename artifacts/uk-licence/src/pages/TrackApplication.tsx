import { useState } from 'react';
import { Link } from 'wouter';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  useTrackApplication,
  getTrackApplicationQueryKey,
} from '@workspace/api-client-react';
import { formatDate } from '@/lib/utils';
import { Search, AlertCircle, FileText, CheckCircle2, Clock, Truck, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

const getStatusDisplay = (status: string) => {
  switch (status) {
    case 'registered':
      return { label: 'Application Received', color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-300', icon: FileText, percent: 25 };
    case 'pending_payment':
      return { label: 'Awaiting Payment', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-300', icon: AlertCircle, percent: 50 };
    case 'processing':
      return { label: 'Processing', color: 'text-gov-blue', bg: 'bg-blue-50', border: 'border-blue-300', icon: Clock, percent: 75 };
    case 'processed':
      return { label: 'Licence Dispatched', color: 'text-gov-green', bg: 'bg-green-50', border: 'border-green-300', icon: CheckCircle2, percent: 100 };
    default:
      return { label: 'Unknown', color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-300', icon: FileText, percent: 0 };
  }
};

export function TrackApplication() {
  const [trackingInput, setTrackingInput] = useState('');
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  const { data: application, isLoading, isError } = useTrackApplication(
    submittedCode ? { code: submittedCode } : undefined,
    {
      query: {
        enabled: !!submittedCode,
        retry: 1,
        queryKey: getTrackApplicationQueryKey(submittedCode ? { code: submittedCode } : undefined),
      }
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingInput.trim()) {
      setSubmittedCode(trackingInput.trim().toUpperCase());
    }
  };

  return (
    <Layout>
      <div className="bg-white py-8 sm:py-12 min-h-[70vh]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">

          <div className="mb-8">
            <Link href="/" className="text-gov-blue hover:underline text-sm font-medium mb-4 inline-block">
              Back
            </Link>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-6 tracking-tight">
              Track your application
            </h1>
            <p className="text-xl text-slate-700 leading-relaxed mb-8">
              Check the status of your driving licence application using your unique tracking reference number.
            </p>
          </div>

          <Card className="border-2 border-slate-200 shadow-md overflow-hidden mb-12">
            <div className="bg-slate-50 border-b border-slate-200 p-4 sm:px-6 flex items-center gap-3">
              <Search className="text-gov-blue h-5 w-5" />
              <h2 className="font-bold text-lg">Enter your tracking reference</h2>
            </div>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="trackingCode" className="text-base font-bold text-slate-900">
                    Tracking reference number
                  </Label>
                  <p className="text-sm text-slate-600">For example, KHANX902077SN9JU</p>
                  <Input
                    id="trackingCode"
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value)}
                    placeholder="XXXXX000000XX0XX"
                    className="max-w-md uppercase font-mono text-lg py-6"
                    required
                  />
                </div>
                <Button type="submit" size="lg" className="bg-gov-green hover:bg-green-700 text-white font-bold px-8 shadow-sm">
                  Find application
                </Button>
              </form>
            </CardContent>
          </Card>

          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div key="loading" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <Card className="border-slate-200">
                  <CardContent className="p-6 sm:p-8 space-y-6">
                    <Skeleton className="h-8 w-48 mb-4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-24 w-full mt-6" />
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {isError && !isLoading && (
              <motion.div key="error" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="bg-red-50 border-l-4 border-red-600 p-6 flex gap-4">
                  <ShieldAlert className="h-6 w-6 text-red-600 shrink-0" />
                  <div>
                    <h3 className="font-bold text-red-900 text-lg mb-1">Application not found</h3>
                    <p className="text-red-800">
                      We could not find an application with reference <strong className="font-mono">{submittedCode}</strong>. Please check the reference and try again.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {application && !isLoading && !isError && (() => {
              const statusDisplay = getStatusDisplay(application.status);
              const StatusIcon = statusDisplay.icon;
              return (
                <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <Card className={`border-2 ${statusDisplay.border} shadow-md overflow-hidden`}>
                    <div className={`${statusDisplay.bg} border-b ${statusDisplay.border} p-6 sm:px-8`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Status</p>
                          <h2 className={`text-3xl font-black ${statusDisplay.color} flex items-center gap-3`}>
                            <StatusIcon className="h-8 w-8" />
                            {application.statusLabel}
                          </h2>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Reference</p>
                          <p className="font-mono font-bold text-lg text-slate-900">{application.trackingCode}</p>
                        </div>
                      </div>

                      {application.statusDescription && (
                        <p className="text-slate-700 mb-4 text-sm">{application.statusDescription}</p>
                      )}

                      <div className="overflow-hidden h-2 rounded bg-white/50 border border-slate-200 shadow-inner">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${statusDisplay.percent}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className={`h-full ${application.status === 'processed' ? 'bg-gov-green' : 'bg-gov-blue'}`}
                        />
                      </div>
                      <div className="flex justify-between text-xs font-bold text-slate-500 mt-1">
                        <span>Registered</span>
                        <span>Pending Payment</span>
                        <span>Processing</span>
                        <span>Processed</span>
                      </div>
                    </div>

                    <CardContent className="p-6 sm:p-8">
                      <div className="grid sm:grid-cols-2 gap-8">
                        <div>
                          <h3 className="font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">Applicant Details</h3>
                          <dl className="space-y-3">
                            <div>
                              <dt className="text-sm font-bold text-slate-500">Name</dt>
                              <dd className="text-lg font-medium text-slate-900">{application.fullName}</dd>
                            </div>
                            <div>
                              <dt className="text-sm font-bold text-slate-500">Licence Type</dt>
                              <dd className="text-lg font-medium text-slate-900">{application.licenceType}</dd>
                            </div>
                          </dl>
                        </div>

                        <div>
                          <h3 className="font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">Application Timeline</h3>
                          <dl className="space-y-3">
                            <div>
                              <dt className="text-sm font-bold text-slate-500">Date Submitted</dt>
                              <dd className="text-lg font-medium text-slate-900">{formatDate(application.submittedAt)}</dd>
                            </div>
                            {application.estimatedCompletion && (
                              <div>
                                <dt className="text-sm font-bold text-slate-500">Estimated Completion</dt>
                                <dd className="text-lg font-medium text-slate-900">{formatDate(application.estimatedCompletion)}</dd>
                              </div>
                            )}
                            {application.notes && (
                              <div>
                                <dt className="text-sm font-bold text-slate-500">Notes</dt>
                                <dd className="text-sm font-medium text-slate-700 bg-slate-50 p-3 rounded border border-slate-100 mt-1">{application.notes}</dd>
                              </div>
                            )}
                          </dl>
                        </div>
                      </div>

                      {application.status === 'processed' && (
                        <div className="mt-8 bg-green-50 p-4 rounded-md border border-green-200 flex gap-3">
                          <Truck className="h-6 w-6 text-green-700 shrink-0" />
                          <div>
                            <p className="font-bold text-green-900 mb-1">Your licence is on its way</p>
                            <p className="text-green-800 text-sm">Please allow up to 3 working days for delivery via Royal Mail.</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })()}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}
