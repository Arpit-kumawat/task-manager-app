import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import {
  fetchCountries,
  fetchStates,
  fetchCities,
} from "../../services/locationService";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData) return;

      const userId = userData._id || userData.id;

      const [countriesData, profileRes] = await Promise.all([
        fetchCountries(),
        fetch(`http://localhost:8080/api/profile/${userId}`),
      ]);

      if (!profileRes.ok) {
        throw new Error("Failed to fetch profile");
      }

      const profileData = await profileRes.json();

      setCountries(countriesData);

      const formattedUser = {
        ...profileData,
        country:
          typeof profileData.country === "object"
            ? profileData.country?._id || ""
            : profileData.country || "",
        state:
          typeof profileData.state === "object"
            ? profileData.state?._id || ""
            : profileData.state || "",
        city:
          typeof profileData.city === "object"
            ? profileData.city?._id || ""
            : profileData.city || "",
      };

      setUser(formattedUser);

      if (formattedUser.country) {
        const statesData = await fetchStates(formattedUser.country);
        setStates(statesData);

        if (formattedUser.state) {
          const citiesData = await fetchCities(
            formattedUser.country,
            formattedUser.state
          );
          setCities(citiesData);
        }
      }
    } catch (err) {
      console.log("Profile fetch error:", err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCountryChange = async (e) => {
    const countryId = e.target.value;

    setUser((prev) => ({
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
    const selectedCountry = user.country;

    setUser((prev) => ({
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

    setUser((prev) => ({
      ...prev,
      city: cityId,
    }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/profile/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          address: user.address,
          country: user.country,
          state: user.state,
          city: user.city,
          zip: Number(user.zip),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to update profile");
        return;
      }

      const updatedUser = {
        ...data,
        country: typeof data.country === "object" ? data.country?._id || "" : data.country || "",
        state: typeof data.state === "object" ? data.state?._id || "" : data.state || "",
        city: typeof data.city === "object" ? data.city?._id || "" : data.city || "",
      };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(data));
      alert("Profile Updated Successfully");
    } catch (error) {
      console.log("Profile update error:", error.message);
    }
  };

  if (!user) {
    return <div className="ml-0 p-4 pt-20">Loading...</div>;
  }

  return (
    <div className="ml-0 p-4 bg-gray-100 min-h-screen w-full">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-auto">
        <header className="bg-[#944ee1] rounded-t-lg p-4 flex items-center gap-4">
          {user.file ? (
            <img
            className="border-2 border-white h-12 w-12 rounded-full object-cover"
            src={
              user.file
                ? `http://localhost:8080/uploads/${user.file}`
                : "https://via.placeholder.com/150"
            }
            alt="profile"
          />
          ) : (
            <CgProfile className="h-15 w-15 text-white bg-[#944ee1] rounded-full" />
          )}

          <div>
            <h2 className="text-white text-xl font-semibold">My Profile</h2>
            <p className="text-blue-100 text-sm">
              Manage your account settings
            </p>
          </div>
        </header>

        <div className="p-6">
          <form
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex flex-col">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                minLength={2}
                maxLength={20}
                className="p-2 border rounded border-gray-300"
                value={user.firstName || ""}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                minLength={2}
                maxLength={20}
                className="p-2 border rounded border-gray-300"
                value={user.lastName || ""}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col sm:col-span-2">
              <label>Email</label>
              <input
                type="email"
                name="email"
                className="p-2 border rounded border-gray-300"
                value={user.email || ""}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col sm:col-span-2">
              <label>Address</label>
              <input
                type="text"
                name="address"
                minLength={1}
                maxLength={100}
                className="p-2 border rounded border-gray-300"
                value={user.address || ""}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col">
              <label>Country</label>
              <select
                name="country"
                className="p-2 border rounded border-gray-300"
                value={user.country || ""}
                onChange={handleCountryChange}
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
                className="p-2 border rounded border-gray-300"
                value={user.state || ""}
                onChange={handleStateChange}
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
                className="p-2 border rounded border-gray-300"
                value={user.city || ""}
                onChange={handleCityChange}
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
                className="p-2 border rounded border-gray-300"
                value={user.zip || ""}
                onChange={handleChange}
              />
            </div>
          </form>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              className="bg-[#944ee1] text-white px-5 py-2 rounded hover:bg-[#7b14e9]"
            >
              Update Profile
            </button>

            <button
              onClick={() => navigate("/dashboard/home")}
              className="border border-gray-300 bg-gray-100 px-5 py-2 rounded hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}