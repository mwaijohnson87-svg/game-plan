"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase'; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AuthPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: username }
          }
        });
        if (error) throw error;
        alert("Check your email for the confirmation link!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/portfolio');
      }
    } catch (error: any) {
      setErrorMsg(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <Card className="w-full max-w-md border-slate-800 bg-slate-900 text-slate-100">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {isSignUp ? "Create an Account" : "Welcome Back"}
          </CardTitle>
          <CardDescription className="text-center text-slate-400">
            {isSignUp ? "Sign up to start tracking your portfolio" : "Log in to manage your positions"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-300">Username</label>
                <input 
                  type="text" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-md border border-slate-700 bg-slate-800 p-2 text-white outline-none focus:border-blue-500"
                  required
                />
              </div>
            )}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300">Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-800 p-2 text-white outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-800 p-2 text-white outline-none focus:border-blue-500"
                required
              />
            </div>

            {errorMsg && <p className="text-sm text-red-400 text-center">{errorMsg}</p>}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full rounded-md bg-blue-600 p-2 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
            >
              {loading ? "Processing..." : isSignUp ? "Sign Up" : "Log In"}
            </button>
          </form>

          <div className="mt-4 text-center text-sm">
            <button 
              onClick={() => setIsSignUp(!isSignUp)} 
              className="text-blue-400 hover:underline"
            >
              {isSignUp ? "Already have an account? Log in" : "Don't have an account? Sign up"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}