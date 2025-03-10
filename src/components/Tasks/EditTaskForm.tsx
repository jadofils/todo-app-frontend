import React, { useState, useEffect } from "react";
import { Task } from "../Tasks/TasksControl";
import { RingLoader } from "react-spinners"; // Import RingLoader

interface EditTaskFormProps {
  task: Task;
  onTaskUpdated: (task: Task) => void;
}

const EditTaskForm: React.FC<EditTaskFormProps> = ({ task, onTaskUpdated }) => {
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description,
    status: task.status,
    dueDate: task.dueDate || "",
    startDate: task.startDate,
  });

  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // Add loading state

  useEffect(() => {
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      dueDate: task.dueDate,
      startDate: task.startDate,
    });
  }, [task]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedTask = {
      ...formData,
      id: task.id,
    };

    setLoading(true); // Set loading to true before the request

    try {
      const response = await fetch(`https://todo-app-ingata-1.onrender.com/api/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });

      if (response.ok) {
        const updatedTaskData = await response.json();
        onTaskUpdated(updatedTaskData);
        setMessage("Task updated successfully!");
        setMessageType("success");
      } else {
        setMessage("Failed to update task.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      setMessage("Error updating task.");
      setMessageType("error");
    } finally {
      setLoading(false); // Set loading to false after the request finishes
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Edit Task</h3>

      {message && (
        <div
          className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"} mb-3`}
        >
          {message}
        </div>
      )}

      {loading && (
        <div className="d-flex justify-content-center mb-3">
          <RingLoader color="#36D7B7" loading={loading} size={50} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 border rounded bg-light">
        {/* Form inputs... */}
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
          <input
            type="date"
            className="form-control"
            name="dueDate"
            value={formData.dueDate as unknown as string}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Start Date</label>
          <input
            type="date"
            className="form-control"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Updating Task..." : "Update Task"}
        </button>
      </form>
    </div>
  );
};

export default EditTaskForm;