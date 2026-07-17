import { useState } from 'react';
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
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useQueryClient } from '@tanstack/react-query';

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
    notes: '',
    estimatedCompletion: '',
  });

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
      ...(formData.notes && { notes: formData.notes }),
      ...(formData.estimatedCompletion && { estimatedCompletion: formData.estimatedCompletion }),
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
                  <Label htmlFor="email" className="font-bold text-slate-700">Email Address</Label>
                  <Input
                    id="email" name="email" type="email"
                    value={formData.email} onChange={handleChange}
                    required className="bg-white"
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
