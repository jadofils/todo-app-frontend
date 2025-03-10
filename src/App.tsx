// src/App.tsx
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LeftSidebar from './components/LeftSidebar';
import TaskTable from './components/TaskTable';
import { fetchUsers, User } from './components/Users/UserControl';
import { fetchTasks, Task } from './components/Tasks/TasksControl';
import './App.css';

const App: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const getUsers = async () => {
      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers);
    };

    getUsers();
  }, []);

  useEffect(() => {
    const getTasks = async () => {
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
        setTasks([]);
      }
    };

    getTasks();
  }, [selectedUser]);

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
  };

  const handleAddTask = () => {
    // Implement add task logic
    console.log('Add Task');
  };

  const handleEditTask = (taskId: number) => {
    // Implement edit task logic
    console.log('Edit Task:', taskId);
  };

  const handleDeleteTask = (taskId: number) => {
    // Implement delete task logic
    console.log('Delete Task:', taskId);
  };

  const handleViewTask = (taskId: number) => {
    // Implement view task logic
    console.log('View Task:', taskId);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/4 p-4 bg-gray-100">
          <LeftSidebar
            users={users}
            onSelectUser={handleSelectUser}
            selectedUser={selectedUser}
          />
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          <TaskTable
            tasks={tasks}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onViewTask={handleViewTask}
          />
        </div>
      </div>
    </div>
  );
};

export default App;