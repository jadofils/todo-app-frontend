import React, { useState } from "react";
import { Task } from "../Tasks/TasksControl";

interface AddTaskFormProps {
  userId: number; // Pass userId as a prop
  onTaskAdded: (task: Task) => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ userId, onTaskAdded }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
    dueDate: "",
    startDate: "",
  });

  const [message, setMessage] = useState<string | null>(null); // Message state
  const [messageType, setMessageType] = useState<string>(""); // Message type state

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newTask = {
      ...formData,
      userId, // Ensure userId is sent
    };

    try {
      const response = await fetch("https://todo-app-ingata-1.onrender.com/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        const createdTask = await response.json();
        onTaskAdded(createdTask);
        setFormData({ title: "", description: "", status: "pending", dueDate: "", startDate: "" });

        // Set success message
        setMessage("Task added successfully!");
        setMessageType("success");
      } else {
        // Set failure message
        setMessage("Failed to add task.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error adding task:", error);
      setMessage("Error adding task.");
      setMessageType("error");
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Add New Task</h3>
      
      {/* Display the message */}
      {message && (
        <div
          className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"} mb-3`}
        >
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="p-4 border rounded bg-light">
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Status</label>
          <select className="form-select" name="status" value={formData.status} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Due Date</label>
          <input type="date" className="form-control" name="dueDate" value={formData.dueDate} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Start Date</label>
          <input type="date" className="form-control" name="startDate" value={formData.startDate} onChange={handleChange} />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Add Task
        </button>
      </form>
    </div>
  );
};

export default AddTaskForm;
