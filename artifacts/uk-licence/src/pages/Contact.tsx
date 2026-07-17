import { useState } from 'react';
import { Link } from 'wouter';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Phone, Mail, MapPin, CreditCard, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FormData {
  fullName: string;
  phoneNumber: string;
  licenceNumber: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postcode: string;
  email: string;
}

interface FormErrors {
  fullName?: string;
  phoneNumber?: string;
  licenceNumber?: string;
  addressLine1?: string;
  city?: string;
  postcode?: string;
  email?: string;
}

const PHONE_RE = /^(\+44\s?|0)[1-9]\d{8,9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const POSTCODE_RE = /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i;

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.fullName.trim()) {
    errors.fullName = 'Enter your full name';
  }

  if (!data.phoneNumber.trim()) {
    errors.phoneNumber = 'Enter a phone number';
  } else if (!PHONE_RE.test(data.phoneNumber.replace(/\s/g, ''))) {
    errors.phoneNumber = 'Enter a valid UK phone number, for example 07700 900 982';
  }

  if (!data.licenceNumber.trim()) {
    errors.licenceNumber = 'Enter your licence number';
  } else if (data.licenceNumber.trim().length < 5) {
    errors.licenceNumber = 'Enter a valid licence or application reference number';
  }

  if (!data.addressLine1.trim()) {
    errors.addressLine1 = 'Enter the first line of your address';
  }

  if (!data.city.trim()) {
    errors.city = 'Enter your town or city';
  }

  if (!data.postcode.trim()) {
    errors.postcode = 'Enter your postcode';
  } else if (!POSTCODE_RE.test(data.postcode.trim())) {
    errors.postcode = 'Enter a real postcode, for example SW1A 2AA';
  }

  if (!data.email.trim()) {
    errors.email = 'Enter an email address';
  } else if (!EMAIL_RE.test(data.email.trim())) {
    errors.email = 'Enter an email address in the correct format, like name@example.com';
  }

  return errors;
}

export function Contact() {
  const [form, setForm] = useState<FormData>({
    fullName: '',
    phoneNumber: '',
    licenceNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postcode: '',
    email: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (touched[field]) {
      // live-revalidate once the field has been touched
      setErrors((prev) => {
        const updated = validate({ ...form, [field]: e.target.value });
        return { ...prev, [field]: updated[field as keyof FormErrors] };
      });
    }
  };

  const blur = (field: keyof FormData) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => {
      const updated = validate(form);
      return { ...prev, [field]: updated[field as keyof FormErrors] };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    setTouched({
      fullName: true,
      phoneNumber: true,
      licenceNumber: true,
      addressLine1: true,
      city: true,
      postcode: true,
      email: true,
    });
    if (Object.keys(errs).length === 0) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <Layout>
        <div className="bg-white py-8 sm:py-12 min-h-[70vh]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="border-l-4 border-gov-green bg-green-50 p-6 mb-8 flex items-start gap-4">
                <CheckCircle2 className="h-7 w-7 text-gov-green shrink-0 mt-0.5" />
                <div>
                  <h1 className="text-2xl font-black text-slate-900 mb-1">
                    Your enquiry has been submitted
                  </h1>
                  <p className="text-slate-700">
                    Thank you, <strong>{form.fullName}</strong>. We have received your message and
                    will contact you at <strong>{form.email}</strong> within 5 working days.
                  </p>
                </div>
              </div>

              <h2 className="text-lg font-bold text-slate-900 mb-3">What happens next</h2>
              <ol className="list-decimal list-inside space-y-2 text-slate-700 mb-8 pl-1">
                <li>A DVLA caseworker will review your enquiry.</li>
                <li>You may receive a follow-up call on the number you provided.</li>
                <li>A confirmation email will be sent to <strong>{form.email}</strong>.</li>
              </ol>

              <div className="flex flex-wrap gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSubmitted(false);
                    setForm({
                      fullName: '', phoneNumber: '', licenceNumber: '',
                      addressLine1: '', addressLine2: '', city: '', postcode: '', email: '',
                    });
                    setTouched({});
                    setErrors({});
                  }}
                  className="border-slate-300"
                >
                  Submit another enquiry
                </Button>
                <Link href="/">
                  <Button className="bg-gov-green hover:bg-green-700 text-white font-bold">
                    Return to home
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </Layout>
    );
  }

  const hasErrors = Object.values(errors).some(Boolean);

  return (
    <Layout>
      <div className="bg-white py-8 sm:py-12 min-h-[70vh]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <div className="mb-8">
            <Link href="/" className="text-gov-blue hover:underline text-sm font-medium mb-4 inline-block">
              ← Back
            </Link>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4 tracking-tight">
              Contact DVLA
            </h1>
            <p className="text-xl text-slate-700 leading-relaxed">
              Use this form to get in touch about your driving licence. We will aim to respond
              within 5 working days.
            </p>
          </div>

          {/* Error summary */}
          <AnimatePresence>
            {hasErrors && Object.keys(touched).length > 0 && (
              <motion.div
                key="error-summary"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-red-50 border-l-4 border-red-600 p-5 mb-8"
                role="alert"
              >
                <h2 className="font-bold text-red-900 text-lg mb-2">There is a problem</h2>
                <ul className="list-disc list-inside space-y-1 text-red-800 text-sm">
                  {(Object.entries(errors) as [keyof FormErrors, string][])
                    .filter(([, msg]) => msg)
                    .map(([field, msg]) => (
                      <li key={field}>
                        <a href={`#${field}`} className="underline hover:no-underline">
                          {msg}
                        </a>
                      </li>
                    ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} noValidate className="space-y-8">
            {/* Personal details */}
            <Card className="border-2 border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-200 p-4 sm:px-6 flex items-center gap-3">
                <User className="h-5 w-5 text-gov-blue" />
                <h2 className="font-bold text-lg text-slate-900">Personal details</h2>
              </div>
              <CardContent className="p-6 space-y-6">

                {/* Full name */}
                <div className="space-y-1">
                  <Label htmlFor="fullName" className="text-base font-bold text-slate-900">
                    Full name
                  </Label>
                  <Input
                    id="fullName"
                    value={form.fullName}
                    onChange={set('fullName')}
                    onBlur={blur('fullName')}
                    autoComplete="name"
                    className={errors.fullName ? 'border-red-600 border-2 focus-visible:ring-red-600' : ''}
                  />
                  {errors.fullName && (
                    <p className="text-red-700 text-sm font-medium mt-1">{errors.fullName}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-base font-bold text-slate-900">
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={set('email')}
                    onBlur={blur('email')}
                    autoComplete="email"
                    className={errors.email ? 'border-red-600 border-2 focus-visible:ring-red-600' : ''}
                  />
                  {errors.email && (
                    <p className="text-red-700 text-sm font-medium mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Phone number */}
                <div className="space-y-1">
                  <Label htmlFor="phoneNumber" className="text-base font-bold text-slate-900">
                    Phone number
                  </Label>
                  <p className="text-sm text-slate-600">For example, 07700 900 982</p>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={form.phoneNumber}
                    onChange={set('phoneNumber')}
                    onBlur={blur('phoneNumber')}
                    autoComplete="tel"
                    className={errors.phoneNumber ? 'border-red-600 border-2 focus-visible:ring-red-600' : ''}
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-700 text-sm font-medium mt-1">{errors.phoneNumber}</p>
                  )}
                </div>

              </CardContent>
            </Card>

            {/* Licence reference */}
            <Card className="border-2 border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-200 p-4 sm:px-6 flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-gov-blue" />
                <h2 className="font-bold text-lg text-slate-900">Licence details</h2>
              </div>
              <CardContent className="p-6">
                <div className="space-y-1">
                  <Label htmlFor="licenceNumber" className="text-base font-bold text-slate-900">
                    Licence number or application reference
                  </Label>
                  <p className="text-sm text-slate-600">
                    Your 16-character driving licence number, or your application tracking reference
                  </p>
                  <Input
                    id="licenceNumber"
                    value={form.licenceNumber}
                    onChange={set('licenceNumber')}
                    onBlur={blur('licenceNumber')}
                    className={`font-mono uppercase ${errors.licenceNumber ? 'border-red-600 border-2 focus-visible:ring-red-600' : ''}`}
                  />
                  {errors.licenceNumber && (
                    <p className="text-red-700 text-sm font-medium mt-1">{errors.licenceNumber}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Address */}
            <Card className="border-2 border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-200 p-4 sm:px-6 flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gov-blue" />
                <h2 className="font-bold text-lg text-slate-900">Address</h2>
              </div>
              <CardContent className="p-6 space-y-6">

                <div className="space-y-1">
                  <Label htmlFor="addressLine1" className="text-base font-bold text-slate-900">
                    Address line 1
                  </Label>
                  <Input
                    id="addressLine1"
                    value={form.addressLine1}
                    onChange={set('addressLine1')}
                    onBlur={blur('addressLine1')}
                    autoComplete="address-line1"
                    className={errors.addressLine1 ? 'border-red-600 border-2 focus-visible:ring-red-600' : ''}
                  />
                  {errors.addressLine1 && (
                    <p className="text-red-700 text-sm font-medium mt-1">{errors.addressLine1}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="addressLine2" className="text-base font-bold text-slate-900">
                    Address line 2 <span className="font-normal text-slate-500">(optional)</span>
                  </Label>
                  <Input
                    id="addressLine2"
                    value={form.addressLine2}
                    onChange={set('addressLine2')}
                    autoComplete="address-line2"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <Label htmlFor="city" className="text-base font-bold text-slate-900">
                      Town or city
                    </Label>
                    <Input
                      id="city"
                      value={form.city}
                      onChange={set('city')}
                      onBlur={blur('city')}
                      autoComplete="address-level2"
                      className={errors.city ? 'border-red-600 border-2 focus-visible:ring-red-600' : ''}
                    />
                    {errors.city && (
                      <p className="text-red-700 text-sm font-medium mt-1">{errors.city}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="postcode" className="text-base font-bold text-slate-900">
                      Postcode
                    </Label>
                    <Input
                      id="postcode"
                      value={form.postcode}
                      onChange={set('postcode')}
                      onBlur={blur('postcode')}
                      autoComplete="postal-code"
                      className={`uppercase ${errors.postcode ? 'border-red-600 border-2 focus-visible:ring-red-600' : ''}`}
                    />
                    {errors.postcode && (
                      <p className="text-red-700 text-sm font-medium mt-1">{errors.postcode}</p>
                    )}
                  </div>
                </div>

              </CardContent>
            </Card>

            <Button
              type="submit"
              size="lg"
              className="bg-gov-green hover:bg-green-700 text-white font-bold px-10 shadow-sm"
            >
              Submit enquiry
            </Button>
          </form>

          {/* Alternative contact info */}
          <div className="mt-12 border-t border-slate-200 pt-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Other ways to contact us</h2>
            <div className="grid sm:grid-cols-2 gap-6 text-sm text-slate-700">
              <div className="flex gap-3">
                <Phone className="h-5 w-5 text-gov-blue shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900">Telephone</p>
                  <p>0300 790 6801</p>
                  <p className="text-slate-500 text-xs mt-1">Monday to Friday, 8am to 7pm<br />Saturday, 8am to 2pm</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Mail className="h-5 w-5 text-gov-blue shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900">Post</p>
                  <p>DVLA<br />Swansea<br />SA99 1BU</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
