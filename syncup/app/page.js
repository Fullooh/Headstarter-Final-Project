'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword } from "firebase/auth";
import { firestore, storage } from './services/firebase'; // Import Firestore and Storage
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Import Storage functions
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation'; // Import the useRouter hook

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
  const [uploading, setUploading] = useState(false); // To track file upload status
  const [loading, setLoading] = useState(false); // To track registration process

  const auth = getAuth();
  const router = useRouter(); // Initialize the useRouter hook

  // Check if the user is authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [auth]);

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
  }, [storage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true when the process starts
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

      // Redirect to the users' page after successful registration
      router.push('/newpage'); // Use the router to navigate to the users' page
    } catch (error) {
      console.error("Registration error:", error.message);
    } finally {
      setLoading(false); // Set loading state back to false when done
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

        {/* Submit Button with Spinner and Processing State */}
        <button
          type="submit"
          className="w-full bg-indigo-500 text-white py-2 px-4 rounded-lg flex justify-center items-center hover:bg-indigo-600"
          disabled={loading} // Disable button while loading
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              Processing...
            </>
          ) : (
            'Register'
          )}
        </button>
      </form>
    </div>
  );
}
