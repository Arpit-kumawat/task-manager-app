import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdAccessTimeFilled, MdCloudDone } from "react-icons/md";
import { BiSolidError } from "react-icons/bi";
import { BsFillPersonPlusFill } from "react-icons/bs";

import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [date, setDate] = useState(dayjs());
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/tasks");
      setTasks(res.data || []);
    } catch (error) {
      console.log("Task fetch error:", error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date();

  const completedTasks = tasks.filter((task) => task.completed === true);

  const pendingTasks = tasks.filter((task) => task.completed !== true);

  const overdueTasks = tasks.filter(
    (task) => task.completed !== true && task.due && new Date(task.due) < today,
  );

  const activeTasks = tasks.filter((task) => task.completed !== true);

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  const formatDate = (dateValue) => {
    if (!dateValue) return "No Date";
    return new Date(dateValue).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-600";
      case "Medium":
        return "bg-yellow-100 text-yellow-600";
      case "Low":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusText = (task) => {
    return task.completed ? "Completed" : "Pending";
  };

  const getStatusClass = (task) => {
    return task.completed
      ? "bg-green-100 text-green-600"
      : "bg-blue-100 text-blue-600";
  };

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      <div>
        <h2 className="text-lg md:text-2xl font-bold mb-1">
          Welcome back, {user?.firstName || "User"}!
        </h2>
        <p className="text-gray-600 text-sm md:text-base">
          Here's what's happening today in your workspace.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
        <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
          <div>
            <p className="text-gray-600 text-sm">Pending tasks</p>
            <h3 className="font-bold text-xl">{pendingTasks.length}</h3>
          </div>
          <MdAccessTimeFilled className="text-orange-500 bg-orange-200 p-2 rounded-md text-4xl" />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
          <div>
            <p className="text-gray-600 text-sm">Completed tasks</p>
            <h3 className="font-bold text-xl">{completedTasks.length}</h3>
          </div>
          <MdCloudDone className="text-green-700 bg-green-200 p-2 rounded-md text-4xl" />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
          <div>
            <p className="text-gray-600 text-sm">Overdue tasks</p>
            <h3 className="font-bold text-xl">{overdueTasks.length}</h3>
          </div>
          <BiSolidError className="text-red-700 bg-red-200 p-2 rounded-md text-4xl" />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
          <div>
            <p className="text-gray-600 text-sm">Active tasks</p>
            <h3 className="font-bold text-xl">{activeTasks.length}</h3>
          </div>
          <BsFillPersonPlusFill className="text-[#944ee1] bg-[#e0c6fc] p-2 rounded-md text-4xl" />
        </div>
      </div>

      {/* Table */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-6">
        {/* Recent Tasks  */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Tasks</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-gray-500 bg-gray-100 border-b">
                  <tr>
                    <th className="py-3 px-2">Task Name</th>
                    <th className="py-3 px-2">Due Date</th>
                    <th className="py-3 px-2">Priority</th>
                    <th className="py-3 px-2">Status</th>
                  </tr>
                </thead>

                <tbody className="text-gray-700">
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="py-4 px-2 text-center">
                        Loading tasks...
                      </td>
                    </tr>
                  ) : recentTasks.length > 0 ? (
                    recentTasks.map((task) => (
                      <tr
                        key={task._id}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="py-3 px-2">
                          {task.title || "No Title"}
                        </td>
                        <td className="py-3 px-2">{formatDate(task.due)}</td>
                        <td className="py-3 px-2">
                          <span
                            className={`px-3 py-1 text-xs rounded-full ${getPriorityClass(
                              task.priority,
                            )}`}
                          >
                            {task.priority || "No Priority"}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <span
                            className={`px-3 py-1 text-xs rounded-full ${getStatusClass(
                              task,
                            )}`}
                          >
                            {getStatusText(task)}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-4 px-2 text-center">
                        No tasks found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              className="bg-[#944ee1] hover:bg-[#740be4] text-white px-4 py-2 rounded-lg"
              onClick={() => navigate("/dashboard/newTasks")}
            >
              + New Task
            </button>

            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              onClick={() => navigate("/dashboard/newUsers")}
            >
              <BsFillPersonPlusFill className="inline mr-2" />
              New User
            </button>
          </div>
        </div>

        {/* Calendar */}
        <div className="w-full flex justify-center xl:justify-end">
          <Paper
            elevation={2}
            sx={{
              p: 1.5,
              borderRadius: 3,
              width: "100%",
              maxWidth: 350,
            }}
          >
            <h2 className="text-lg font-semibold mb-1">Calendar</h2>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar
                value={date}
                onChange={(newValue) => setDate(newValue)}
                sx={{
                  width: "100%",
                  "& .MuiPickersCalendarHeader-label": {
                    fontSize: "18px",
                  },
                  "& .MuiDayCalendar-weekDayLabel": {
                    fontSize: "14px",
                  },
                  "& .MuiPickersDay-root": {
                    fontSize: "15px",
                  },
                }}
              />
            </LocalizationProvider>
          </Paper>
        </div>
      </div>
    </div>
  );
}
