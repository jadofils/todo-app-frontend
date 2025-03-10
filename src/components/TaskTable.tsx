import React, { useState, useEffect } from "react";
import axios from "axios";
import { fetchTasks, Task } from "./Tasks/TasksControl";
import AddTaskForm from "./Tasks/AddTaskForm";
import EditTaskForm from "./Tasks/EditTaskForm";

const TaskTable: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState<boolean>(false); // Added loading state

  // Fetch tasks from the API when the component mounts
  useEffect(() => {
    const getTasks = async () => {
      setLoading(true); // Start loading
      try {
        const fetchedTasks = await fetchTasks();
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setMessage("Error fetching tasks.");
        setMessageType("error");
      } finally {
        setLoading(false); // Stop loading
      }
    };
    getTasks();
  }, []);

  // Handle newly added tasks
  const handleTaskAdded = (newTask: Task) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setShowModal(false);
    setMessage("Task added successfully!");
    setMessageType("success");
  };

  // Handle task updates
  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
    setShowModal(false);
    setSelectedTask(null);
    setIsEditMode(false);
    setMessage("Task updated successfully!");
    setMessageType("success");
  };

  // Handle task deletion
  const handleDeleteConfirm = async () => {
    if (taskToDelete === null) return;

    setLoading(true); // Start loading
    try {
      const response = await axios.delete(
        `https://todo-app-ingata-1.onrender.com/api/tasks/${taskToDelete}`
      );

      if (response.status === 200 || response.status === 204) {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskToDelete));
        setMessage("Task deleted successfully!");
        setMessageType("success");
      } else {
        setMessage("Failed to delete task.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      setMessage("Error deleting task.");
      setMessageType("error");
    } finally {
      setLoading(false); // Stop loading
      setShowDeleteModal(false);
      setTaskToDelete(null);
    }
  };

  // Handle the delete button click
  const handleDeleteClick = (taskId: number) => {
    setTaskToDelete(taskId);
    setShowDeleteModal(true);
  };

  // Fetch task details for edit/view
  const fetchTaskById = async (taskId: number) => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get(
        `https://todo-app-ingata-1.onrender.com/api/tasks/${taskId}`
      );
      setSelectedTask(response.data);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching task data:", error);
      setMessage("Error fetching task data.");
      setMessageType("error");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Handle Edit action
  const handleEdit = (taskId: number) => {
    setIsEditMode(true);
    fetchTaskById(taskId);
  };

  // Handle View action
  const handleView = (taskId: number) => {
    setIsEditMode(false);
    fetchTaskById(taskId);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTask(null);
    setIsEditMode(false);
  };

  // Get background class based on task status
  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-warning";
      case "in_progress":
        return "bg-info";
      case "completed":
        return "bg-success";
      case "cancelled":
        return "bg-danger";
      default:
        return "";
    }
  };

  return (
    <div className="container mt-[10vh]">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Tasks</h2>
        <button
          onClick={() => {
            setIsEditMode(false);
            setSelectedTask(null);
            setShowModal(true);
          }}
          className="btn btn-primary"
        >
          <i className="bi bi-plus-circle me-1"></i> Add Task
        </button>
      </div>

      {/* Display message */}
      {message && (
        <div className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"}`}>
          {message}
        </div>
      )}

      {/* Show loading spinner when loading */}
      {loading && (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Task Modal */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {selectedTask ? (isEditMode ? "Edit Task" : "View Task") : "Add Task"}
                </h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                {selectedTask && isEditMode ? (
                  <EditTaskForm task={selectedTask} onTaskUpdated={handleTaskUpdated} />
                ) : selectedTask && !isEditMode ? (
                  <div className="container">
                    <h3 className="mb-3">Task Details</h3>
                    <div className="p-4 border rounded bg-light">
                      <div className="mb-3">
                        <strong>Title:</strong> {selectedTask.title}
                      </div>
                      <div className="mb-3">
                        <strong>Description:</strong> {selectedTask.description}
                      </div>
                      <div className="mb-3">
                        <strong>Status:</strong> {selectedTask.status}
                      </div>
                      <div className="mb-3">
                        <strong>Due Date:</strong> {new Date(selectedTask.dueDate).toLocaleDateString()}
                      </div>
                      <div className="mb-3">
                        <strong>Start Date:</strong> {new Date(selectedTask.startDate).toLocaleDateString()}
                      </div>
                      <button onClick={() => setIsEditMode(true)} className="btn btn-primary w-100">
                        Edit This Task
                      </button>
                    </div>
                  </div>
                ) : (
                  <AddTaskForm onTaskAdded={handleTaskAdded} userId={0} />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Table */}
      <div className="table-responsive" style={{ maxHeight: "400px", overflowX: "auto" }}>
        <table className="table table-striped table-bordered w-auto">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.id}</td>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td className={getStatusClass(task.status)}>{task.status}</td>
                <td>{new Date(task.createdAt).toLocaleDateString()}</td>
                <td>{new Date(task.updatedAt).toLocaleDateString()}</td>
                <td>
                  <button className="btn btn-success btn-sm me-2" onClick={() => handleView(task.id)}>
                    <i className="bi bi-eye"></i> View
                  </button>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(task.id)}>
                    <i className="bi bi-pencil"></i> Edit
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDeleteClick(task.id)}>
                    <i className="bi bi-trash"></i> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskTable;
