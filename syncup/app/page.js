"use client";

import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'next/navigation';
import { auth, firestore, storage } from '../app/services/firebase';
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useDropzone } from 'react-dropzone';

export default function LandingPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [interests, setInterests] = useState('');
  const [description, setDescription] = useState('');
  const [techNiche, setTechNiche] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/newpage');
    } catch (error) {
      setError(error.message);
    }
  };

  const onDrop = useDropzone({
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setUploading(true);

      const storageRef = ref(storage, `profile_images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.error("Error uploading file:", error);
          setUploading(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUrl(downloadURL);
            setUploading(false);
          });
        }
      );
    }
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const registeredUser = userCredential.user;

      const userDocRef = doc(firestore, "users", registeredUser.uid);
      await setDoc(userDocRef, {
        name,
        age,
        interests: interests.split(',').map(interest => interest.trim()),
        description,
        techNiche,
        imageUrl
      });

      router.push('/newpage');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-4 m-4">
        <div className="bg-white dark:bg-gray-900 border border-transparent border-20 rounded-2xl shadow-lg p-10">
          <h1 className="text-5xl font-bold text-center dark:text-gray-400 mb-6">
            {isLogin ? 'Log in' : 'Register'}
          </h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-lg dark:text-gray-400 mb-2">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg dark:bg-indigo-700 dark:text-gray-300"
                placeholder="Email"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-lg dark:text-gray-400 mb-2">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg dark:bg-indigo-700 dark:text-gray-300"
                placeholder="Password"
                required
              />
            </div>
            {!isLogin && (
              <>
                <div {...onDrop.getRootProps()} className="border-dashed border-2 border-gray-300 rounded-lg p-4 text-center mb-4">
                  <input {...onDrop.getInputProps()} />
                  {uploading ? <p>Uploading image...</p> : <p>Drag and drop an image here, or click to select one</p>}
                </div>
                {imageUrl && <img src={imageUrl} alt="Uploaded profile" className="rounded-full h-32 w-32 mx-auto mb-4" />}
                <div className="mb-4">
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Interests (comma-separated)</label>
                  <input
                    type="text"
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Tech Niche</label>
                  <input
                    type="text"
                    value={techNiche}
                    onChange={(e) => setTechNiche(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
              </>
            )}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg hover:scale-105 transition-transform duration-300 ease-in-out"
              disabled={loading}
            >
              {loading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
            </button>
          </form>
          <div className="text-center mt-4">
            <p className="text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button onClick={toggleForm} className="text-blue-400 hover:underline">
                {isLogin ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>
          <div className="text-gray-500 text-center text-sm mt-4">
            <p>
              By signing in, you agree to our
              <a className="text-blue-400 hover:underline" href="#">
                Terms
              </a>
              and
              <a className="text-blue-400 hover:underline" href="#">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
