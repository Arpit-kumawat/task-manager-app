import React, { useEffect, useState } from "react";
import { FaTasks } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5";

import {
  fetchCountries,
  fetchStates,
  fetchCities,
} from "../../services/locationService";

export default function Signup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    country: "",
    state: "",
    city: "",
    zip: "",
    password: "",
    confirmPassword: "",
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    try {
      const data = await fetchCountries();
      setCountries(data);
    } catch (error) {
      console.log("Country fetch error:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    if (name === "zip") {
      newValue = value.replace(/\D/g, "").slice(0, 6);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleCountryChange = async (e) => {
    const countryId = e.target.value;

    setFormData((prev) => ({
      ...prev,
      country: countryId,
      state: "",
      city: "",
    }));

    setStates([]);
    setCities([]);

    if (countryId) {
      try {
        const data = await fetchStates(countryId);
        setStates(data);
      } catch (error) {
        console.log("State fetch error:", error);
      }
    }
  };

  const handleStateChange = async (e) => {
    const stateId = e.target.value;
    const selectedCountry = formData.country;

    setFormData((prev) => ({
      ...prev,
      state: stateId,
      city: "",
    }));

    setCities([]);

    if (stateId && selectedCountry) {
      try {
        const data = await fetchCities(selectedCountry, stateId);
        setCities(data);
      } catch (error) {
        console.log("City fetch error:", error);
      }
    }
  };

  const handleCityChange = (e) => {
    const cityId = e.target.value;

    setFormData((prev) => ({
      ...prev,
      city: cityId,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.address ||
      !formData.country ||
      !formData.state ||
      !formData.city ||
      !formData.zip ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("All fields are required");
      return;
    }

    const zipRegex = /^[0-9]{6}$/;

    const emailRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&._-])[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[\d@$!%*?&]).{4,}$/;

    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address");
      return;
    }

    if(!zipRegex.test(formData.zip)) {
      alert("Zip code must be 6 digits");
      return; 
    }

    if (!passwordRegex.test(formData.password)) {
      alert("Password must be characters, including an letter a number, and a special character");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Password and Confirm Password do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          zip: formData.zip,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Signup failed");
        return;
      }

      alert("Signup successful");
      navigate("/login");
    } catch (error) {
      console.log("Signup error:", error);
      alert("Server error");
    }
  };

  return (
    <div className="bg-gray-300 min-h-screen flex justify-center items-center px-4 py-6">
      <div className="bg-white p-8 rounded-lg w-full max-w-2xl shadow-lg">
        <div className="flex items-center justify-center mb-4">
          <FaTasks className="bg-[#944ee1] text-white rounded-full h-10 w-10 px-3" />
        </div>

        <h2 className="text-2xl font-bold mb-2 text-center">
          Create your account
        </h2>

        <p className="mb-6 text-center text-gray-600">
          Please fill in your details to sign up
        </p>

        <form
          onSubmit={handleSignup}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="flex flex-col">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              minLength={2}
              maxLength={20}
              placeholder="Enter first name"
              value={formData.firstName}
              onChange={handleChange}
              className="p-2 rounded border-2 border-gray-200"
            />
          </div>

          <div className="flex flex-col">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              minLength={2}
              maxLength={20}
              placeholder="Enter last name"
              value={formData.lastName}
              onChange={handleChange}
              className="p-2 rounded border-2 border-gray-200"
            />
          </div>

          <div className="flex flex-col md:col-span-2">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              className="p-2 rounded border-2 border-gray-200"
            />
          </div>

          <div className="flex flex-col md:col-span-2">
            <label>Address</label>
            <input
              type="text"
              name="address"
              minLength={2}
              maxLength={20}
              placeholder="Enter address"
              value={formData.address}
              onChange={handleChange}
              className="p-2 rounded border-2 border-gray-200"
            />
          </div>

          <div className="flex flex-col">
            <label>Country</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleCountryChange}
              className="p-2 rounded border-2 border-gray-200"
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country._id} value={country._id}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label>State</label>
            <select
              name="state"
              value={formData.state}
              onChange={handleStateChange}
              className="p-2 rounded border-2 border-gray-200"
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state._id} value={state._id}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label>City</label>
            <select
              name="city"
              value={formData.city}
              onChange={handleCityChange}
              className="p-2 rounded border-2 border-gray-200"
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city._id} value={city._id}>
                  {city.city}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label>Zip Code</label>
            <input
              type="text"
              name="zip"
              maxLength={6}
              placeholder="Enter zip code"
              value={formData.zip}
              onChange={handleChange}
              className="p-2 rounded border-2 border-gray-200"
            />
          </div>

          <div className="flex flex-col">
            <label>Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                className="p-2 pr-10 border rounded border-gray-300 w-full"
              />

              {showPassword ? (
                <IoEyeOffSharp
                  size={20}
                  onClick={() => setShowPassword(false)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
                />
              ) : (
                <IoEyeSharp
                  size={20}
                  onClick={() => setShowPassword(true)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
                />
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <label>Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="p-2 pr-10 border rounded border-gray-300 w-full"
              />

              {showConfirmPassword ? (
                <IoEyeOffSharp
                  size={20}
                  onClick={() => setShowConfirmPassword(false)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
                />
              ) : (
                <IoEyeSharp
                  size={20}
                  onClick={() => setShowConfirmPassword(true)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
                />
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-[#944ee1] text-white py-2 rounded hover:bg-[#7e3acc] transition"
            >
              Sign Up
            </button>
          </div>
          <p className="text-sm text-gray-600 text-center md:col-span-2">
            Already have an account?
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="underline text-[#780aee] cursor-pointer ml-1"
            >
              Sign in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}