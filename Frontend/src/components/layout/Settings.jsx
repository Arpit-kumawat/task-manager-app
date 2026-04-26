import React from "react";
import { useNavigate } from "react-router-dom";

function Settings() {
  const navigate = useNavigate();
  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-500 text-sm">
          Manage your application settings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

        <div className="bg-white p-5 rounded-lg shadow">
          <h2 className="font-semibold text-lg mb-2">Profile Settings</h2>
          <p className="text-sm text-gray-500 mb-4">
            Update your profile information.
          </p>

          <button 
          className="bg-[#944ee1] hover:bg-[#7b0cf1] text-white px-4 py-2 rounded"
          onClick={() => navigate("/profile")}
          >
            Edit Profile
          </button>
        </div>

      </div>

    </div>
  );
}

export default Settings;