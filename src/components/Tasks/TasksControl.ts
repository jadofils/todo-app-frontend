// TasksControl.ts
export interface Task {
    startDate: any;
    createdBy: any;
    cancelledBy: any;
    dueDate(dueDate: any): import("react").ReactNode;
    id: number;
    title: string;
    description: string;
    status: string; // e.g., "todo", "in progress", "done"
    createdAt: string;
    updatedAt: string;
    userId: number; // Assuming tasks are associated with users
    // Add other properties as needed
  }
  
  export const fetchTasks = async (): Promise<Task[]> => {
    try {
      const response = await fetch('https://todo-app-ingata-1.onrender.com/api/tasks');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return []; // Return an empty array or handle the error as needed
    }
  };