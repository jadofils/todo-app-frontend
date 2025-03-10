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
  const [usersLoading, setUsersLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      setUsersLoading(true);
      try {
        const fetchedUsers = await fetchUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setUsersLoading(false);
      }
    };
    loadUsers();
  }, []);

  useEffect(() => {
    const loadTasks = async () => {
      setTasksLoading(true);
      if (selectedUser) {
        try {
          const allTasks = await fetchTasks();
          const userTasks = allTasks.filter((task) => task.userId === selectedUser.id);
          setTasks(userTasks);
        } catch (error) {
          console.error('Error fetching user tasks:', error);
          setTasks([]);
        } finally {
          setTasksLoading(false);
        }
      } else {
        setTasks([]);
        setTasksLoading(false);
      }
    };
    loadTasks();
  }, [selectedUser]);

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

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/4 p-4 bg-gray-100">
          {usersLoading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <LeftSidebar
              users={users}
              onSelectUser={handleSelectUser}
              selectedUser={selectedUser}
            />
          )}
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          {tasksLoading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <TaskTable
              tasks={tasks}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onViewTask={handleViewTask}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;