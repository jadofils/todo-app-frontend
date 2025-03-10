import React, { useState, useEffect } from 'react';
import { fetchUsers, User } from './Users/UserControl';

interface LeftSidebarProps {
  onSelectUser: (user: User) => void;
  selectedUser?: User;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({
  onSelectUser,
  selectedUser,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const getUsers = async () => {
      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers);
    };
    getUsers();
  }, []);

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div style={{ marginTop: '10vh', width: '250px' }} className="bg-light p-3">
      <h2 className="h5 mb-3">Users</h2>
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search Users..."
          className="form-control"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div
        className="list-group"
        style={{ maxHeight: '400px', overflowY: 'auto', overflowX: 'hidden' }}
      >
        {filteredUsers.map((user) => (
          <button
            key={user.id}
            type="button"
            onClick={() => onSelectUser(user)}
            className={`list-group-item list-group-item-action d-flex flex-column align-items-start ${
              selectedUser && selectedUser.id === user.id
                ? 'bg-warning text-dark'
                : ''
            }`}
            style={{
              border: 'none',
              padding: '0.75rem 1.25rem',
              textAlign: 'left',
            }}
          >
            <div className="d-flex align-items-center w-100 mb-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-person-circle me-2"
                viewBox="0 0 16 16"
              >
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                <path
                  fillRule="evenodd"
                  d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                />
              </svg>
              <div>
                <div className="fw-bold">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-muted small">{user.email}</div>
              </div>
            </div>
            <small className="text-muted">
              Created: {formatDate(user.createdAt)}
            </small>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LeftSidebar;
