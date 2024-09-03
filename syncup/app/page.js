'use client';
import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { fetchUserProfiles } from './services/profileService';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation } from 'swiper/modules';
import { handleSwipe, loadMatches } from './services/userService';

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
      
      <div className="flex flex-row justify-center items-center">
          <button className="w-[180px] mr-5 text-xl font-bold px-5 border-solid border-black border-2 rounded-xl hover:text-blue-800 hover:border-blue-800 hover:text-[1.2em]"><a href="login">Login/Register</a></button>
          {/* <button className="text-xl font-bold px-5 border-solid border-black border-2 rounded-xl hover:text-blue-800 hover:border-blue-800 hover:text-[1.2em]"><a href="login">Register</a></button> */}
      </div>
      
      <section className="flex flex-col items-center justify-center flex-grow text-center p-8 text-black">
        <div className="w-[45%] h-38 bg-white border-solid border-[2.5px] border-[gray] p-5 bg-opacity-80 drop-shadow-lg rounded-xl mb-10">
          <h2 className="text-2xl font-bold">Create</h2>
          <span className="text-xl">Build a custom profile showcasing your skills and interests.</span>
          </div>
        <div className="w-[45%] h-38 bg-white border-solid border-[2.5px] border-[gray] p-5 bg-opacity-80 drop-shadow-lg rounded-xl mb-10">
          <h2 className="text-2xl font-bold">Explore</h2>
          <span className="text-xl">Browse through profiles to find your ideal teammate or partner.</span>
          </div>
        <div className="w-[45%] h-38 bg-white border-solid border-[2.5px] border-[gray] p-5 bg-opacity-80 drop-shadow-lg rounded-xl mb-10">
          <h2 className="text-2xl font-bold">Connect</h2>
          <span className="text-xl">Engage with users who share similar interests.</span>
          </div>
      </section>

      <footer className="">
            <div className="w-[100%] h-[20%] bg-violet-400 flex justify-center">
            Â© 2024 SyncUp. All rights reserved.
            </div>
      </footer>

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