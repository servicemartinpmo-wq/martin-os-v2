"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight } from 'lucide-react';

interface OnboardingSlide {
  id: number;
  image: string;
  title: string;
  description: string;
}

const slides: OnboardingSlide[] = [
  {
    id: 1,
    image: 'https://picsum.photos/seed/pmo1/400/400',
    title: 'Welcome to Martin-OS',
    description: 'Your centralized hub for strategic initiatives and operational excellence.'
  },
  {
    id: 2,
    image: 'https://picsum.photos/seed/pmo2/400/400',
    title: 'Command Center',
    description: 'Monitor compliance, velocity, and risk exposure in real-time.'
  },
  {
    id: 3,
    image: 'https://picsum.photos/seed/pmo3/400/400',
    title: 'Execute with Confidence',
    description: 'Track initiatives, manage checklists, and stay on top of system reminders.'
  }
];

interface OnboardingCarouselProps {
  onComplete: () => void;
}

const OnboardingCarousel = ({ onComplete }: OnboardingCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative">
      <button 
        onClick={handleSkip}
        className="absolute top-6 right-6 text-orange-500 font-semibold"
      >
        Skip
      </button>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="flex flex-col items-center text-center space-y-8"
        >
          <div className="relative w-64 h-64">
            <div className="absolute inset-0 border-2 border-orange-500 rounded-full" />
            <img 
              src={slides[currentIndex].image} 
              alt={slides[currentIndex].title}
              className="w-full h-full rounded-full object-cover p-2"
              referrerPolicy="no-referrer"
            />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-black">{slides[currentIndex].title}</h2>
            <p className="text-gray-500 text-sm max-w-xs">{slides[currentIndex].description}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-2 mt-8">
        {slides.map((_, index) => (
          <div 
            key={index}
            className={`w-2 h-2 rounded-full ${index === currentIndex ? 'bg-orange-500' : 'bg-gray-300'}`}
          />
        ))}
      </div>

      <button 
        onClick={handleNext}
        className="mt-8 p-4 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default OnboardingCarousel;
