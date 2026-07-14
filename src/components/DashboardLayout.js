import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';
import DashboardSidebar from './DashboardSidebar';

export default function DashboardLayout({ children, title, allowedRoles }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to homepage if user doesn't have permissions
        router.push('/');
      }
    }
  }, [user, loading]);

  if (loading || !user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-teal-500" />
          <p className="text-sm font-semibold text-slate-400">Verifying session...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout title={title}>
      <div className="flex flex-col md:flex-row gap-8 py-4">
        <DashboardSidebar />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </Layout>
  );
}
// Default dashboard layout wrapper
