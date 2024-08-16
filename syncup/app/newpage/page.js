"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword } from "firebase/auth";
import { firestore, storage } from '../../services/firebase'; // Import Firestore and Storage
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Import Storage functions
import { motion } from 'framer-motion';
import { fetchUserProfiles } from '../../services/profileService'; // Import the fetch function
import { useDropzone } from 'react-dropzone';

export default function NewPage() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [interests, setInterests] = useState("");
  const [description, setDescription] = useState("");
  const [techNiche, setTechNiche] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false); // To track file upload status

  const auth = getAuth();

  // Check if the user is authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        loadProfiles();
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Function to fetch profiles
  const loadProfiles = async () => {
    try {
      const fetchedProfiles = await fetchUserProfiles();
      setProfiles(fetchedProfiles);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  };

  // Function to handle file upload
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);

    // Upload the file to Firebase Storage
    const storageRef = ref(storage, `profile_images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Optional: Track upload progress
      },
      (error) => {
        console.error("Error uploading file:", error);
        setUploading(false);
      },
      () => {
        // Get the download URL once upload completes
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageUrl(downloadURL);
          setUploading(false);
        });
      }
    );
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const registeredUser = userCredential.user;
      setUser(registeredUser);

      // Save additional user info to Firestore
      const userDocRef = doc(firestore, "users", registeredUser.uid);
      await setDoc(userDocRef, {
        name,
        age,
        interests: interests.split(',').map(interest => interest.trim()), // Convert to array
        description,
        techNiche,
        imageUrl // Save image URL after upload
      });

      console.log("User registered and additional info saved!");
    } catch (error) {
      console.error("Registration error:", error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl mb-8">Register</h1>
      <form onSubmit={handleRegister} className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        {/* Email and Password Fields */}
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        {/* Drag-and-Drop Image Upload */}
        <div {...getRootProps()} className={`mb-4 p-4 border-dashed border-2 rounded-lg text-center ${isDragActive ? 'border-blue-500' : 'border-gray-300'}`}>
          <input {...getInputProps()} />
          {uploading ? (
            <p>Uploading image...</p>
          ) : isDragActive ? (
            <p>Drop the file here...</p>
          ) : (
            <p>Drag and drop an image here, or click to select one</p>
          )}
        </div>
        {imageUrl && <img src={imageUrl} alt="Uploaded profile" className="rounded-full h-32 w-32 mx-auto mb-4" />}

        {/* Additional User Info Fields */}
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Age</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Interests (comma-separated)</label>
          <input
            type="text"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Tech Niche</label>
          <input
            type="text"
            value={techNiche}
            onChange={(e) => setTechNiche(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hoverHere’s the continuation of the previous implementation of the drag-and-drop image upload and user registration form:

```jsx
          hover:bg-blue-600"
        >
          Register
        </button>
      </form>
    </div>
  );
}
