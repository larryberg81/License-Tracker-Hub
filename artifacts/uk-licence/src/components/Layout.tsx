import React from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { ShieldCheck, FileText, Search, BookOpen, Phone } from 'lucide-react';

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-blue-200">
      {/* UK Gov Style Header */}
      <header className="bg-gov-blue text-white border-b-[10px] border-gov-green">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:underline focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gov-blue">
            {/* GOV.UK Tudor Crown SVG */}
            <svg aria-hidden="true" focusable="false" className="h-9 w-auto" viewBox="0 0 132 97" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Base / band */}
              <rect x="14" y="74" width="104" height="14" rx="2" fill="white"/>
              {/* Crown body */}
              <path d="M14 74 L14 52 L33 52 L33 38 L44 52 L66 28 L88 52 L99 38 L99 52 L118 52 L118 74 Z" fill="white"/>
              {/* Arch left */}
              <path d="M14 52 Q14 30 33 30 Q44 30 44 52" fill="none" stroke="white" strokeWidth="0"/>
              {/* Orb top centre */}
              <circle cx="66" cy="24" r="7" fill="white"/>
              <rect x="63" y="8" width="6" height="16" rx="1" fill="white"/>
              <rect x="58" y="13" width="16" height="5" rx="1" fill="white"/>
              {/* Left fleur */}
              <circle cx="14" cy="52" r="6" fill="white"/>
              <rect x="11" y="36" width="6" height="16" rx="1" fill="white"/>
              <rect x="7" y="41" width="14" height="5" rx="1" fill="white"/>
              {/* Right fleur */}
              <circle cx="118" cy="52" r="6" fill="white"/>
              <rect x="115" y="36" width="6" height="16" rx="1" fill="white"/>
              <rect x="111" y="41" width="14" height="5" rx="1" fill="white"/>
              {/* Jewels on band */}
              <circle cx="32" cy="81" r="4" fill="#1d4ed8"/>
              <circle cx="66" cy="81" r="4" fill="#1d4ed8"/>
              <circle cx="100" cy="81" r="4" fill="#1d4ed8"/>
            </svg>
            <span className="font-black text-[28px] leading-none tracking-tight" style={{ fontFamily: 'Arial, sans-serif', letterSpacing: '-0.01em' }}>
              GOV<span className="text-gov-green mx-0.5">·</span>UK
            </span>
          </Link>
        </div>
      </header>

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

      {/* UK Gov Style Footer */}
      <footer className="bg-slate-200 border-t border-slate-300 py-12 mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-slate-900 mb-4 text-lg">Services and information</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li><Link href="/" className="hover:underline hover:text-gov-blue">Driving and transport</Link></li>
                <li><Link href="/" className="hover:underline hover:text-gov-blue">Benefits</Link></li>
                <li><Link href="/" className="hover:underline hover:text-gov-blue">Businesses and self-employed</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-4 text-lg">Departments and policy</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li><Link href="/" className="hover:underline hover:text-gov-blue">How government works</Link></li>
                <li><Link href="/" className="hover:underline hover:text-gov-blue">Departments</Link></li>
                <li><Link href="/" className="hover:underline hover:text-gov-blue">Worldwide</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-300 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-gov-blue" />
              <span>All content is available under the Open Government Licence v3.0, except where otherwise stated</span>
            </div>
            <div className="font-bold">
              © Crown copyright
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
