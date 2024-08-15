"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchUserProfiles } from '../../services/profileService'; // Import the fetch function

export default function NewPage() {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);

  // Fetch profiles from Firestore
  useEffect(() => {
    const loadProfiles = async () => {
      try {
        const fetchedProfiles = await fetchUserProfiles();
        setProfiles(fetchedProfiles);
      } catch (error) {
        console.error("Error fetching profiles: ", error);
      }
    };
    
    loadProfiles();
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % profiles.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + profiles.length) % profiles.length);
  };

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  if (profiles.length === 0) {
    return <div>Loading profiles...</div>;
  }

  const currentProfile = profiles[currentIndex];

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
            disabled={profiles.length === 1}  // Disable when only 1 profile
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
              {/* Profile Image */}
              <img 
                src={currentProfile.imageUrl} 
                alt={currentProfile.name} 
                className="rounded-full h-32 w-32 mx-auto mb-4"
              />
              
              {/* Profile Name */}
              <h2 className="text-3xl font-bold mb-4">{currentProfile.name}</h2>
              
              {/* Profile Description */}
              <p className="text-lg mb-4">{currentProfile.description}</p>

              {/* Age */}
              <p className="text-lg mb-4">Age: {currentProfile.age}</p>

              {/* Interests */}
              <p className="text-lg mb-4">
                Interests: {
                  Array.isArray(currentProfile.interests)
                    ? currentProfile.interests.map(interest => 
                        interest.charAt(0).toUpperCase() + interest.slice(1)
                      ).join(", ")
                    : "No interests provided"
                }
              </p>

              {/* Tech Niche */}
              <p className="text-lg mb-4">Tech Niche: {currentProfile.techNiche || "No tech niche provided"}</p>
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
            disabled={profiles.length === 1}  // Disable when only 1 profile
          >
            &#8594;
          </button>
        </div>
      </section>

      {/* Filter Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-black">Set Your Preferences</h3>
            <form>
              {/* Age Range */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Age Range</label>
                <input type="text" className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm text-gray-900" placeholder="20-30" />
              </div>

              {/* Interests */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Interests</label>
                <input type="text" className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm text-gray-900" placeholder="e.g., Reading, Hiking" />
              </div>

              {/* Coding Languages */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Coding Languages</label>
                <input type="text" className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm text-gray-900" placeholder="e.g., Python, JavaScript" />
              </div>

              {/* Tech Niche */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Tech Niche</label>
                <input type="text" className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm text-gray-900" placeholder="e.g., Web Development, Data Science" />
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
