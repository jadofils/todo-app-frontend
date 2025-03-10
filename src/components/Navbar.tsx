// Navbar.tsx
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import MenuBar from './Menubar'; // Import MenuBar

const Navbar: React.FC = () => {
  // State to control modal visibility
  const [showModal, setShowModal] = useState(false);

  // Toggle modal visibility
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div>
      <nav className="navbar fixed-top navbar-dark bg-dark shadow">
        <div className="container-fluid">
          <a className="navbar-brand d-flex align-items-center" href="#">
            <div
              style={{ backgroundColor: '#ff7200', width: '40px', height: '40px' }}
              className="rounded-circle d-flex align-items-center justify-content-center me-2"
            />
            <span className="fs-4 fw-semibold">Ingata Todo</span>
          </a>
          <div className="d-flex align-items-center">
            <div className="text-end me-2">
              <div className="fw-semibold small">Dr. Jose Simmons</div>
              <div className="text-muted small">General Practitioner</div>
            </div>
            <div
              style={{ backgroundColor: '#6c757d', width: '40px', height: '40px', cursor: 'pointer' }}
              className="rounded-circle d-flex align-items-center justify-content-center"
              onClick={toggleModal} // Toggle MenuBar on click
            >
              <span className="fw-medium text-white">JS</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Pass props to MenuBar */}
      <MenuBar showModal={showModal} onClose={toggleModal} />
    </div>
  );
};

export default Navbar;
