import React from "react";
import img from "../assets/photo.png";
import { FaTasks } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function FrontPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#fdf6fe] min-h-screen w-full overflow-x-hidden">
      <nav className="w-full bg-[#fdf6fe] fixed top-0 left-0 z-50 flex items-center justify-between px-4 sm:px-6 md:px-8 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <FaTasks className="bg-[#944ee1] text-white rounded-md h-9 w-9 p-2" />
          <h1 className="font-bold text-lg hidden sm:block">TaskFlow</h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => navigate("/login")}
            className="bg-[#944ee1] text-white px-4 py-2 rounded-xl hover:bg-transparent hover:text-black outline-2 outline-[#944ee1] transition"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="outline-2 outline-[#944ee1] px-4 py-2 rounded-xl hover:bg-[#944ee1] hover:text-white transition"
          >
            Signup
          </button>
        </div>
      </nav>


      <div className="w-full min-h-screen pt-20">
        {/* Mobile Layout */}
        <div className="flex flex-col items-center justify-start lg:hidden w-full px-4 pt-6">
          <img
            src={img}
            alt="img"
            className="w-full max-w-[320px] h-auto object-contain"
          />

          <div className="mt-6 text-center">
            <h1 className="text-4xl font-semibold">Task</h1>
            <h1 className="text-3xl text-gray-500 mb-4">Manager</h1>

            <p className="text-sm text-gray-700 leading-6 px-2">
              A simple and powerful tool to manage your daily tasks, track
              project progress, and stay organized. Create tasks, assign
              priorities, and monitor your workflow easily to boost
              productivity.
            </p>

            <button
              onClick={() => navigate("/login")}
              className="bg-[#944ee1] px-6 py-3 text-white rounded-lg mt-6"
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center justify-center gap-16 px-20 py-10">
          <div className="w-1/2">
            <h1 className="text-6xl font-semibold">Task</h1>
            <h1 className="text-5xl text-gray-500 mb-6">Manager</h1>

            <p className="text-lg text-gray-700 leading-7">
              A simple and powerful tool to manage your daily tasks, track
              project progress, and stay organized. Create tasks, assign
              priorities, and monitor your workflow easily to boost
              productivity.
            </p>

            <button
            onClick={() => navigate("/login")}
            className="bg-[#944ee1] hover:scale-108 px-6 py-3 text-white rounded-lg mt-8"
          >
            Get Started
          </button>
          </div>

          <div className="w-1/2 flex justify-center">
            <img
              src={img}
              alt="img"
              className="w-full max-w-[600px] h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

