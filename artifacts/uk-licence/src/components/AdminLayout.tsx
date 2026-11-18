import React, { useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { ShieldCheck, LayoutDashboard, Users, FileText, Settings, LogOut, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();

  // Simple unauthenticated check for demo purposes
  // In a real app, verify the token's validity using an API endpoint
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token && location !== '/admin') {
      setLocation('/admin');
    }
  }, [location, setLocation]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setLocation('/admin');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans text-slate-900">
      {/* Mobile Header */}
      <header className="md:hidden bg-gov-blue text-white p-4 flex justify-between items-center">
        <Link href="/admin/dashboard" className="flex items-center gap-2 font-bold text-xl">
          <ShieldCheck className="h-6 w-6" />
          <span>Admin Hub</span>
        </Link>
        <button onClick={handleLogout} className="p-2 bg-white/10 rounded">
          <LogOut className="h-5 w-5" />
        </button>
      </header>

      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white min-h-screen shrink-0 shadow-xl">
        <div className="p-6 border-b border-white/10">
          <Link href="/admin/dashboard" className="flex items-center gap-3 font-bold text-2xl tracking-tight text-white hover:text-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400">
            <ShieldCheck className="h-8 w-8 text-gov-green" />
            <span>Admin Hub</span>
          </Link>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1">
          {[
            { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { path: '/admin/applications', label: 'Applications', icon: FileText },
            { path: '/admin/applications/new', label: 'New Application', icon: Plus },
          ].map((route) => {
            const isActive = location === route.path || (route.path !== '/admin/dashboard' && location.startsWith(route.path));
            return (
              <Link
                key={route.path}
                href={route.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400",
                  isActive 
                    ? "bg-gov-blue text-white shadow-inner" 
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
              >
                <route.icon className={cn("h-5 w-5", isActive ? "text-gov-green" : "text-slate-400")} />
                {route.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-slate-300 hover:bg-red-950/30 hover:text-red-400 w-full transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto bg-slate-50">
        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
