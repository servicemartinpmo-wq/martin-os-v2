import React from 'react';

export default function DiscoveryCallPage() {
  return (
    <div className="min-h-screen bg-[#010409] text-white p-10 md:p-20">
      <h1 className="text-5xl font-bold mb-8">Book A Discovery Call</h1>
      <div className="max-w-3xl">
        <p className="text-xl text-slate-400 mb-8">
          Let's discuss how we can help your organization thrive. Schedule a time to speak with our team about your operational challenges and how our Tri-Pillar System Solution can support your sustainable growth.
        </p>
        <div className="bg-[#0d1117] p-10 rounded-3xl border border-slate-800">
          <h2 className="text-2xl font-bold mb-6">Select a Time</h2>
          <p className="text-slate-400 mb-8">Choose a slot that works for you, and we'll send you a calendar invite with all the details.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'].map((time) => (
              <button key={time} className="p-4 bg-slate-900 rounded-lg border border-slate-700 hover:border-indigo-500 transition-all">
                {time}
              </button>
            ))}
          </div>
          <button className="w-full mt-8 p-4 bg-indigo-600 rounded-lg font-bold hover:bg-indigo-700">Confirm Booking</button>
        </div>
      </div>
    </div>
  );
}
