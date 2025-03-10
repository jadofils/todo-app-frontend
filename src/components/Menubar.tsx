import React from 'react';
import { Link } from 'react-router-dom';

interface MenuBarProps {
  showModal: boolean;
  onClose: () => void;
}

const MenuBar: React.FC<MenuBarProps> = ({ showModal, onClose }) => {
  if (!showModal) return null; // Only render when `showModal` is true

  return (
    <div
      className="position-fixed top-0 start-0 h-100 bg-dark bg-opacity-75 d-flex"
      style={{ zIndex: 1050 }}
    >
      <div
        className="bg-dark p-4"
        style={{
          width: '200px', // Sidebar width
          height: '100vh', // Full viewport height
          position: 'fixed', // Fixed to the side
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="text-white">Profile</h3>
          <button
            className="btn btn-light btn-sm"
            onClick={onClose} // Close the sidebar
          >
            Close
          </button>
        </div>
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link className="nav-link text-white" to="/profile">
              View Profile
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/settings">
              Settings
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/logout">
              Logout
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MenuBar;
