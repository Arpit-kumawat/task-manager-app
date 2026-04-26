const Task = require("../models/Task");


const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Tasks fetch error", error: error.message });
  }
}; 

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Task fetch error", error: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, desc, assigned, due, priority, completed } = req.body;

    const newTask = await Task.create({
      title,
      desc,
      assigned,
      due,
      priority,
      completed,
    });

    res.status(201).json({
      message: "Task created successfully",
      task: newTask,
    });
  } catch (error) {
    res.status(500).json({ message: "Task create error", error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    res.status(500).json({ message: "Task update error", error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Task delete error", error: error.message });
  }
};

const toggleTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.completed = !task.completed;
    await task.save();

    res.status(200).json({
      message: "Task status updated",
      task,
    });
  } catch (error) {
    res.status(500).json({ message: "Status update error", error: error.message });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
};