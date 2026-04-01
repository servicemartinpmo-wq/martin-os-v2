import React from 'react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#010409] text-white p-10 md:p-20">
      <h1 className="text-5xl font-bold mb-8">Contact Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <p className="text-xl text-slate-400 mb-8">
            Get in touch with the Martin PMO team to discuss your operational needs and how our Tri-Pillar System Solution can support your sustainable growth.
          </p>
          <div className="space-y-4 text-slate-300">
            <p><strong>Email:</strong> support@martinpmo.com</p>
            <p><strong>Office:</strong> Global Operations Command</p>
            <p><strong>Hours:</strong> 24/7 Operational Support</p>
          </div>
        </div>
        <div className="bg-[#0d1117] p-8 rounded-3xl border border-slate-800">
          <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
          <form className="space-y-4">
            <input type="text" placeholder="Name" className="w-full p-3 bg-slate-900 rounded-lg border border-slate-700" />
            <input type="email" placeholder="Email" className="w-full p-3 bg-slate-900 rounded-lg border border-slate-700" />
            <textarea placeholder="Message" className="w-full p-3 bg-slate-900 rounded-lg border border-slate-700 h-32"></textarea>
            <button type="submit" className="w-full p-3 bg-indigo-600 rounded-lg font-bold hover:bg-indigo-700">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
}
