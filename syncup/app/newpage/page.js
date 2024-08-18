'use client';
import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { fetchUserProfiles } from '../services/profileService'; 
import { useRouter } from 'next/navigation'; 

export default function NewPage() {
  const [user, setUser] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0); // Track rotating text index
  const auth = getAuth();
  const router = useRouter();

  const phrases = ["Team Up", "Code Together", "Conquer the Future"]; // Array of rotating phrases

  // Check if the user is authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        loadProfiles(); // Load profiles (now from the 'users' collection)
      } else {
        router.push('/register'); // Redirect to register if no user is logged in
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  // Function to fetch profiles from the 'users' collection
  const loadProfiles = async () => {
    try {
      const fetchedProfiles = await fetchUserProfiles(); // Fetch from 'users'
      setProfiles(fetchedProfiles);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  };

  // Rotate text phrases every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
    }, 3000); // Change phrase every 3 seconds
    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  if (!user || profiles.length === 0) {
    return <div>Loading profiles...</div>;
  }

  const currentProfile = profiles[currentIndex];

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Background animation */}
      <div className="area absolute top-0 left-0 w-full h-full z-[-1]">
        <ul className="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>

      <header className="w-full text-center py-8">
        <h2 className="text-5xl md:text-7xl font-extrabold mt-4">
          <span className="text-black">SyncUp:</span> <span className="text-violet-400">{phrases[phraseIndex]}</span>
        </h2>
      </header>

      <section className="flex flex-col items-center justify-center flex-grow text-center p-8 text-black">
        <p className="text-lg mb-8">Click the arrows to navigate.</p>
        <div className="relative w-full max-w-lg h-[620px]">
          <button
            onClick={() => setCurrentIndex((prevIndex) => (prevIndex - 1 + profiles.length) % profiles.length)}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white text-black p-3 rounded-full focus:outline-none"
            disabled={profiles.length === 1}
          >
            ←
          </button>
          <div className="p-8 bg-white text-black rounded-lg shadow-lg h-full flex flex-col justify-between">
            <div>
              <img
                src={currentProfile.imageUrl}
                alt={currentProfile.name}
                className="rounded-full h-32 w-32 mx-auto mb-4"
              />
              <h2 className="text-3xl font-bold mb-4">{currentProfile.name}</h2>
              <p className="text-lg mb-4">{currentProfile.description}</p>
              <p className="text-lg mb-4">{`Age: ${currentProfile.age}`}</p>
              <p className="text-lg mb-4">{`Interests: ${
                Array.isArray(currentProfile.interests)
                  ? currentProfile.interests.map((interest) => interest.charAt(0).toUpperCase() + interest.slice(1)).join(", ")
                  : "No interests provided"
              }`}</p>
              <p className="text-lg mb-4">{`Tech Niche: ${currentProfile.techNiche || "No tech niche provided"}`}</p>
            </div>
          </div>
          <button
            onClick={() => setCurrentIndex((prevIndex) => (prevIndex + 1) % profiles.length)}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white text-black p-3 rounded-full focus:outline-none"
            disabled={profiles.length === 1}
          >
            →
          </button>
        </div>
      </section>
    </div>
  );
}
