// src/App.tsx
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LeftSidebar from './components/LeftSidebar';
import TaskTable from './components/TaskTable';
import { fetchUsers, User } from './components/Users/UserControl';
import { fetchTasks, Task } from './components/Tasks/TasksControl';
import './App.css';

const App: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // Track selected user
  const [tasks, setTasks] = useState<Task[]>([]); // Track user-specific tasks
  const [users, setUsers] = useState<User[]>([]); // Track all users

  // Fetch users on component mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const fetchedUsers = await fetchUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    loadUsers();
  }, []);

  // Fetch tasks whenever the selected user changes
  useEffect(() => {
    const loadTasks = async () => {
      if (selectedUser) {
        try {
          const allTasks = await fetchTasks();
          const userTasks = allTasks.filter((task) => task.userId === selectedUser.id);
          setTasks(userTasks);
        } catch (error) {
          console.error('Error fetching user tasks:', error);
          setTasks([]);
        }
      } else {
        setTasks([]); // Clear tasks if no user is selected
      }
    };
    loadTasks();
  }, [selectedUser]);

  // Handlers for various task actions
  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
  };

  const handleAddTask = () => {
    console.log('Add Task functionality triggered');
  };

  const handleEditTask = (taskId: number) => {
    console.log('Edit Task functionality triggered for Task ID:', taskId);
  };

  const handleDeleteTask = (taskId: number) => {
    console.log('Delete Task functionality triggered for Task ID:', taskId);
  };

  const handleViewTask = (taskId: number) => {
    console.log('View Task functionality triggered for Task ID:', taskId);
  };

  // Render the app layout
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for User Selection */}
        <div className="w-1/4 p-4 bg-gray-100">
          <LeftSidebar
            users={users} // Pass users to the sidebar
            onSelectUser={handleSelectUser} // Selection handler
            selectedUser={selectedUser} // Highlight the selected user
          />
        </div>

        {/* Task Table for User's Tasks */}
        <div className="flex-1 p-4 overflow-y-auto">
          <TaskTable
            tasks={tasks} // Pass user's tasks
            onAddTask={handleAddTask} // Add task handler
            onEditTask={handleEditTask} // Edit task handler
            onDeleteTask={handleDeleteTask} // Delete task handler
            onViewTask={handleViewTask} // View task handler
          />
        </div>
      </div>
    </div>
  );
};

export default App;
