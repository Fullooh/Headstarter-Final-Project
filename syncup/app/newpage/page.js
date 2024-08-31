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
  const [loading, setLoading] = useState(true);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [dislikeLoading, setDislikeLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // Dark mode state
  const auth = getAuth();
  const router = useRouter();

  const phrases = ["Team Up", "Code Together", "Conquer the Future"];

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

  useEffect(() => {
    // Load dark mode preference from local storage
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);

    // Apply dark mode class to the document body
    document.body.classList.toggle('dark', savedDarkMode);
  }, []);

  const loadProfiles = async () => {
    try {
      const fetchedProfiles = await fetchUserProfiles();
      setProfiles(fetchedProfiles);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleUserSwipe = async (profileId, liked) => {
    if (liked) {
      setLikeLoading(true);
    } else {
      setDislikeLoading(true);
    }
    
    try {
      const isMatch = await handleSwipe(user.uid, profileId, liked);
      if (isMatch) {
        setShowMatchModal(true);
      }
    } catch (error) {
      console.error("Error processing swipe:", error);
    } finally {
      setLikeLoading(false);
      setDislikeLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', newMode);
      document.body.classList.toggle('dark', newMode);
      return newMode;
    });
  };

  const closeModal = () => {
    setShowMatchModal(false);
  };

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div role="status" className="max-w-sm p-4 border border-gray-200 rounded shadow animate-pulse md:p-6 dark:border-gray-700">
          <div className="flex items-center justify-center h-48 mb-4 bg-gray-300 rounded dark:bg-gray-700">
            <svg className="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
              <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z"/>
              <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"/>
            </svg>
          </div>
          <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
          <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
          <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
          <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          <div className="flex items-center mt-4">
            <svg className="w-10 h-10 me-3 text-gray-200 dark:text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
            </svg>
            <div>
              <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
              <div className="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            </div>
          </div>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative overflow-hidden flex flex-col ${darkMode ? 'dark' : ''}`}>
      {/* Dark Mode Toggle Button */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 bg-gray-800 text-white dark:bg-gray-200 dark:text-black p-2 rounded"
      >
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>

      <div className="area absolute top-0 left-0 w-full h-full z-[-1]">
        <ul className="circles">
          {Array.from({ length: 10 }).map((_, idx) => <li key={idx} />)}
        </ul>
      </div>
      <header className="w-full text-center py-8">
        <h2 className="text-5xl md:text-7xl font-extrabold mt-4">
          <span className="text-black dark:text-white">SyncUp: </span>
          <span className="text-violet-400">{phrases[phraseIndex]}</span>
        </h2>
      </header>
      <section className="flex flex-col items-center justify-center flex-grow text-center p-8 text-black dark:text-white">
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
                <div className="p-8 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-lg h-full flex flex-col justify-between">
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
                      className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                      disabled={likeLoading || dislikeLoading}
                    >
                      {likeLoading ? (
                        <svg aria-hidden="true" className="inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                      ) : (
                        "Like"
                      )}
                    </button>
                    <button
                      onClick={() => handleUserSwipe(profile.id, false)}
                      className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                      disabled={likeLoading || dislikeLoading}
                    >
                      {dislikeLoading ? (
                        <svg aria-hidden="true" className="inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-red-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                      ) : (
                        "Dislike"
                      )}
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
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-4xl font-bold mb-4 dark:text-white">It's a Match!</h2>
            <p className="text-lg mb-4 dark:text-gray-300">You and another user have liked each other!</p>
            <button
              onClick={closeModal}
              className="bg-violet-500 text-white dark:bg-violet-700 px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
