import React, { useEffect, useState } from "react";
import { MdAddAPhoto } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchCountries,
  fetchStates,
  fetchCities,
} from "../../services/locationService";

export default function NewUsers() {
  const navigate = useNavigate();
  const { id } = useParams();

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

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    loadCountries();
  }, []);

  useEffect(() => {
    if (id) {
      loadSingleUser();
    }
  }, [id]);

  const loadCountries = async () => {
    try {
      const data = await fetchCountries();
      setCountries(data);
    } catch (error) {
      console.log("Country fetch error:", error);
    }
  };

  const loadSingleUser = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/user/${id}`);
      const data = await res.json();

      if (!res.ok) {
        console.log(data.message || "Failed to fetch user");
        return;
      }

      const countryId =
        typeof data.country === "object" ? data.country?._id || "" : data.country || "";

      const stateId =
        typeof data.state === "object" ? data.state?._id || "" : data.state || "";

      const cityId =
        typeof data.city === "object" ? data.city?._id || "" : data.city || "";

      setFormData({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        address: data.address || "",
        country: countryId,
        state: stateId,
        city: cityId,
        zip: data.zip || "",
        password: "",
        confirmPassword: "",
      });

      if (data.file) {
        setPreview(`http://localhost:8080/uploads/${data.file}`);
      }

      if (countryId) {
        const statesData = await fetchStates(countryId);
        setStates(statesData);

        if (stateId) {
          const citiesData = await fetchCities(countryId, stateId);
          setCities(citiesData);
        }
      }
    } catch (err) {
      console.log("Fetch single user error:", err);
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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.address ||
      !formData.country ||
      !formData.state ||
      !formData.city ||
      !formData.zip
    ) {
      alert("All fields are required");
      return;
    }

    const zipRegex = /^[0-9]{6}$/;

const emailRegex =
  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&._-])[^\s@]+@[^\s@]+\.[^\s@]+$/;

const passwordRegex =
  /^(?=.*[a-zA-Z])(?=.*[\d@$!%*?&]).{4,}$/;


if (!zipRegex.test(formData.zip)) {
  alert("Zip code must be 6 digits");
  return;
}

if (!emailRegex.test(formData.email)) {
  alert("Email must contain letters, number and symbol");
  return;
}

    if (!id) {
      if (!formData.password || !formData.confirmPassword) {
        alert("Password and Confirm Password required");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      if (!file) {
        alert("File is required");
        return;
      }
    }

    try {
      const sendData = new FormData();
      sendData.append("firstName", formData.firstName);
      sendData.append("lastName", formData.lastName);
      sendData.append("email", formData.email);
      sendData.append("address", formData.address);
      sendData.append("country", formData.country);
      sendData.append("state", formData.state);
      sendData.append("city", formData.city);
      sendData.append("zip", formData.zip);

      if (!id) {
        sendData.append("password", formData.password);
        sendData.append("confirmPassword", formData.confirmPassword);
      }

      if (file) {
        sendData.append("file", file);
      }

      let res;

      if (id) {
        res = await fetch(`http://localhost:8080/api/user/update-user/${id}`, {
          method: "PUT",
          body: sendData,
        });
      } else {
        res = await fetch("http://localhost:8080/api/user/add-user", {
          method: "POST",
          body: sendData,
        });
      }

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Something went wrong");
        return;
      }

      alert(id ? "User updated successfully" : "User added successfully");
      navigate("/dashboard/user");
    } catch (error) {
      console.log("Save user error:", error.message);
    }
  };

  return (
    <div className=" justify-center min-h-screen flex">
      <div className="bg-white p-8 rounded-lg w-full  md:max-w-xl shadow-lg m-auto">
        <div className="w-full flex justify-center items-center flex-col gap-2">
          {preview ? (
            <img
              src={preview}
              alt="preview"
              className="h-20 w-20 rounded-full object-cover border"
            />
          ) : (
            <MdAddAPhoto className="h-15 p-2 w-15 bg-gray-200 rounded-full" />
          )}

          <div className="flex flex-col items-center gap-2">
            <label
              htmlFor="fileUpload"
              className="bg-[#e2dce7] text-[#7334b8] px-3 text-sm rounded cursor-pointer"
            >
              {file || preview ? "Update photo" : "Add Photo"}
            </label>

            <input
              id="fileUpload"
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3"
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
              className="p-2 border rounded border-gray-300"
            />
          </div>

          <div className="flex flex-col">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              minLength={2}
              maxLength={20}
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
              className="p-2 border rounded border-gray-300"
            />
          </div>

          <div className="flex flex-col md:col-span-2">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="p-2 border rounded border-gray-300"
            />
          </div>

          <div className="flex flex-col md:col-span-2">
            <label>Address</label>
            <input
              type="text"
              name="address"
              minLength={2}
              maxLength={20}
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
              className="p-2 border rounded border-gray-300"
            />
          </div>

          <div className="flex flex-col">
            <label>Country</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleCountryChange}
              className="p-2 border rounded border-gray-300"
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
              className="p-2 border rounded border-gray-300"
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
              className="p-2 border rounded border-gray-300"
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
              value={formData.zip}
              onChange={handleChange}
              placeholder="Enter zip"
              className="p-2 border rounded border-gray-300"
            />
          </div>

          {!id && (
            <>
              <div className="flex flex-col">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="p-2 border rounded border-gray-300"
                />
              </div>

              <div className="flex flex-col">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className="p-2 border rounded border-gray-300"
                />
              </div>
            </>
          )}

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="bg-[#944ee1] text-white p-2 mt-3 rounded"
            >
              {id ? "Update User" : "Add User"}
            </button>

            <button
              type="button"
              className="text-[#944ee1] border border-gray-300 ml-3 p-2 rounded mt-2"
              onClick={() => navigate("/dashboard/user")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}