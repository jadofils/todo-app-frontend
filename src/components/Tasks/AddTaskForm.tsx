import React, { useState } from "react";
import { Task } from "../Tasks/TasksControl";
import { RingLoader } from "react-spinners"; // Import the spinner

interface AddTaskFormProps {
  userId: number;
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

  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newTask = {
      ...formData,
      userId,
    };

    setLoading(true);

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
        setMessage("Task added successfully!");
        setMessageType("success");
      } else {
        setMessage("Failed to add task.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error adding task:", error);
      setMessage("Error adding task.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Add New Task</h3>

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
        <FormInput
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <FormInput
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          as="textarea"
        />
        <FormSelect
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={[
            { value: "pending", label: "Pending" },
            { value: "in_progress", label: "In Progress" },
            { value: "completed", label: "Completed" },
            { value: "cancelled", label: "Cancelled" },
          ]}
        />
        <FormInput
          label="Due Date"
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={handleChange}
        />
        <FormInput
          label="Start Date"
          name="startDate"
          type="date"
          value={formData.startDate}
          onChange={handleChange}
        />

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Adding Task..." : "Add Task"}
        </button>
      </form>
    </div>
  );
};

interface FormInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  required?: boolean;
  type?: string;
  as?: "textarea";
}

const FormInput: React.FC<FormInputProps> = ({ label, name, value, onChange, required, type = "text", as }) => {
  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      {as === "textarea" ? (
        <textarea
          className="form-control"
          name={name}
          value={value}
          onChange={onChange}
        ></textarea>
      ) : (
        <input
          type={type}
          className="form-control"
          name={name}
          value={value}
          onChange={onChange}
          required={required}
        />
      )}
    </div>
  );
};

interface FormSelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
}

const FormSelect: React.FC<FormSelectProps> = ({ label, name, value, onChange, options }) => {
  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <select className="form-select" name={name} value={value} onChange={onChange}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AddTaskForm;
