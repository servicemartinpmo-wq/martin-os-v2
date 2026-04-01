import React from 'react';
import { products, bundle } from '../../data/pricingData';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#010409] text-white p-10 md:p-20">
      <h1 className="text-5xl font-bold mb-6 text-center">Pricing</h1>
      <p className="text-slate-400 text-center mb-16">Choose the plan that fits your leadership needs.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {products.map((product) => (
          <div key={product.name} className="bg-[#0d1117] p-8 rounded-2xl border border-slate-800">
            <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
            <p className="text-sm text-slate-400 mb-4">{product.positioning}</p>
            <div className="space-y-4">
              {product.tiers.map((tier) => (
                <div 
                  key={tier.name} 
                  className={`p-4 rounded-lg border ${tier.isGlowing ? 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)] bg-indigo-950/20' : 'border-slate-700 bg-slate-800/50'}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">{tier.name}</h3>
                    <span className="text-xl font-bold">{tier.price}</span>
                  </div>
                  <p className="text-xs text-slate-400">{tier.bestFor}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 p-8 rounded-2xl border border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]">
        <h2 className="text-3xl font-bold mb-2">💎 {bundle.name}</h2>
        <p className="text-xl font-bold mb-4">{bundle.price}</p>
        <p className="text-slate-200 mb-4">{bundle.description}</p>
        <p className="text-sm text-indigo-200 italic">{bundle.includes}</p>
      </div>
    </div>
  );
}
