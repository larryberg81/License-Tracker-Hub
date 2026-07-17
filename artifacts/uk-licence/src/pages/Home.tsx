import React from 'react';
import { Link } from 'wouter';
import { Layout } from '@/components/Layout';
import { LicenceCard } from '@/components/LicenceCard';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  ChevronRight,
  ArrowRight,
  Clock,
  BookOpen,
  RefreshCw,
  AlertTriangle,
  Globe,
  HeartPulse,
  GraduationCap,
  CreditCard,
  MapPin,
  Eye,
  Car,
  FileText,
  Search,
  Phone,
} from 'lucide-react';
import { motion } from 'framer-motion';

/* ------------------------------------------------------------------ */
/* Data                                                                 */
/* ------------------------------------------------------------------ */

const popularServices = [
  { label: 'Learn to drive a car: step by step', href: '/how-to-apply' },
  { label: 'Apply for your first provisional driving licence', href: '/how-to-apply' },
  { label: 'View or share your driving licence information', href: '/track' },
  { label: 'Tell DVLA you\'ve changed your address', href: '/contact' },
  { label: 'Replace a lost, stolen, damaged or destroyed driving licence', href: '/how-to-apply' },
  { label: 'Renew your driving licence', href: '/how-to-apply' },
  { label: 'Track your driving licence application', href: '/track' },
  { label: 'Contact DVLA', href: '/contact' },
];

const sections = [
  {
    id: 'provisional',
    icon: GraduationCap,
    title: 'Getting a provisional licence',
    color: 'text-gov-blue',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    items: [
      { label: 'Apply for your first provisional driving licence', href: '/how-to-apply', desc: 'You can apply when you\'re 15 years and 9 months old.' },
      { label: 'Learn to drive a car: step by step', href: '/how-to-apply', desc: 'A step-by-step guide to getting your driving licence.' },
      { label: 'Driving licence fees', href: '/how-to-apply', desc: 'Costs for provisional licences, renewals and replacements.' },
      { label: 'Driving licence categories', href: '/licence-types', desc: 'Find out what vehicles each category of licence lets you drive.' },
    ],
  },
  {
    id: 'renew',
    icon: RefreshCw,
    title: 'Renew or replace your licence',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    items: [
      { label: 'Renew your driving licence', href: '/how-to-apply', desc: 'You must renew your photocard licence every 10 years.' },
      { label: 'Replace a lost, stolen or damaged driving licence', href: '/how-to-apply', desc: 'Get a replacement if your licence is lost, stolen, damaged or destroyed.' },
      { label: 'Change the address on your driving licence', href: '/contact', desc: 'You must update DVLA when you move house.' },
      { label: 'Change your name on your driving licence', href: '/contact', desc: 'Update your licence after a name change.' },
    ],
  },
  {
    id: 'your-licence',
    icon: CreditCard,
    title: 'Your driving licence',
    color: 'text-indigo-700',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    items: [
      { label: 'View or share your driving licence information', href: '/track', desc: 'Check your personal driving record and share it with employers or hire companies.' },
      { label: 'Check what vehicles you can drive', href: '/licence-types', desc: 'Find out which vehicle categories you are licensed for.' },
      { label: 'Add new vehicle categories to your licence', href: '/how-to-apply', desc: 'Pass additional tests to drive lorries, minibuses or motorcycles.' },
      { label: 'Track your application', href: '/track', desc: 'Check the progress of a licence application made online or by post.' },
    ],
  },
  {
    id: 'tests',
    icon: BookOpen,
    title: 'Driving tests and learning',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    items: [
      { label: 'Book your theory test', href: '/how-to-apply', desc: 'Book, change or cancel a theory test.' },
      { label: 'Book your driving test', href: '/how-to-apply', desc: 'Book, change or cancel a practical driving test.' },
      { label: 'Check your driving test appointment', href: '/track', desc: 'View the details of your booked test.' },
      { label: 'Check a driving instructor\'s licence', href: '/how-to-apply', desc: 'Find out if a driving instructor is registered with DVSA.' },
    ],
  },
  {
    id: 'medical',
    icon: HeartPulse,
    title: 'Medical conditions and driving',
    color: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200',
    items: [
      { label: 'Medical conditions, disabilities and driving', href: '/how-to-apply', desc: 'Find out which medical conditions you must tell DVLA about.' },
      { label: 'Notify DVLA of a medical condition', href: '/contact', desc: 'Tell DVLA online if your health affects your driving.' },
      { label: 'Reapply for your licence after a medical condition', href: '/how-to-apply', desc: 'Get your licence back once your condition is under control.' },
      { label: 'Appeals against DVLA medical decisions', href: '/contact', desc: 'Challenge a decision to revoke or refuse your driving licence.' },
    ],
  },
  {
    id: 'abroad',
    icon: Globe,
    title: 'Driving in the UK and abroad',
    color: 'text-teal-700',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    items: [
      { label: 'Driving abroad', href: '/how-to-apply', desc: 'What you need to drive legally outside the UK.' },
      { label: 'International driving permit', href: '/how-to-apply', desc: 'Get a permit to drive in some countries outside Great Britain.' },
      { label: 'Exchange a non-GB licence', href: '/how-to-apply', desc: 'Swap a foreign driving licence for a UK one.' },
      { label: 'Driving in Great Britain on a non-GB licence', href: '/how-to-apply', desc: 'Rules for driving in the UK if your licence was issued abroad.' },
    ],
  },
];

const infoBoxes = [
  {
    icon: Clock,
    title: 'Apply online — fastest option',
    body: 'Applying online is the quickest way to get your driving licence. Most online applications are processed within one week.',
    cta: 'Start your application',
    href: '/how-to-apply',
    accent: 'border-gov-blue',
    iconColor: 'text-gov-blue',
  },
  {
    icon: Search,
    title: 'Already applied?',
    body: 'Use your unique tracking reference number to check the current status of your driving licence application at any time.',
    cta: 'Track my application',
    href: '/track',
    accent: 'border-gov-green',
    iconColor: 'text-gov-green',
  },
  {
    icon: Phone,
    title: 'Need help?',
    body: 'Call the DVLA contact centre on 0300 790 6801, Monday to Friday 8am to 7pm, Saturday 8am to 2pm.',
    cta: 'Contact DVLA',
    href: '/contact',
    accent: 'border-slate-400',
    iconColor: 'text-slate-600',
  },
];

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */

export function Home() {
  return (
    <Layout>

      {/* ── Hero ── */}
      <div className="bg-white pb-12 pt-8 sm:py-16 border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl"
            >
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">
                Driver &amp; Vehicle Licensing Agency
              </p>
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4 leading-tight tracking-tight">
                Driving licences
              </h1>
              <p className="text-xl text-slate-700 mb-8 leading-relaxed">
                Apply for, renew or update your licence, view or share your driving licence, add new categories.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/how-to-apply"
                  className={cn(buttonVariants({ size: 'lg' }), 'w-full sm:w-auto bg-gov-green hover:bg-green-700 text-white font-bold text-lg px-8 shadow-md inline-flex')}
                >
                  Start now
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/track"
                  className={cn(buttonVariants({ size: 'lg', variant: 'outline' }), 'w-full sm:w-auto border-2 border-gov-blue text-gov-blue font-bold text-lg hover:bg-slate-50 inline-flex')}
                >
                  Track application
                </Link>
              </div>
            </motion.div>

            <div className="hidden md:flex justify-center lg:justify-end items-center relative py-12">
              <div className="absolute inset-0 bg-blue-50/50 rounded-full blur-3xl transform scale-150 -z-10" />
              <LicenceCard className="rotate-3 lg:rotate-6 transform hover:rotate-0 transition-transform duration-500 z-10" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Popular services ── */}
      <div className="bg-slate-50 py-12 border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <h2 className="text-2xl font-black text-slate-900 mb-6">Popular services</h2>
          <ul className="divide-y divide-slate-200 border-t border-b border-slate-200 bg-white">
            {popularServices.map((s) => (
              <li key={s.label}>
                <Link
                  href={s.href}
                  className="flex items-center gap-3 px-4 py-4 hover:bg-slate-50 group transition-colors"
                >
                  <ArrowRight className="h-4 w-4 text-gov-blue shrink-0 group-hover:translate-x-1 transition-transform" />
                  <span className="text-gov-blue font-medium group-hover:underline">{s.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Info boxes ── */}
      <div className="bg-white py-12 border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="grid sm:grid-cols-3 gap-6">
            {infoBoxes.map((box) => (
              <div
                key={box.title}
                className={`border-l-4 ${box.accent} bg-slate-50 p-6 flex flex-col gap-3`}
              >
                <div className="flex items-center gap-2">
                  <box.icon className={`h-5 w-5 ${box.iconColor} shrink-0`} />
                  <h3 className="font-bold text-slate-900">{box.title}</h3>
                </div>
                <p className="text-sm text-slate-700 flex-1">{box.body}</p>
                <Link href={box.href} className="text-gov-blue font-bold text-sm hover:underline flex items-center gap-1">
                  {box.cta} <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Topic sections ── */}
      <div className="bg-slate-50 py-14">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-12">
          {sections.map((section, si) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: si * 0.05 }}
            >
              {/* Section header */}
              <div className={`flex items-center gap-3 pb-3 border-b-2 border-slate-300 mb-0`}>
                <section.icon className={`h-6 w-6 ${section.color} shrink-0`} />
                <h2 className="text-xl font-black text-slate-900">{section.title}</h2>
              </div>

              {/* Items */}
              <ul className="divide-y divide-slate-200 border-b border-slate-200 bg-white">
                {section.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="flex items-start gap-4 px-4 py-4 hover:bg-slate-50 group transition-colors"
                    >
                      <ArrowRight className={`h-4 w-4 ${section.color} shrink-0 mt-1 group-hover:translate-x-1 transition-transform`} />
                      <div>
                        <span className="text-gov-blue font-semibold group-hover:underline block leading-snug">
                          {item.label}
                        </span>
                        <span className="text-sm text-slate-600 mt-0.5 block">{item.desc}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Related topics banner ── */}
      <div className="bg-gov-blue text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <h2 className="text-2xl font-black mb-6">Related topics</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'MOT', desc: 'Book, check history, appeal results', icon: Car, href: '/how-to-apply' },
              { label: 'Vehicle tax', desc: 'Tax your car, check if taxed', icon: FileText, href: '/how-to-apply' },
              { label: 'Number plates', desc: 'Rules, personalised plates', icon: CreditCard, href: '/how-to-apply' },
              { label: 'Road safety', desc: 'Speed limits, driving rules', icon: AlertTriangle, href: '/how-to-apply' },
            ].map((t) => (
              <Link key={t.label} href={t.href} className="block group">
                <div className="bg-white/10 hover:bg-white/20 border border-white/20 rounded p-4 transition-colors h-full">
                  <t.icon className="h-6 w-6 text-white/70 mb-2" />
                  <p className="font-bold text-white group-hover:underline">{t.label}</p>
                  <p className="text-sm text-white/70 mt-1">{t.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── DVLA notice ── */}
      <div className="bg-white border-t border-slate-200 py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="flex flex-col sm:flex-row gap-6 text-sm text-slate-600">
            <div className="flex-1">
              <p className="font-bold text-slate-900 mb-1">From:</p>
              <p>Driver and Vehicle Licensing Agency (DVLA) and Department for Transport</p>
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-900 mb-1">Published:</p>
              <p>20 June 2012 — last updated 17 July 2026</p>
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-900 mb-1">Part of:</p>
              <p>
                <Link href="/" className="text-gov-blue hover:underline">Driving and transport</Link>,{' '}
                <Link href="/licence-types" className="text-gov-blue hover:underline">Licence types</Link>
              </p>
            </div>
          </div>
        </div>
      </div>

    </Layout>
  );
}
