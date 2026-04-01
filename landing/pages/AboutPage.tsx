import React from 'react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#010409] text-white p-10 md:p-20">
      <h1 className="text-5xl font-bold mb-8">About Martin PMO</h1>
      <div className="space-y-8 text-lg text-slate-300">
        <p>
          Martin PMO is a high-fidelity operational command center designed for founders and executives who require absolute clarity across complex initiatives. We deliver more than just staffing support; we build the systems that power sustainable growth.
        </p>
        <p>
          Our mission is to transform fragmented organizational noise into structured intelligence, empowering organizations to scale efficiently. We specialize in operational solutions rooted in deep expertise and a commitment to helping leaders act with confidence.
        </p>
        <h2 className="text-3xl font-bold text-white mt-12 mb-4">Our Core Philosophy</h2>
        <p>
          We believe that operational excellence is not just about managing tasks; it's about creating a unified ecosystem where strategy, execution, and storytelling align. Our Tri-Pillar System Solution—PMO-Ops, Tech-Ops, and miidle—provides the foundational infrastructure for modern, high-growth organizations.
        </p>
        <h2 className="text-3xl font-bold text-white mt-12 mb-4">The Martin PMO Advantage</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Operational Mapping:</strong> We create, optimize, and automate your SOPs and workflows.</li>
          <li><strong>Technical Resolution:</strong> We bridge the gap between technical failure and business continuity.</li>
          <li><strong>Proof-of-Work:</strong> We capture the invisible work—decisions, pivots, and technical wins—to build your organization's unique narrative.</li>
        </ul>
      </div>
    </div>
  );
}
