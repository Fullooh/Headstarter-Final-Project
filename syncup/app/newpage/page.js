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

  const closeModal = () => {
    setShowMatchModal(false);
  };

  if (!user) {
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
                      className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                      disabled={likeLoading || dislikeLoading} // Disable button during loading
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
                      disabled={likeLoading || dislikeLoading} // Disable button during loading
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
