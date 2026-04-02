import React from 'react';
import { Brain, Cpu, Network } from 'lucide-react';
import { products } from '../../data/pricingData';

const getIconForApp = (name: string) => {
  switch (name) {
    case "PMO-Ops": return Brain;
    case "Tech-Ops": return Cpu;
    case "miidle": return Network;
    default: return Brain;
  }
};

export default function AppShowcase() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 px-4 max-w-7xl mx-auto">
      {products.map((product) => {
        const Icon = getIconForApp(product.name);
        return (
          <div key={product.name} className="bg-[#0d1117] p-8 rounded-3xl border border-slate-800 hover:border-indigo-500 transition-all duration-300 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-indigo-950/50 rounded-2xl flex items-center justify-center mb-8 border border-indigo-500/30">
              <Icon className="w-10 h-10 text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-white">{product.name}</h3>
            <p className="text-indigo-400 font-semibold mb-4">{product.positioning}</p>
            <p className="text-slate-300 italic mb-6">"{product.tagline}"</p>
            <ul className="space-y-2 w-full">
              {product.features.map((feature, index) => (
                <li key={index} className="text-xs text-slate-500 font-mono flex items-center justify-center gap-2">
                  <span className="text-indigo-500">▹</span> {feature}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
