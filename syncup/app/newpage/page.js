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
  const [isModalOpen, setModalOpen] = useState(false);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
  };

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-green-500 to-blue-600">
      <header className="w-full text-center py-8">
        <h1 className="text-6xl font-bold text-black">SyncUp</h1>
      </header>

      <section className="flex flex-col items-center justify-center flex-grow text-center p-8 text-black">
        <p className="text-lg mb-8">Click the arrows to navigate.</p>

        <div className="relative w-full max-w-lg h-[620px]">
          <button 
            onClick={handlePrev}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white text-black p-3 rounded-full focus:outline-none"
          >
            &#8592;
          </button>

          <motion.div
            className="p-8 bg-white text-black rounded-lg shadow-lg h-full flex flex-col justify-between"
            animate={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -100 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <h2 className="text-3xl font-bold mb-4">{cards[currentIndex].title}</h2>
              <p>{cards[currentIndex].description}</p>
            </div>

            <button
              onClick={toggleModal}
              className="self-end bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full focus:outline-none"
            >
              Filter
            </button>
          </motion.div>

          <button 
            onClick={handleNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white text-black p-3 rounded-full focus:outline-none"
          >
            &#8594;
          </button>
        </div>
      </section>

     {/* Filter Button */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-black">Set Your Preferences</h3>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Age Range</label>
                <input type="text" className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm text-gray-900" placeholder="20-30" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Interests</label>
                <input type="text" className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm text-gray-900" placeholder="e.g., Reading, Hiking" />
              </div>
              <button type="button" onClick={toggleModal} className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded">Close</button>
              <button type="submit" className="bg-blue-600 hover:bg-blue-800 text-white py-2 px-4 rounded float-right">Save Preferences</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
