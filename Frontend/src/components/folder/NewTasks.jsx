import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function NewTask() {
  const navigate = useNavigate();
  const { id } = useParams();
  const API = "http://localhost:8080/api/tasks";

  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    assigned: "",
    due: "",
    priority: "Low",
    completed: false,
  });

  const [users, setUsers] = useState([]);

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

  useEffect(() => {
    const fetchTask = async () => {
      try {
        if (id) {
          const res = await axios.get(`${API}/${id}`);
          setFormData(res.data);
        }
      } catch (error) {
        console.log("Single task fetch error:", error);
      }
    };

    fetchTask();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePriority = (value) => {
    setFormData({
      ...formData,
      priority: value,
    });
  };

  const handleSaveTask = async () => {
    if (
      !formData.title.trim() ||
      !formData.desc.trim() ||
      !formData.assigned.trim() ||
      !formData.due.trim() ||
      !formData.priority.trim()
    ) {
      alert("All fields are required");
      return;
    }

    try {
      if (id) {
        await axios.put(`${API}/${id}`, formData);
        alert("Task updated successfully");
      } else {
        await axios.post(API, formData);
        alert("Task added successfully");
      }

      navigate("/dashboard/task");
    } catch (error) {
      console.log("Save error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="inset-0  flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-5 h-screen">
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-lg font-semibold text-[#944ee1]">
            {id ? "Edit Task" : "New Task"}
          </h2>

          <button onClick={() => navigate("/dashboard/task")}>✕</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <label className="font-medium">Task Name *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task name..."
              className="border p-2 rounded w-full mt-1"
            />

            <p className="text-sm text-gray-400">
              {formData.title.length} / 50
            </p>

            <label className="font-medium mt-4 block">Description</label>
            <textarea
              name="desc"
              value={formData.desc}
              onChange={handleChange}
              placeholder="Describe the task details..."
              className="border p-2 rounded w-full h-32 mt-1"
            />
            <p className="text-sm text-gray-400">
              {formData.desc.length} / 500
            </p>

            <div>
              <label className="font-medium mt-4 block">Assigned To *</label>
              <select
                name="assigned"
                value={formData.assigned}
                onChange={handleChange}
                className="border p-2 rounded w-full mt-1"
              >
                <option value="">Assigned to user</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.firstName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="w-full">
                <label>Due Date</label>
                <input
                  type="date"
                  name="due"
                  value={formData.due}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              </div>

              <div className="w-full">
                <label>Priority</label>

                <div className="flex gap-2 mt-1 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handlePriority("Low")}
                    className={`border px-3 py-1 rounded ${
                      formData.priority === "Low"
                        ? "bg-green-600 text-white"
                        : "text-green-600"
                    }`}
                  >
                    Low
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePriority("Medium")}
                    className={`border px-3 py-1 rounded ${
                      formData.priority === "Medium"
                        ? "bg-orange-600 text-white"
                        : "text-orange-600"
                    }`}
                  >
                    Medium
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePriority("High")}
                    className={`border px-3 py-1 rounded ${
                      formData.priority === "High"
                        ? "bg-red-600 text-white"
                        : "text-red-600"
                    }`}
                  >
                    High
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-gray-100 p-4 rounded">
              <p className="font-semibold">Current Status</p>
              <span className="bg-[#d7d1dd] text-[#8922f7] px-2 py-1 rounded text-sm">
                {formData.completed ? "Completed" : "In Progress"}
              </span>
            </div>

            <div className="bg-gray-100 p-4 rounded mt-4">
              <p className="font-semibold">Details</p>
              <p className="text-sm mt-2">
                {id ? "Editing existing task" : "Creating new task"}
              </p>
              <p className="text-sm">
                Priority: {formData.priority || "Not selected"}
              </p>
              <p className="text-sm">Assigned: {formData.assigned || "-"}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 border-t pt-4">
          <button
            className="border px-4 py-2 rounded"
            onClick={() => navigate("/dashboard/task")}
          >
            Cancel
          </button>

          <button
            onClick={handleSaveTask}
            className="bg-[#944ee1] text-white px-4 py-2 rounded"
          >
            {id ? "Update Task" : "Save Task"}
          </button>
        </div>
      </div>
    </div>
  );
}



