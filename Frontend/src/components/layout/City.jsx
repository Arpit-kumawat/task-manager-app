// import React, { useState, useEffect } from "react";
// import { FaEdit, FaTrash } from "react-icons/fa";
// import { IoSearch } from "react-icons/io5";
// import API from "../../api";

// export default function City() {
//   const [cities, setCities] = useState([]);
//   const [states, setStates] = useState([]);
//   const [countries, setCountries] = useState([]);

//   const [showModal, setShowModal] = useState(false);
//   const [cityName, setCityName] = useState("");
//   const [stateName, setStateName] = useState("");
//   const [countryName, setCountryName] = useState("");
//   const [zipCodes, setZipCodes] = useState("");
//   const [search, setSearch] = useState("");
//   const [stateFilter, setStateFilter] = useState("All States");
//   const [countryFilter, setCountryFilter] = useState("All Countries");
//   const [editIndex, setEditIndex] = useState(null);

//   useEffect(() => {
//     fetchCities();
//     fetchStates();
//     fetchCountries();
//   }, []);

//   const fetchCities = async () => {
//     try {
//       const res = await API.get("/cities");
//       setCities(res.data);
//     } catch (err) {
//       console.log("Cities fetch error:", err);
//     }
//   };

//   const fetchStates = async () => {
//     try {
//       const res = await API.get("/states");
//       setStates(res.data);
//     } catch (err) {
//       console.log("States fetch error:", err);
//     }
//   };

//   const fetchCountries = async () => {
//     try {
//       const res = await API.get("/countries");
//       setCountries(res.data);
//     } catch (err) {
//       console.log("Countries fetch error:", err);
//     }
//   };

//   const handleSave = async () => {
//     if (!cityName.trim() || !stateName.trim() || !countryName.trim()) {
//       alert("City, State and Country required");
//       return;
//     }

//     const payload = {
//       name: cityName.trim(),
//       state: stateName,
//       country: countryName,
//       zip: zipCodes.trim(),
//     };

//     // console.log("CITY PAYLOAD:", payload);

//     try {
//       if (editIndex !== null) {
//         await API.put(`/cities/${cities[editIndex]._id}`, payload);
//       } else {
//         await API.post("/cities", payload);
//       }

//       fetchCities();
//       resetForm();
//     } catch (err) {
//       console.log("Save error:", err?.response?.data || err.message);
//     }
//   };

//   const resetForm = () => {
//     setCityName("");
//     setStateName("");
//     setCountryName("");
//     setZipCodes("");
//     setEditIndex(null);
//     setShowModal(false);
//   };

//   const handleEdit = (index) => {
//     const city = cities[index];
//     setCityName(city.name);
//     setStateName(city.state?._id || "");
//     setCountryName(city.country?._id || "");
//     setZipCodes(city.zip || "");
//     setEditIndex(index);
//     setShowModal(true);
//   };

//   const handleDelete = async (index) => {
//     try {
//       await API.delete(`/cities/${cities[index]._id}`);
//       fetchCities();
//     } catch (err) {
//       console.log("Delete error:", err);
//     }
//   };

//   const filteredCities = cities.filter((city) => {
//     const cityState = city.state?.name || "";
//     const cityCountry = city.country?.name || "";
//     const cityZip = city.zip || "";

//     const matchSearch =
//       city.name.toLowerCase().includes(search.toLowerCase()) ||
//       cityState.toLowerCase().includes(search.toLowerCase()) ||
//       cityCountry.toLowerCase().includes(search.toLowerCase()) ||
//       cityZip.toLowerCase().includes(search.toLowerCase());

//     const matchState =
//       stateFilter === "All States" || cityState === stateFilter;

//     const matchCountry =
//       countryFilter === "All Countries" || cityCountry === countryFilter;

//     return matchSearch && matchState && matchCountry;
//   });

//   const uniqueStates = [
//     "All States",
//     ...new Set(
//       cities.map((city) => city.state?.name).filter(Boolean)
//     ),
//   ];

//   const uniqueCountries = [
//     "All Countries",
//     ...new Set(
//       cities.map((city) => city.country?.name).filter(Boolean)
//     ),
//   ];

//   const filteredStatesForSelectedCountry = countryName
//     ? states.filter(
//         (s) => (s.country?._id || s.country) === countryName
//       )
//     : states;

//   return (
//     <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">Cities</h1>
//           <p className="text-sm text-gray-500">Manage all cities from here</p>
//         </div>

//         <div className="flex flex-col sm:flex-row gap-2">
//           <button
//             onClick={() => {
//               setEditIndex(null);
//               setCityName("");
//               setStateName("");
//               setCountryName("");
//               setZipCodes("");
//               setShowModal(true);
//             }}
//             className="bg-[#944ee1] hover:bg-[#7912e7] text-white px-4 py-2 rounded-lg w-full sm:w-auto"
//           >
//             + Add City
//           </button>
//         </div>
//       </div>

//       <div className="bg-white p-4 rounded-lg shadow mb-4">
//         <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
//           <div className="relative w-full">
//             <IoSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search cities..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="border p-2 pl-10 rounded-lg w-full border-gray-300 outline-none"
//             />
//           </div>

//           <select
//             value={stateFilter}
//             onChange={(e) => setStateFilter(e.target.value)}
//             className="border p-2 rounded-lg border-gray-300 w-full"
//           >
//             {uniqueStates.map((state, index) => (
//               <option key={index} value={state}>
//                 {state}
//               </option>
//             ))}
//           </select>

//           <select
//             value={countryFilter}
//             onChange={(e) => setCountryFilter(e.target.value)}
//             className="border p-2 rounded-lg border-gray-300 w-full"
//           >
//             {uniqueCountries.map((country, index) => (
//               <option key={index} value={country}>
//                 {country}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full min-w-[700px]">
//             <thead className="border-b bg-gray-50">
//               <tr>
//                 <th className="text-left p-4 text-gray-700">City Name</th>
//                 <th className="text-left p-4 text-gray-700">State Name</th>
//                 <th className="text-left p-4 text-gray-700">Zip Code</th>
//                 <th className="text-right p-4 text-gray-700">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {filteredCities.length > 0 ? (
//                 filteredCities.map((city, index) => (
//                   <tr key={index} className="border-b hover:bg-gray-50">
//                     <td className="p-4 text-gray-800">{city.name}</td>
//                     <td className="p-4 text-gray-600">
//                       {city.state?.name || "-"}
//                     </td>
//                     <td className="p-4 text-gray-600">
//                       {city.zip || "-"}
//                     </td>
//                     <td className="p-4">
//                       <div className="flex justify-end gap-4">
//                         <button onClick={() => handleEdit(index)}>
//                           <FaEdit className="text-[#944ee1] cursor-pointer" />
//                         </button>

//                         <button onClick={() => handleDelete(index)}>
//                           <FaTrash className="text-red-500 cursor-pointer" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="4" className="p-6 text-center text-gray-500">
//                     No cities found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         <div className="p-4 text-sm text-gray-500">
//           Showing {filteredCities.length} entries
//         </div>
//       </div>

//       {showModal && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
//           <div className="bg-white w-full max-w-md rounded-lg shadow-lg">
//             <div className="flex justify-between items-center p-4 border-b">
//               <h2 className="font-semibold text-lg">
//                 <span className="text-blue-600">
//                   {editIndex !== null ? "Edit" : "New"}
//                 </span>{" "}
//                 City
//               </h2>

//               <button onClick={resetForm}>✕</button>
//             </div>

//             <div className="p-4">
//               <label className="text-sm font-medium">
//                 City Name <span className="text-red-500">*</span>
//               </label>

//               <input
//                 type="text"
//                 value={cityName}
//                 onChange={(e) => setCityName(e.target.value)}
//                 className="border w-full p-2 rounded mt-1 mb-3"
//               />

//               <label className="text-sm font-medium">
//                 Country <span className="text-red-500">*</span>
//               </label>

//               <select
//                 value={countryName}
//                 onChange={(e) => {
//                   setCountryName(e.target.value);
//                   setStateName("");
//                 }}
//                 className="border w-full p-2 rounded mt-1 mb-3"
//               >
//                 <option value="">Select a country</option>
//                 {countries.map((c) => (
//                   <option key={c._id} value={c._id}>
//                     {c.name}
//                   </option>
//                 ))}
//               </select>

//               <label className="text-sm font-medium">
//                 State <span className="text-red-500">*</span>
//               </label>

//               <select
//                 value={stateName}
//                 onChange={(e) => setStateName(e.target.value)}
//                 className="border w-full p-2 rounded mt-1 mb-3"
//               >
//                 <option value="">Select a state</option>
//                 {filteredStatesForSelectedCountry.map((s) => (
//                   <option key={s._id} value={s._id}>
//                     {s.name}
//                   </option>
//                 ))}
//               </select>

//               <label className="text-sm font-medium">
//                 Zip Code <span className="text-gray-400">(Optional)</span>
//               </label>

//               <textarea
//                 value={zipCodes}
//                 onChange={(e) => setZipCodes(e.target.value)}
//                 className="border w-full p-2 rounded mt-1"
//               />
//             </div>

//             <div className="flex justify-end gap-3 p-4 border-t">
//               <button onClick={resetForm} className="border px-4 py-2 rounded">
//                 Cancel
//               </button>

//               <button
//                 onClick={handleSave}
//                 className="bg-blue-600 text-white px-4 py-2 rounded"
//               >
//                 {editIndex !== null ? "Update" : "Save"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }




import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import API from "../../api";

export default function City() {
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [cityName, setCityName] = useState("");
  const [stateName, setStateName] = useState("");
  const [countryName, setCountryName] = useState("");
  const [zipCodes, setZipCodes] = useState("");
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("All States");
  const [countryFilter, setCountryFilter] = useState("All Countries");
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    fetchCities();
    fetchStates();
    fetchCountries();
  }, []);

  const fetchCities = async () => {
    try {
      const res = await API.get("/cities");
      setCities(res.data);
    } catch (err) {
      console.log("Cities fetch error:", err?.response?.data || err.message);
    }
  };

  const fetchStates = async () => {
    try {
      const res = await API.get("/states");
      setStates(res.data);
    } catch (err) {
      console.log("States fetch error:", err?.response?.data || err.message);
    }
  };

  const fetchCountries = async () => {
    try {
      const res = await API.get("/countries");
      setCountries(res.data);
    } catch (err) {
      console.log("Countries fetch error:", err?.response?.data || err.message);
    }
  };

  const handleSave = async () => {
    if (!cityName.trim() || !stateName.trim() || !countryName.trim()) {
      alert("City, State and Country required");
      return;
    }

    const payload = {
      city: cityName.trim(),
      state: stateName,
      country: countryName,
      zip: zipCodes.trim(),
    };

    console.log("CITY PAYLOAD:", payload);

    try {
      if (editIndex !== null) {
        await API.put(`/cities/${cities[editIndex]._id}`, payload);
      } else {
        await API.post("/cities", payload);
      }

      await fetchCities();
      resetForm();
    } catch (err) {
      console.log("Save error:", err?.response?.data || err.message);
    }
  };

  const resetForm = () => {
    setCityName("");
    setStateName("");
    setCountryName("");
    setZipCodes("");
    setEditIndex(null);
    setShowModal(false);
  };

  const handleEdit = (index) => {
    const city = cities[index];
    setCityName(city.city || "");
    setStateName(city.state?._id || city.state || "");
    setCountryName(city.country?._id || city.country || "");
    setZipCodes(city.zip || "");
    setEditIndex(index);
    setShowModal(true);
  };

  const handleDelete = async (index) => {
    try {
      await API.delete(`/cities/${cities[index]._id}`);
      fetchCities();
    } catch (err) {
      console.log("Delete error:", err?.response?.data || err.message);
    }
  };

  const filteredCities = cities.filter((item) => {
    const cityValue = item.city || "";
    const cityState = item.state?.name || "";
    const cityCountry = item.country?.name || "";
    const cityZip = item.zip || "";

    const searchValue = search.toLowerCase();

    const matchSearch =
      cityValue.toLowerCase().includes(searchValue) ||
      cityState.toLowerCase().includes(searchValue) ||
      cityCountry.toLowerCase().includes(searchValue) ||
      cityZip.toLowerCase().includes(searchValue);

    const matchState =
      stateFilter === "All States" || cityState === stateFilter;

    const matchCountry =
      countryFilter === "All Countries" || cityCountry === countryFilter;

    return matchSearch && matchState && matchCountry;
  });

  const uniqueStates = [
    "All States",
    ...new Set(cities.map((item) => item.state?.name).filter(Boolean)),
  ];

  const uniqueCountries = [
    "All Countries",
    ...new Set(cities.map((item) => item.country?.name).filter(Boolean)),
  ];

  const filteredStatesForSelectedCountry = countryName
    ? states.filter((s) => (s.country?._id || s.country) === countryName)
    : states;

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Cities</h1>
          <p className="text-sm text-gray-500">Manage all cities from here</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => {
              setEditIndex(null);
              setCityName("");
              setStateName("");
              setCountryName("");
              setZipCodes("");
              setShowModal(true);
            }}
            className="bg-[#944ee1] hover:bg-[#7912e7] text-white px-4 py-2 rounded-lg w-full sm:w-auto"
          >
            + Add City
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <div className="relative w-full">
            <IoSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search cities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border p-2 pl-10 rounded-lg w-full border-gray-300 outline-none"
            />
          </div>

          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="border p-2 rounded-lg border-gray-300 w-full"
          >
            {uniqueStates.map((state, index) => (
              <option key={index} value={state}>
                {state}
              </option>
            ))}
          </select>

          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="border p-2 rounded-lg border-gray-300 w-full"
          >
            {uniqueCountries.map((country, index) => (
              <option key={index} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="text-left p-4 text-gray-700">City Name</th>
                <th className="text-left p-4 text-gray-700">State Name</th>
                <th className="text-left p-4 text-gray-700">Zip Code</th>
                <th className="text-right p-4 text-gray-700">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCities.length > 0 ? (
                filteredCities.map((item, index) => (
                  <tr key={item._id || index} className="border-b hover:bg-gray-50">
                    <td className="p-4 text-gray-800">{item.city}</td>
                    <td className="p-4 text-gray-600">{item.state?.name || "-"}</td>
                    <td className="p-4 text-gray-600">{item.zip || "-"}</td>
                    <td className="p-4">
                      <div className="flex justify-end gap-4">
                        <button onClick={() => handleEdit(index)}>
                          <FaEdit className="text-[#944ee1] cursor-pointer" />
                        </button>

                        <button onClick={() => handleDelete(index)}>
                          <FaTrash className="text-red-500 cursor-pointer" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-gray-500">
                    No cities found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 text-sm text-gray-500">
          Showing {filteredCities.length} entries
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-semibold text-lg">
                <span className="text-blue-600">
                  {editIndex !== null ? "Edit" : "New"}
                </span>{" "}
                City
              </h2>

              <button onClick={resetForm}>✕</button>
            </div>

            <div className="p-4">
              <label className="text-sm font-medium">
                City Name <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
                className="border w-full p-2 rounded mt-1 mb-3"
              />

              <label className="text-sm font-medium">
                Country <span className="text-red-500">*</span>
              </label>

              <select
                value={countryName}
                onChange={(e) => {
                  setCountryName(e.target.value);
                  setStateName("");
                }}
                className="border w-full p-2 rounded mt-1 mb-3"
              >
                <option value="">Select a country</option>
                {countries.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <label className="text-sm font-medium">
                State <span className="text-red-500">*</span>
              </label>

              <select
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                className="border w-full p-2 rounded mt-1 mb-3"
              >
                <option value="">Select a state</option>
                {filteredStatesForSelectedCountry.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>

              <label className="text-sm font-medium">
                Zip Code <span className="text-gray-400">(Optional)</span>
              </label>

              <textarea
                value={zipCodes}
                onChange={(e) => setZipCodes(e.target.value)}
                className="border w-full p-2 rounded mt-1"
              />
            </div>

            <div className="flex justify-end gap-3 p-4 border-t">
              <button onClick={resetForm} className="border px-4 py-2 rounded">
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                {editIndex !== null ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}