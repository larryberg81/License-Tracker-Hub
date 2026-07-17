import { useState, useRef, useCallback } from 'react';
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
import {
  Search, AlertCircle, FileText, CheckCircle2, Clock,
  Truck, ShieldAlert, Upload, Download, X, ImageIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

/* ─── status helpers ─── */
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

/* ─── watermark helper ─── */
function applyWatermark(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Watermark styling
      const text = 'UK DVLA';
      const fontSize = Math.max(28, Math.round(img.width / 14));
      ctx.font = `bold ${fontSize}px Arial, sans-serif`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.18)';
      ctx.lineWidth = fontSize / 16;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Tile diagonally
      const step = fontSize * 4.5;
      ctx.save();
      ctx.rotate(-Math.PI / 5);
      const diagonal = Math.sqrt(img.width ** 2 + img.height ** 2);
      for (let y = -diagonal; y < diagonal * 1.5; y += step) {
        for (let x = -diagonal; x < diagonal * 1.5; x += step) {
          ctx.strokeText(text, x, y);
          ctx.fillText(text, x, y);
        }
      }
      ctx.restore();

      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Image failed to load')); };
    img.src = url;
  });
}

/* ─── Watermark uploader component ─── */
function WatermarkUploader() {
  const [preview, setPreview] = useState<string | null>(null);
  const [watermarked, setWatermarked] = useState<string | null>(null);
  const [filename, setFilename] = useState('');
  const [processing, setProcessing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  const processFile = useCallback(async (file: File) => {
    if (!ACCEPTED.includes(file.type)) {
      setError('Please upload a JPG, PNG, WEBP or GIF image.');
      return;
    }
    setError('');
    setFilename(file.name.replace(/\.[^.]+$/, ''));
    setPreview(URL.createObjectURL(file));
    setWatermarked(null);
    setProcessing(true);
    try {
      const result = await applyWatermark(file);
      setWatermarked(result);
    } catch {
      setError('Could not process the image. Please try a different file.');
    } finally {
      setProcessing(false);
    }
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const onDownload = () => {
    if (!watermarked) return;
    const a = document.createElement('a');
    a.href = watermarked;
    a.download = `${filename || 'document'}-uk-dvla.png`;
    a.click();
  };

  const onClear = () => {
    setPreview(null);
    setWatermarked(null);
    setFilename('');
    setError('');
  };

  return (
    <Card className="border-2 border-slate-200 shadow-md overflow-hidden mt-10">
      <div className="bg-slate-50 border-b border-slate-200 p-4 sm:px-6 flex items-center gap-3">
        <ImageIcon className="text-gov-blue h-5 w-5" />
        <h2 className="font-bold text-lg">Add UK DVLA watermark to a document</h2>
      </div>
      <CardContent className="p-6 space-y-6">
        <p className="text-sm text-slate-600">
          Upload an image of your document and we will stamp it with an official <strong>UK DVLA</strong> watermark.
          The watermarked image can be downloaded for your records.
        </p>

        {/* Drop zone */}
        {!preview && (
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors
              ${dragging ? 'border-gov-blue bg-blue-50' : 'border-slate-300 hover:border-gov-blue hover:bg-slate-50'}`}
          >
            <Upload className={`h-10 w-10 ${dragging ? 'text-gov-blue' : 'text-slate-400'}`} />
            <div className="text-center">
              <p className="font-bold text-slate-700">Drag and drop an image here</p>
              <p className="text-sm text-slate-500 mt-1">or click to browse — JPG, PNG, WEBP, GIF accepted</p>
            </div>
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={onFileChange}
          className="hidden"
        />

        {error && (
          <div className="bg-red-50 border-l-4 border-red-600 p-4 text-red-800 text-sm font-medium">{error}</div>
        )}

        {/* Preview pane */}
        {preview && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Original */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Original</p>
                <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center min-h-[200px]">
                  <img src={preview} alt="Original upload" className="max-w-full max-h-72 object-contain" />
                </div>
              </div>

              {/* Watermarked */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">With watermark</p>
                <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center min-h-[200px]">
                  {processing ? (
                    <div className="flex flex-col items-center gap-3 p-8">
                      <div className="h-8 w-8 border-4 border-gov-blue border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm text-slate-500">Applying watermark…</p>
                    </div>
                  ) : watermarked ? (
                    <img src={watermarked} alt="Watermarked" className="max-w-full max-h-72 object-contain" />
                  ) : null}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-4">
              {watermarked && (
                <Button onClick={onDownload} className="bg-gov-green hover:bg-green-700 text-white font-bold gap-2">
                  <Download className="h-4 w-4" />
                  Download watermarked image
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => fileRef.current?.click()}
                className="border-gov-blue text-gov-blue hover:bg-blue-50 gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload a different image
              </Button>
              <Button variant="ghost" onClick={onClear} className="text-slate-500 hover:text-slate-700 gap-1">
                <X className="h-4 w-4" />
                Clear
              </Button>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

/* ─── Main page ─── */
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
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingInput.trim()) setSubmittedCode(trackingInput.trim().toUpperCase());
  };

  return (
    <Layout>
      <div className="bg-white py-8 sm:py-12 min-h-[70vh]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">

          <div className="mb-8">
            <Link href="/" className="text-gov-blue hover:underline text-sm font-medium mb-4 inline-block">Back</Link>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-6 tracking-tight">
              Track your application
            </h1>
            <p className="text-xl text-slate-700 leading-relaxed mb-8">
              Check the status of your driving licence application using your unique tracking reference number.
            </p>
          </div>

          {/* Tracking search card */}
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
                  <p className="text-sm text-slate-600">For example, KHANX902077SN9JU 35</p>
                  <Input
                    id="trackingCode"
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value)}
                    placeholder="XXXXX000000XX0XX 00"
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

          {/* Tracking results */}
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

          {/* Watermark uploader — always visible */}
          <WatermarkUploader />

        </div>
      </div>
    </Layout>
  );
}
