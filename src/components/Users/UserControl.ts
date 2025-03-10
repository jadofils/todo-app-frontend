// UserControl.ts
export interface User {
    firstName: string;
    lastName: string;
    email: string;
    password: string; // Include password (even if not displayed)
    id: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export const fetchUsers = async (): Promise<User[]> => {
    try {
      const response = await fetch('https://todo-app-ingata-1.onrender.com/api/users');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
      return []; // Return an empty array or handle the error as needed
    }
  };