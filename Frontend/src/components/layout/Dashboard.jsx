import React, { useEffect, useState } from "react";
import { FaTasks } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { IoMdHome } from "react-icons/io";
import { FaUsers } from "react-icons/fa";
import { MdTask } from "react-icons/md";
import { SlGlobe } from "react-icons/sl";
import { FaLocationDot, FaCity } from "react-icons/fa6";
import { IoIosSettings } from "react-icons/io";
import { FaBell, FaAngleDown } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { Outlet, NavLink, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) return;

    const userId = storedUser._id || storedUser.id;

    fetch(`http://localhost:8080/api/profile/${userId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch user");
        }
        return res.json();
      })
      .then((data) => {
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      })
      .catch((err) => console.log("Dashboard user fetch error:", err.message));
  }, []);

  const navItemClass = ({ isActive }) =>
    `flex items-center justify-center md:justify-start gap-3 p-3 cursor-pointer transition-all
    ${
      isActive
        ? "bg-[#8412ec] text-white border-r-2 border-[#944ee1]"
        : "hover:bg-[#ab5ffc] hover:text-white hover:border-r-2 hover:border-[#8412ec]"
    }`;
 
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-16 md:w-64 h-screen fixed top-0 left-0 border-r border-gray-200 bg-white z-50">
        <header className="border-b-2 border-gray-300 h-16">
          <div className="flex items-center justify-center md:justify-start gap-3 p-4">
            <FaTasks className="bg-[#8633eb] text-white rounded-md h-9 w-9 p-2" />
            <h1 className="hidden md:block font-bold text-lg">TaskFlow</h1>
          </div>
        </header>

        <div className="mt-2">
          <ul className="space-y-1">
            <li>
              <NavLink to="/dashboard/home" end className={navItemClass}>
                <IoMdHome className="text-xl" />
                <span className="hidden md:inline">Home</span>
              </NavLink>
            </li>

            <li>
              <NavLink to="/dashboard/user" end className={navItemClass}>
                <FaUsers className="text-xl" />
                <span className="hidden md:inline">User</span>
              </NavLink>
            </li>

            <li>
              <NavLink to="/dashboard/task" end className={navItemClass}>
                <MdTask className="text-xl" />
                <span className="hidden md:inline">Task</span>
              </NavLink>
            </li>

            <li>
              <NavLink to="/dashboard/countries" end className={navItemClass}>
                <SlGlobe className="text-xl" />
                <span className="hidden md:inline">Countries</span>
              </NavLink>
            </li>

            <li>
              <NavLink to="/dashboard/states" end className={navItemClass}>
                <FaLocationDot className="text-xl" />
                <span className="hidden md:inline">States</span>
              </NavLink>
            </li>

            <li>
              <NavLink to="/dashboard/city" end className={navItemClass}>
                <FaCity className="text-xl" />
                <span className="hidden md:inline">City</span>
              </NavLink>
            </li>

            <li>
              <NavLink to="/dashboard/settings" end className={navItemClass}>
                <IoIosSettings className="text-xl" />
                <span className="hidden md:inline">Settings</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>

      <div className="ml-16 md:ml-64">
        <header className="bg-white h-16 flex items-center justify-between border-b-2 border-gray-300 px-3 md:px-6 fixed top-0 left-16 md:left-64 right-0 z-40">
          <div className="relative w-40 sm:w-56 md:w-72">
            <IoIosSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search..."
              className="w-full border border-gray-300 rounded-lg pl-10 pr-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>

          <div className="flex items-center gap-3 md:gap-4 relative">
            <FaBell className="text-lg md:text-xl cursor-pointer" />

            {user?.file ? (
              <img
                src={`http://localhost:8080/uploads/${user.file}`}
                alt="profile"
                className="h-8 w-8 rounded-full object-cover cursor-pointer border-1 border-[#07010e] "              
                />
            ) : (
              <CgProfile className="text-2xl cursor-pointer" />
            )}

            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <span className="hidden sm:inline font-medium text-[#210142] text-sm md:text-base">
                  {user?.firstName || "User"}
                </span>
                <FaAngleDown className="text-sm" />
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50 overflow-hidden">
                  <button
                    onClick={() => {
                      setOpen(false);
                      navigate("/profile");
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Profile
                  </button>

                  <button
                    onClick={() => {
                      localStorage.setItem("login", "");
                      navigate("/");
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="pt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
}