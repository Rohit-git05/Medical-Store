import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('customer'); // Default to customer
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    const res = await register(name, email, password, phone, role);
    if (res.success) {
      if (role === 'admin') router.push('/dashboard/admin');
      else if (role === 'pharmacist') router.push('/dashboard/pharmacist');
      else router.push('/dashboard/customer');
    } else {
      setErrorMsg(res.message);
      setSubmitting(false);
    }
  };

  return (
    <Layout title="Sign Up - HealStore">
      <div className="flex justify-center items-center py-12">
        <div className="w-full max-w-md glassmorphism-card shadow-2xl p-8 border border-white/20">
          <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-teal-500 to-indigo-650 bg-clip-text text-transparent mb-2">
            Create Account
          </h2>
          <p className="text-slate-400 text-center text-sm mb-6">Join HealStore to manage and order medicines</p>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-550/20 text-red-500 rounded-xl text-sm font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Email Address</label>
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
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9988776655"
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
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Register As</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="input-field"
              >
                <option value="customer">Customer (Order medicines)</option>
                <option value="pharmacist">Pharmacist (Manage inventory & prescriptions)</option>
                <option value="admin">Admin (Manage overall settings)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-primary py-3 rounded-xl mt-2 flex justify-center items-center"
            >
              {submitting ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-sm text-center text-slate-450 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-teal-500 hover:underline font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
