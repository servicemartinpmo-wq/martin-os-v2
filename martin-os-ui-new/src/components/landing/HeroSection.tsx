import React from 'react';

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0">
        <img
          src="https://picsum.photos/seed/cinematic-hero/1920/1080"
          alt="Hero Background"
          className="object-cover w-full h-full"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Liquid Glass Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white/20 backdrop-blur-[12px] backdrop-saturate-150 border border-white/30 rounded-3xl p-12 max-w-3xl text-center shadow-lg">
          <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg">
            Your Hero Title
          </h1>
          <p className="mt-6 text-lg text-white/80">
            Cinematic visuals meet intelligent operations.
          </p>
        </div>
      </div>

      {/* Scroll Cue */}
      <div className="absolute bottom-8 w-full flex justify-center animate-bounce space-x-1">
        <span className="block w-3 h-3 rounded-full bg-white/80"></span>
        <span className="block w-3 h-3 rounded-full bg-white/80"></span>
        <span className="block w-3 h-3 rounded-full bg-white/80"></span>
      </div>
    </section>
  );
}
