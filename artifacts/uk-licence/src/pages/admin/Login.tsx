import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { ShieldCheck, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useAdminLogin } from '@workspace/api-client-react';

export function AdminLogin() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const loginMutation = useAdminLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    loginMutation.mutate(
      { data: { username, password } },
      {
        onSuccess: (res) => {
          localStorage.setItem('admin_token', res.token);
          setLocation('/admin/dashboard');
        },
        onError: () => {
          setError('Invalid username or password.');
        }
      }
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-8 text-white">
          <ShieldCheck className="h-16 w-16 text-gov-green mb-4" />
          <h1 className="text-3xl font-black tracking-tight">GOV.UK Admin Hub</h1>
          <p className="text-slate-400 mt-2">Authorised personnel only</p>
        </div>

        <Card className="border-0 shadow-2xl overflow-hidden">
          <div className="bg-gov-blue h-2 w-full"></div>
          <CardHeader className="bg-white pb-4 border-b border-slate-100">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Lock className="h-5 w-5 text-gov-blue" />
              Sign In
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-slate-50 pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-3 text-red-700 text-sm font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="username" className="font-bold text-slate-700">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-white border-slate-300"
                  required
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="font-bold text-slate-700">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white border-slate-300"
                  required
                  autoComplete="current-password"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gov-blue hover:bg-blue-800 text-white font-bold py-6 text-lg shadow-md"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-8 text-slate-500 text-sm">
          <p>This system is for the use of authorised users only.</p>
          <p className="mt-1">All activities may be recorded and monitored.</p>
        </div>
      </motion.div>
    </div>
  );
}
