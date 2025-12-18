'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on role
      router.push(user.role === 'admin' ? '/admin' : '/app');
    } else {
      // Redirect to login
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);

  // Loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-slate-900 rounded-xl mb-4">
          <span className="text-white font-bold text-2xl">C</span>
        </div>
        <p className="text-slate-600">Loading...</p>
      </div>
    </div>
  );
}
