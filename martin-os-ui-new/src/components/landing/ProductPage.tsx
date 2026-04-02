import React from 'react';
import { products } from '../../data/pricingData';

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-[#010409] text-white p-10 md:p-20">
      <h1 className="text-5xl font-bold mb-16 text-center">Our Ecosystem</h1>
      <div className="space-y-16">
        {products.map((product) => (
          <div key={product.name} className="bg-[#0d1117] p-10 rounded-3xl border border-slate-800">
            <h2 className="text-4xl font-bold mb-2">{product.name}</h2>
            <p className="text-xl text-indigo-400 mb-4 font-semibold">{product.positioning}</p>
            <p className="text-lg text-slate-300 mb-8 italic">"{product.tagline}"</p>
            <p className="text-slate-400 mb-8">{product.overview}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.features.map((feature, index) => (
                <div key={index} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                  <p className="text-sm text-slate-200">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
