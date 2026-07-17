import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { Home } from './pages/Home';
import { LicenceTypes } from './pages/LicenceTypes';
import { HowToApply } from './pages/HowToApply';
import { TrackApplication } from './pages/TrackApplication';
import { AdminLogin } from './pages/admin/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { ApplicationList } from './pages/admin/ApplicationList';
import { ApplicationDetail } from './pages/admin/ApplicationDetail';
import { NewApplication } from './pages/admin/NewApplication';
import { Layout } from './components/Layout';

const queryClient = new QueryClient();

function NotFound() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-black text-slate-900 mb-4">404</h1>
        <p className="text-xl text-slate-600 mb-8">Page not found</p>
        <a href="/" className="text-gov-blue hover:underline font-bold">Return to home</a>
      </div>
    </Layout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/licence-types" component={LicenceTypes} />
      <Route path="/how-to-apply" component={HowToApply} />
      <Route path="/track" component={TrackApplication} />
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/dashboard" component={Dashboard} />
      <Route path="/admin/applications/new" component={NewApplication} />
      <Route path="/admin/applications/:id" component={ApplicationDetail} />
      <Route path="/admin/applications" component={ApplicationList} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
