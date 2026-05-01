'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Registration failed');
        return;
      }
      const signInRes = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (signInRes?.error) {
        setError(signInRes.error);
      } else {
        router.push('/feed');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] flex items-center justify-center font-sans">
      <div className="bg-white dark:bg-[#121212] p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Sign Up for Tolee</h1>
        {error && <div className="mb-4 text-red-500 text-sm text-center">{error}</div>}
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900" placeholder="Your Name" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900" placeholder="••••••••" />
            </div>
            <button type="submit" className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Create Account
            </button>
        </form>
      </div>
    </div>
  );
}
