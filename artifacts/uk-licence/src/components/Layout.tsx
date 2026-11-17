import React from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { ShieldCheck, FileText, Search, BookOpen, Phone } from 'lucide-react';

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-blue-200">
      <header className="bg-slate-900 text-white border-b-4 border-teal-500">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:underline focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gov-blue">
            <BookOpen className="h-8 w-8 shrink-0 text-teal-300" aria-hidden="true" />
            <span className="font-bold text-xl sm:text-2xl leading-tight">
              UK Licence Assistance
            </span>
          </Link>
        </div>
      </header>
      <aside className="bg-amber-50 border-b border-amber-200" aria-label="Independent service notice">
        <p className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 text-sm text-slate-800">
          <strong>Independent assistance service.</strong> Not DVLA, GOV.UK or a government agency. We do not issue driving licences.
          {' '}You can apply directly through <a className="font-semibold underline" href="https://www.gov.uk/browse/driving/driving-licences">GOV.UK</a> without using this service.
        </p>
      </aside>

      {/* Main Navigation */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-8 overflow-x-auto py-3">
            {[
              { path: '/', label: 'Home', icon: ShieldCheck },
              { path: '/how-to-apply', label: 'How to Apply', icon: FileText },
              { path: '/licence-types', label: 'Licence Types', icon: BookOpen },
              { path: '/track', label: 'Track Application', icon: Search },
              { path: '/contact', label: 'Contact', icon: Phone },
            ].map((route) => {
              const isActive = location === route.path;
              return (
                <Link
                  key={route.path}
                  href={route.path}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm font-bold whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2",
                    isActive 
                      ? "text-gov-blue border-b-4 border-gov-blue pb-1" 
                      : "text-slate-600 hover:text-gov-blue hover:bg-slate-50"
                  )}
                >
                  <route.icon className="h-4 w-4" />
                  {route.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 w-full bg-white">
        {children}
      </main>

      {/* Independent service footer */}
      <footer className="bg-slate-200 border-t border-slate-300 py-12 mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-slate-900 mb-4 text-lg">Services and information</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li><Link href="/" className="hover:underline hover:text-gov-blue">Driving and transport</Link></li>
                <li><Link href="/how-to-apply" className="hover:underline hover:text-gov-blue">Application guidance</Link></li>
                <li><Link href="/track" className="hover:underline hover:text-gov-blue">Assistance case tracker</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-4 text-lg">Official external resources</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li><a href="https://www.gov.uk/browse/driving/driving-licences" className="hover:underline hover:text-gov-blue">Driving licence services on GOV.UK</a></li>
                <li><a href="https://www.gov.uk/contact-the-dvla" className="hover:underline hover:text-gov-blue">Contact DVLA directly</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-300 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-gov-blue" />
              <span>UK Licence Assistance is an independent service, not affiliated with DVLA.</span>
            </div>
            <div className="font-bold">
              UK Licence Assistance
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
