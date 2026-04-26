import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function User() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/user/all-users");
      const data = await res.json();

      if (res.ok) {
        setUsers(data);
      } else {
        console.log(data.message || "Failed to fetch users");
      }
    } catch (error) {
      console.log("Fetch users error:", error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/user/delete-user/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();
      alert(data.message);
      fetchUsers();
    } catch (error) {
      console.log("Delete user error:", error.message);
    }
  };

  const filteredUsers = users.filter((item) => {
    const fullName = `${item.firstName || ""} ${item.lastName || ""}`;
    const email = item.email || "";

    const cityName =
      typeof item.city === "object"
        ? item.city?.city || item.city?.name || ""
        : item.city || "";

    return (
      fullName.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase()) ||
      cityName.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Users</h1>
          <p className="text-gray-500 text-sm">
            Manage your team members and user accounts
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard/newUsers")}
          className="flex items-center justify-center gap-2 bg-[#944ee1] hover:bg-[#760be9] text-white px-4 py-2 rounded-lg shadow w-full sm:w-auto"
        >
          <FaPlus size={14} />
          Add User
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 items-center">
          <div className="relative w-full xl:col-span-2">
            <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Address</th>
                <th className="px-6 py-3">City</th>
                <th className="px-6 py-3">Zip</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-800 whitespace-nowrap">
                      {user.firstName} {user.lastName}
                    </td>

                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                      {user.email}
                    </td>

                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                      {user.address}
                    </td>

                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                      {user.city?.city || "N/A"}
                    </td>

                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                      {user.zip}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() =>
                            navigate(`/dashboard/newUsers/${user._id}`)
                          }
                          className="text-[#944ee1] hover:text-[#7604f0] text-lg"
                        >
                          <FaEdit />
                        </button>

                        <button
                          onClick={() => handleDelete(user._id)}
                          className="text-red-500 hover:text-red-700 text-md"
                        >
                          <FaTrash />
                        </button> 
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}