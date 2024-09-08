import React from "react";

export default function ProfileBox() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full text-center">
        <img
          className="w-32 h-32 rounded-full mx-auto mb-4"
          src="https://via.placeholder.com/150"
          alt="Profile"
        />
        <h2 className="text-3xl font-bold mb-2">John Doe</h2>
        <p className="text-gray-600 mb-4">Software Engineer | AI Enthusiast</p>
        <p className="text-gray-800 mb-4">
          Passionate about creating innovative solutions and learning new
          technologies. Loves coding, problem-solving, and collaborating with
          teams.
        </p>
        <div className="flex justify-around mt-4">
          <button className="bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600">
            Like
          </button>
          <button className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600">
            Dislike
          </button>
        </div>
      </div>
    </div>
  );
}
