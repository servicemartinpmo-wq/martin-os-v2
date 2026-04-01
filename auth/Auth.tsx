import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { motion } from 'motion/react';
import { Lock, Mail, Key, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AuthProps {
  onSignInSuccess: () => void;
  onSignUpSuccess: () => void;
  initialIsSignUp?: boolean;
}

export default function Auth({ onSignInSuccess, onSignUpSuccess, initialIsSignUp = false }: AuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(initialIsSignUp);
  const verifierRef = React.useRef<string>('');

  const generateCodeVerifier = () => {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    const verifier = btoa(String.fromCharCode(...array))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    return verifier;
  };

  const generateCodeChallenge = async (verifier: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    const bytes = new Uint8Array(digest);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setError('Supabase is not configured. Please check your environment variables.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        onSignUpSuccess();
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onSignInSuccess();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'azure') => {
    if (!supabase) {
      setError('Supabase is not configured. Please check your environment variables.');
      return;
    }
    try {
      setLoading(true);
      setError(null);

      if (provider === 'google') {
        const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            skipBrowserRedirect: true,
            redirectTo: `${window.location.origin}/auth/callback`
          }
        });

        if (oauthError) throw oauthError;
        if (!data?.url) throw new Error('No OAuth URL returned');

        const authWindow = window.open(
          data.url,
          'google_oauth',
          'width=600,height=700'
        );

        if (!authWindow) {
          throw new Error('Popup blocked. Please allow popups for this site.');
        }

        // Add a check for popup closing to reset loading state
        const checkPopup = setInterval(() => {
          if (!authWindow || authWindow.closed) {
            clearInterval(checkPopup);
            setLoading(false);
          }
        }, 1000);

        const handleMessage = async (event: MessageEvent) => {
          if (event.origin !== window.location.origin) return;

          if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
            clearInterval(checkPopup);
            try {
              const { hash, query } = event.data;
              console.log('DEBUG V1.7: Received from popup:', { hash, query });
              
              if (hash && hash.includes('access_token')) {
                const params = new URLSearchParams(hash.substring(1));
                const access_token = params.get('access_token');
                const refresh_token = params.get('refresh_token');
                if (access_token && refresh_token) {
                  const { error } = await supabase.auth.setSession({ access_token, refresh_token });
                  if (error) throw error;
                  window.removeEventListener('message', handleMessage);
                  onSignInSuccess?.();
                  return;
                }
              }
              
              if (query && query.includes('code=')) {
                const params = new URLSearchParams(query);
                const code = params.get('code');
                if (code) {
                  const { error } = await supabase.auth.exchangeCodeForSession(code);
                  if (error) throw error;
                  window.removeEventListener('message', handleMessage);
                  onSignInSuccess?.();
                  return;
                }
              }

              throw new Error('No valid authentication data received from popup.');
            } catch (err: any) {
              console.error('Auth error V1.7:', err);
              setError(`Authentication failed: ${err.message || 'Unknown error'}`);
            } finally {
              setLoading(false);
            }
          }
        };

        window.addEventListener('message', handleMessage);
      } else {
        const { error } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: window.location.origin,
          }
        });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to initialize sign-in');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl transform rotate-3">
            <Lock className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-black text-black tracking-tight">
          Apphia
        </h2>
        <p className="mt-2 text-center text-sm text-black font-black uppercase tracking-widest">
          {isSignUp ? 'Create your account' : 'Sign in to your workspace'}
        </p>
        <p className="text-[8px] text-center text-black mt-1 font-bold">v1.5-debug</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-3xl sm:px-10 border border-slate-100">
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 font-medium">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleEmailAuth}>
            <div>
              <label className="block text-xs font-black text-black uppercase tracking-widest mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-400 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all placeholder-slate-500 text-black font-medium"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-black uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-400 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all placeholder-slate-500 text-black font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isSignUp ? 'Create Account' : 'Sign In')}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-black font-black uppercase tracking-widest text-[10px]">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => handleOAuth('google')}
                className="w-full inline-flex justify-center py-3 px-4 border-2 border-slate-300 rounded-xl shadow-sm bg-white text-sm font-black text-black hover:bg-slate-50 transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              </button>
              <button
                onClick={() => handleOAuth('azure')}
                className="w-full inline-flex justify-center py-3 px-4 border-2 border-slate-300 rounded-xl shadow-sm bg-white text-sm font-black text-black hover:bg-slate-50 transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 21 21">
                  <path fill="#f25022" d="M1 1h9v9H1z" />
                  <path fill="#00a4ef" d="M1 11h9v9H1z" />
                  <path fill="#7fba00" d="M11 1h9v9h-9z" />
                  <path fill="#ffb900" d="M11 11h9v9h-9z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center space-y-2">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="block w-full text-sm font-bold text-blue-600 hover:text-blue-500 transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
