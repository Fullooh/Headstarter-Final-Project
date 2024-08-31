// NewPage.js
'use client';
import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { fetchUserProfiles } from '../services/profileService';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation } from 'swiper/modules';
import { handleSwipe, loadMatches } from '../services/userService';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';

export default function NewPage() {
  const [user, setUser] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [phraseIndex, setPhraseIndex] = useState(0); 
  const [showMatchModal, setShowMatchModal] = useState(false); // For showing match modal
  const auth = getAuth();
  const router = useRouter();

  const phrases = ["Team Up", "Code Together", "Conquer the Future"];

  // Check if the user is authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        loadProfiles();
      } else {
        router.push('/register'); 
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  // Function to fetch profiles from the 'users' collection
  const loadProfiles = async () => {
    try {
      const fetchedProfiles = await fetchUserProfiles();
      setProfiles(fetchedProfiles);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  };

  // Rotate text phrases every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleUserSwipe = async (profileId, liked) => {
    const isMatch = await handleSwipe(user.uid, profileId, liked);
    if (isMatch) {
      setShowMatchModal(true);
    }
  };

  const closeModal = () => {
    setShowMatchModal(false);
  };

  if (!user || profiles.length === 0) {
    return <div>Loading profiles...</div>;
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      <div className="area absolute top-0 left-0 w-full h-full z-[-1]">
        <ul className="circles">
          {Array.from({ length: 10 }).map((_, idx) => <li key={idx} />)}
        </ul>
      </div>
      <header className="w-full text-center py-8">
        <h2 className="text-5xl md:text-7xl font-extrabold mt-4">
          <span className="text-black">SyncUp: </span>
          <span className="text-violet-400">{phrases[phraseIndex]}</span>
        </h2>
      </header>
      <section className="flex flex-col items-center justify-center flex-grow text-center p-8 text-black">
        <p className="text-lg mb-8">Click the arrows to navigate.</p>
        <div className="relative w-full max-w-lg h-[620px]">
          <Swiper
            modules={[EffectCoverflow, Navigation]}
            navigation
            effect="coverflow"
            grabCursor
            centeredSlides
            slidesPerView={1}
            loop
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            spaceBetween={50}
          >
            {profiles.map((profile, index) => (
              <SwiperSlide key={profile.id || index}>
                <div className="p-8 bg-white text-black rounded-lg shadow-lg h-full flex flex-col justify-between">
                  <img
                    src={profile.imageUrl}
                    alt={profile.name}
                    className="rounded-full h-32 w-32 mx-auto mb-4"
                  />
                  <h2 className="text-3xl font-bold mb-4">{profile.name}</h2>
                  <p className="text-lg mb-4">{profile.description}</p>
                  <p className="text-lg mb-4">Age: {profile.age}</p>
                  <p className="text-lg mb-4">Interests: {
                    Array.isArray(profile.interests)
                      ? profile.interests.map(interest => interest.charAt(0).toUpperCase() + interest.slice(1)).join(', ')
                      : 'No interests provided'
                  }</p>
                  <p className="text-lg mb-4">Tech Niche: {profile.techNiche || 'No tech niche provided'}</p>
                  <div className="flex justify-around mt-4">
                    <button
                      onClick={() => handleUserSwipe(profile.id, true)}
                      className="bg-green-500 text-white p-2 rounded"
                    >
                      Like
                    </button>
                    <button
                      onClick={() => handleUserSwipe(profile.id, false)}
                      className="bg-red-500 text-white p-2 rounded"
                    >
                      Dislike
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {showMatchModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-4xl font-bold mb-4">It's a Match!</h2>
            <p className="text-lg mb-4">You and another user have liked each other!</p>
            <button
              onClick={closeModal}
              className="bg-violet-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
