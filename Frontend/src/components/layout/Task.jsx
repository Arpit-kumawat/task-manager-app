import React, { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { FaEdit, FaTrash,  } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Tasks() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [tasks, setTasks] = useState([]);

  const API = "http://localhost:8080/api/tasks";

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API);
      setTasks(res.data);
    } catch (error) {
      console.log("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  const toggleComplete = async (id) => {
    try {
      await axios.patch(`${API}/${id}/toggle`);
      fetchTasks();
    } catch (error) {
      console.log("Toggle error:", error);
    }
  };

  const deleteTask = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirmDelete) return;
    
    try {
      await axios.delete(`${API}/${id}`);
      fetchTasks();
    } catch (error) {
      console.log("Delete error:", error);
    }
  };

  const getDueStatus = (dueDate, completed) => {
    if (completed) return "Completed";

    const today = new Date();
    const due = new Date(dueDate);

    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    if (due < today) return "Overdue";
    if (due.getTime() === today.getTime()) return "Today";

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (due.getTime() === tomorrow.getTime()) return "Tomorrow";

    return "Upcoming";
  };

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tasks</h1>
          <p className="text-sm text-gray-500">
            Manage and track all your tasks here
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard/newTasks")}
          className="flex items-center justify-center gap-2 bg-[#944ee1] text-white px-4 py-2 rounded-lg hover:bg-[#7408e7] w-full sm:w-auto"
        >
          <FaPlus />
          Add Task
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-5 md:w-100 sm:w-full">
        <div className="bg-white p-2.5 rounded-lg shadow border border-gray-100 flex items-center gap-3 w-full">
          <IoIosSearch className="text-xl text-gray-500" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="outline-none w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredTasks.map((task) => {
          const status = getDueStatus(task.due, task.completed);

          return (
            <div
              key={task._id}
              className="bg-white p-4 md:p-5 rounded-xl shadow flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-base md:text-lg text-gray-800">
                  {task.title}
                </h2>

                <p className="text-gray-500 text-sm mt-1 break-words">
                  {task.desc}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 lg:justify-end">
                <div className="text-sm">
                  <div className="text-gray-500 pb-2">
                    Assigned
                    <span className="text-gray-800 font-medium ml-2">
                      {task.assigned}
                    </span>
                  </div>

                  <div className="text-gray-500">
                    Due
                    <span
                      className={`ml-2 px-2 py-1 text-xs rounded-full
                      ${status === "Overdue" ? "bg-red-100 text-red-600" : ""}
                      ${status === "Today" ? "bg-yellow-100 text-yellow-600" : ""}
                      ${status === "Tomorrow" ? "bg-blue-100 text-blue-600" : ""}
                      ${status === "Upcoming" ? "bg-gray-100 text-gray-600" : ""}
                      ${status === "Completed" ? "bg-green-100 text-green-600" : ""}`}
                    >
                      {status}
                    </span>
                  </div>

                  <div className="text-gray-500 pb-2 mt-2">
                    Priority
                    <span
                      className={`ml-2 px-3 py-1 text-xs md:text-sm rounded-full inline-block
                      ${task.priority === "High" ? "bg-red-100 text-red-600" : ""}
                      ${task.priority === "Medium" ? "bg-yellow-100 text-yellow-600" : ""}
                      ${task.priority === "Low" ? "bg-green-100 text-green-600" : ""}`}
                    >
                      {task.priority}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={task.completed}
                      onChange={() => toggleComplete(task._id)}
                    />
                    <div
                      className="w-9 h-5 bg-gray-300 rounded-full peer 
                      peer-checked:bg-[#944ee1] 
                      peer-checked:after:translate-x-full 
                      after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                      after:bg-white after:rounded-full after:h-4 after:w-4 
                      after:transition-all"
                    ></div>
                  </label>

                  <button
                    onClick={() => navigate(`/dashboard/newTasks/${task._id}`)}
                    className="text-[#944ee1] hover:text-[#7f18ec] text-lg"
                  >
                    <FaEdit />
                  </button>

                  <button
                    onClick={() => deleteTask(task._id)}
                    className="text-red-500 hover:text-red-700 text-md"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredTasks.length === 0 && (
          <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
            No tasks found.
          </div>
        )}
      </div>
    </div>
  );
}

