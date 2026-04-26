import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import api from "../../api"; 

export default function Countries() {
  const [countries, setCountries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [countryName, setCountryName] = useState("");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  const fetchCountries = async () => {
    try {
      const res = await api.get("/countries");
      setCountries(res.data);
    } catch (error) {
      console.log("Fetch countries error:", error);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const handleSave = async () => {
    if (!countryName.trim()) return;

    try {
      if (editId) {
        await api.put(`/countries/${editId}`, { name: countryName });
      } else {
        await api.post("/countries", { name: countryName });
      }

      setCountryName("");
      setEditId(null);
      setShowModal(false);
      fetchCountries();
    } catch (error) {
      console.log("Save country error:", error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (country) => {
    setCountryName(country.name);
    setEditId(country._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/countries/${id}`);
      fetchCountries();
    } catch (error) {
      console.log("Delete country error:", error);
    }
  };

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Countries</h1>
          <p className="text-sm text-gray-500">Manage all countries from here</p>
        </div>

        <button
          onClick={() => {
            setShowModal(true);
            setCountryName("");
            setEditId(null);
          }}
          className="bg-[#944ee1] hover:bg-[#7007e0] text-white px-4 py-2 rounded-lg w-full sm:w-auto"
        >
          + Add Country
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <div className="relative w-full sm:w-80">
          <IoSearch className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search countries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border pl-10 pr-3 py-2 rounded-lg w-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="text-left p-4 text-gray-700">Country Name</th>
                <th className="text-right p-4 text-gray-700">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => (
                  <tr key={country._id} className="border-b hover:bg-gray-50">
                    <td className="p-4 text-gray-800">{country.name}</td>
                    <td className="p-4">
                      <div className="flex justify-end gap-4">
                        <button onClick={() => handleEdit(country)}>
                          <FaEdit className="text-[#944ee1] cursor-pointer hover:text-[#7a12e9]" />
                        </button>

                        <button onClick={() => handleDelete(country._id)}>
                          <FaTrash className="text-red-500 cursor-pointer hover:text-red-700" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="p-6 text-center text-gray-500">
                    No countries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 text-sm text-gray-500">
          Showing {filteredCountries.length} entries
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                <span className="text-blue-600">{editId ? "Edit" : "New"}</span> Country
              </h2>

              <button
                onClick={() => {
                  setShowModal(false);
                  setCountryName("");
                  setEditId(null);
                }}
                className="text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            <label className="text-sm font-medium">
              Country Name <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              placeholder="Enter country name"
              maxLength={20}
              value={countryName}
              onChange={(e) => setCountryName(e.target.value)}
              className="border w-full p-2 rounded mt-1 mb-4 outline-none focus:ring-2 focus:ring-blue-200"
            />

            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setCountryName("");
                  setEditId(null);
                }}
                className="px-4 py-2 border rounded w-full sm:w-auto"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="bg-[#944ee1] hover:bg-[#7908f1] text-white px-4 py-2 rounded w-full sm:w-auto"
              >
                {editId ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



