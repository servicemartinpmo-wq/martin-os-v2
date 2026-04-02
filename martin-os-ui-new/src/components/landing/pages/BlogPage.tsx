import React from 'react';

export default function BlogPage() {
  const posts = [
    { title: 'The Future of Operational Command', date: 'March 2026', excerpt: 'How AI-driven systems are transforming high-stakes operations.' },
    { title: 'Scaling Beyond the Bottleneck', date: 'February 2026', excerpt: 'Strategies for founders to overcome resource constraints.' },
    { title: 'Proof-of-Work: The New Currency of Trust', date: 'January 2026', excerpt: 'Why capturing invisible work is essential for modern teams.' },
  ];

  return (
    <div className="min-h-screen bg-[#010409] text-white p-10 md:p-20">
      <h1 className="text-5xl font-bold mb-16">Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div key={post.title} className="bg-[#0d1117] p-8 rounded-3xl border border-slate-800 hover:border-indigo-500 transition-all">
            <p className="text-sm text-indigo-400 mb-2">{post.date}</p>
            <h2 className="text-2xl font-bold mb-4">{post.title}</h2>
            <p className="text-slate-400 mb-6">{post.excerpt}</p>
            <button className="text-indigo-400 font-bold hover:text-indigo-300">Read More →</button>
          </div>
        ))}
      </div>
    </div>
  );
}
