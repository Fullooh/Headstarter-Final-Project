'use client';
import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { fetchUserProfiles } from '../services/profileService'; 
import { useRouter } from 'next/navigation'; 
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation } from 'swiper/modules';  // Correctly import Swiper modules
import 'swiper/css';  // Core Swiper styles
import 'swiper/css/effect-coverflow';  // Effect Coverflow styles
import 'swiper/css/navigation';  // Navigation module styles

export default function NewPage() {
  const [user, setUser] = useState(null);
  const [profiles, setProfiles] = useState([]);
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
    return React.createElement('div', null, 'Loading profiles...');
  }

  return React.createElement(
    'div',
    { className: 'min-h-screen relative overflow-hidden flex flex-col' },
    React.createElement('div', { className: 'area absolute top-0 left-0 w-full h-full z-[-1]' },
      React.createElement('ul', { className: 'circles' }, 
        Array.from({ length: 10 }).map((_, idx) => React.createElement('li', { key: idx }))
      )
    ),
    React.createElement(
      'header',
      { className: 'w-full text-center py-8' },
      React.createElement(
        'h2',
        { className: 'text-5xl md:text-7xl font-extrabold mt-4' },
        React.createElement('span', { className: 'text-black' }, 'SyncUp: '),
        React.createElement('span', { className: 'text-violet-400' }, phrases[phraseIndex])
      )
    ),
    React.createElement(
      'section',
      { className: 'flex flex-col items-center justify-center flex-grow text-center p-8 text-black' },
      React.createElement('p', { className: 'text-lg mb-8' }, 'Click the arrows to navigate.'),
      React.createElement(
        'div',
        { className: 'relative w-full max-w-lg h-[620px]' },
        React.createElement(Swiper, {
          modules: [EffectCoverflow, Navigation],  // Pass EffectCoverflow module
          navigation: true,  // Enable navigation
          effect: 'coverflow',  // Use coverflow effect
          grabCursor: true,
          centeredSlides: true,
          slidesPerView: 1,
          loop: true,
          coverflowEffect: {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          },
          spaceBetween: 50,
          children: profiles.map((profile, index) => React.createElement(
            SwiperSlide, { key: profile.id || index },
            React.createElement(
              'div',
              { className: 'p-8 bg-white text-black rounded-lg shadow-lg h-full flex flex-col justify-between' },
              React.createElement('img', {
                src: profile.imageUrl,
                alt: profile.name,
                className: 'rounded-full h-32 w-32 mx-auto mb-4'
              }),
              React.createElement('h2', { className: 'text-3xl font-bold mb-4' }, profile.name),
              React.createElement('p', { className: 'text-lg mb-4' }, profile.description),
              React.createElement('p', { className: 'text-lg mb-4' }, `Age: ${profile.age}`),
              React.createElement('p', { className: 'text-lg mb-4' }, `Interests: ${
                Array.isArray(profile.interests)
                  ? profile.interests.map(interest => interest.charAt(0).toUpperCase() + interest.slice(1)).join(', ')
                  : 'No interests provided'
              }`),
              React.createElement('p', { className: 'text-lg mb-4' }, `Tech Niche: ${profile.techNiche || 'No tech niche provided'}`)
            )
          ))
        })
      )
    )
  );
}