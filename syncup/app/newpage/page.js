"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

const cards = [
  { id: 1, title: 'Profile 1', description: 'This is the first profile.' },
  { id: 2, title: 'Profile 2', description: 'This is the second profile.' },
  { id: 3, title: 'Profile 3', description: 'This is the third profile.' },
];

export default function NewPage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-green-500 to-blue-600 text-white">
      <section className="flex flex-col items-center justify-center flex-grow text-center p-8">
        <h1 className="text-5xl font-bold mb-4 leading-tight">Swipeable Card Carousel</h1>
        <p className="text-lg mb-8">Click the arrows to navigate.</p>

        <div className="relative w-full max-w-lg">
          {/* Previous Button */}
          <button 
            onClick={handlePrev}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white text-black p-2 rounded-full focus:outline-none"
          >
            &#8592;
          </button>

          {/* Card Display */}
          <motion.div
            className="p-6 bg-white text-black rounded-lg shadow-lg"
            animate={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -100 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-2">{cards[currentIndex].title}</h2>
            <p>{cards[currentIndex].description}</p>
          </motion.div>

          {/* Next Button */}
          <button 
            onClick={handleNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white text-black p-2 rounded-full focus:outline-none"
          >
            &#8594;
          </button>
        </div>
      </section>
    </div>
  );
}
