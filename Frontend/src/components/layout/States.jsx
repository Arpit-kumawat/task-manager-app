import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import API from "../../api"; 

export default function States() {
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [stateName, setStateName] = useState("");
  const [country, setCountry] = useState("");
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("All Countries");
  const [editId, setEditId] = useState(null);

  const fetchCountries = async () => {
    try {
      const res = await API.get("/countries");
      setCountries(res.data);
    } catch (error) {
      console.log("Country fetch error:", error);
    }
  };

  const fetchStates = async () => {
    try {
      const res = await API.get("/states");
      setStates(res.data);
    } catch (error) {
      console.log("State fetch error:", error);
    }
  };

  useEffect(() => {
    fetchCountries();
    fetchStates();
  }, []);

  const handleSave = async () => {
    if (!stateName.trim() || !country) {
      alert("State and Country required");
      return;
    }

    try {
      if (editId) {
        await API.put(`/states/${editId}`, {
          name: stateName,
          country,
        });
      } else {
        await API.post("/states", {
          name: stateName,
          country,
        });
      }

      resetForm();
      fetchStates();
    } catch (error) {
      console.log("Save error:", error);
    }
  };

  const resetForm = () => {
    setStateName("");
    setCountry("");
    setEditId(null);
    setShowModal(false);
  };

  const handleEdit = (item) => {
    setStateName(item.name);
    setCountry(item.country?._id || "");
    setEditId(item._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/states/${id}`);
      fetchStates();
    } catch (error) {
      console.log("Delete error:", error);
    }
  };

  const filteredStates = states.filter((item) => {
    const stateName = item.name?.toLowerCase() || "";
    const countryName = item.country?.name?.toLowerCase() || "";

    const matchSearch =
      stateName.includes(search.toLowerCase()) ||
      countryName.includes(search.toLowerCase());

    const matchCountry =
      countryFilter === "All Countries" ||
      item.country?.name === countryFilter;

    return matchSearch && matchCountry;
  });

  const uniqueCountries = [
    "All Countries",
    ...new Set(states.map((item) => item.country?.name).filter(Boolean)),
  ];

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">States</h1>
          <p className="text-sm text-gray-500">Manage all states from here</p>
        </div>

        <button
          onClick={() => {
            setShowModal(true);
            setEditId(null);
            setStateName("");
            setCountry("");
          }}
          className="bg-[#944ee1] hover:bg-[#7a12e9] text-white px-4 py-2 rounded-lg w-full sm:w-auto"
        >
          + Add State
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <div className="relative w-full">
            <IoSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search states..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border p-2 pl-10 rounded-lg w-full border-gray-300 outline-none"
            />
          </div>

          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="border p-2 rounded-lg border-gray-300 w-full"
          >
            {uniqueCountries.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px]">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="text-left p-4 text-gray-700">State Name</th>
                <th className="text-left p-4 text-gray-700">Country Name</th>
                <th className="text-right p-4 text-gray-700">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredStates.length > 0 ? (
                filteredStates.map((item) => (
                  <tr key={item._id} className="border-b hover:bg-gray-50">
                    <td className="p-4 text-gray-800">{item.name}</td>
                    <td className="p-4 text-gray-600">{item.country?.name}</td>
                    <td className="p-4">
                      <div className="flex justify-end gap-4">
                        <button onClick={() => handleEdit(item)}>
                          <FaEdit className="text-[#944ee1] hover:text-[#8112f7] cursor-pointer" />
                        </button>

                        <button onClick={() => handleDelete(item._id)}>
                          <FaTrash className="text-red-500 hover:text-red-700 cursor-pointer" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-6 text-center text-gray-500">
                    No states found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 text-sm text-gray-500">
          Showing {filteredStates.length} entries
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-bold text-lg">
                <span className="text-blue-600">
                  {editId ? "Edit" : "New"}
                </span>{" "}
                State
              </h2>

              <button onClick={resetForm} className="text-gray-500 hover:text-black">
                ✕
              </button>
            </div>

            <div className="p-4">
              <label className="text-sm font-medium">
                State Name <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                placeholder="Enter state name"
                maxLength={50}
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                className="border w-full p-2 rounded mt-1 mb-3 outline-none"
              />

              <label className="text-sm font-medium">
                Country <span className="text-red-500">*</span>
              </label>

              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="border w-full p-2 rounded mt-1 outline-none"
              >
                <option value="">Select a country</option>
                {countries.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 p-4 border-t">
              <button
                onClick={resetForm}
                className="px-4 py-2 border rounded w-full sm:w-auto"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full sm:w-auto"
              >
                {editId ? "Update State" : "Save State"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}







