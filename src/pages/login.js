import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') router.push('/dashboard/admin');
      else if (user.role === 'pharmacist') router.push('/dashboard/pharmacist');
      else router.push('/dashboard/customer');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    const res = await login(email, password);
    if (!res.success) {
      setErrorMsg(res.message);
      setSubmitting(false);
    }
  };

  // Mock auto-fill credentials for easy testing
  const autofill = (role) => {
    if (role === 'admin') {
      setEmail('admin@healstore.com');
      setPassword('admin123');
    } else if (role === 'pharmacist') {
      setEmail('pharmacist@healstore.com');
      setPassword('pharmacist123');
    } else {
      setEmail('customer@healstore.com');
      setPassword('customer123');
    }
  };

  return (
    <Layout title="Login - HealStore">
      <div className="flex justify-center items-center py-12">
        <div className="w-full max-w-md glassmorphism-card shadow-2xl p-8 border border-white/20">
          <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-teal-500 to-indigo-650 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h2>
          <p className="text-slate-400 text-center text-sm mb-6">Access your medical store dashboard</p>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-550/20 text-red-500 rounded-xl text-sm font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-primary py-3 rounded-xl mt-2 flex justify-center items-center"
            >
              {submitting ? 'Authenticating...' : 'Login'}
            </button>
          </form>

          {/* Autofill quick login for user convenience */}
          <div className="mt-6 border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
            <p className="text-xs text-center font-semibold text-slate-450 mb-3">Quick Login (Testing Autofills)</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => autofill('customer')}
                className="text-[11px] font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg py-1.5 transition text-center"
              >
                Customer
              </button>
              <button
                onClick={() => autofill('pharmacist')}
                className="text-[11px] font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg py-1.5 transition text-center"
              >
                Pharmacist
              </button>
              <button
                onClick={() => autofill('admin')}
                className="text-[11px] font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg py-1.5 transition text-center"
              >
                Admin
              </button>
            </div>
          </div>

          <p className="text-sm text-center text-slate-450 mt-6">
            Don't have an account?{' '}
            <Link href="/register" className="text-teal-500 hover:underline font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
