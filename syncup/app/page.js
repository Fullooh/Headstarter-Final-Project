// App/page.js
'use client';

import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { firestore } from '@/firebase'; // Adjust the path if needed

export default function Page() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      await addDoc(collection(firestore, 'waitlist'), { email });
      setSuccess(true);
      setEmail('');
    } catch (err) {
      setError('Failed to save email. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center flex-grow text-center p-8">
        <h1 className="text-5xl font-bold mb-4 leading-tight">Join the Exclusive Waitlist for Our Exciting New App!</h1>
        <p className="text-lg mb-8">Be the first to experience the future of connecting with like-minded professionals.</p>
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full px-4 py-2 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition duration-300"
          >
            Join Waitlist
          </button>
        </form>
        {success && <p className="mt-4 text-green-300">Thank you for joining the waitlist!</p>}
        {error && <p className="mt-4 text-red-300">{error}</p>}
      </section>

      {/* Features Section */}
      <section className="bg-white text-gray-800 py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
            <h2 className="text-xl font-bold mb-4">Create</h2>
            <p className="text-gray-600">Create custom profile displaying your skills and interests.</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
            <h2 className="text-xl font-bold mb-4">Explore</h2>
            <p className="text-gray-600">Swipe on other users' profiles to match with the perfect teammate/partner.</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
            <h2 className="text-xl font-bold mb-4">Connect</h2>
            <p className="text-gray-600">Message and interect with real people with similar interests.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; 2024 SyncUp. All rights reserved.</p>
        {/* <p>Follow us on <a href="#" className="text-indigo-400">Social Media</a></p> */}
      </footer>
    </div>
  );
}
