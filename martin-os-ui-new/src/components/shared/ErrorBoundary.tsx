import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }: any) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-50 p-8 text-center">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <span className="text-4xl font-bold text-red-600">!</span>
      </div>
      <h1 className="text-2xl font-black text-slate-900 mb-4">Something went wrong.</h1>
      <p className="text-slate-500 max-w-md mb-8">The Apphia engine encountered an unexpected error: {error.message}</p>
      <button 
        onClick={resetErrorBoundary}
        className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest transition-all hover:scale-105"
      >
        Reload Application
      </button>
    </div>
  );
}

export default function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        window.location.reload();
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}
