import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ValidatorModal from './validator/ValidatorModal';
import UserEthAddress from "./UserEthAddress";

const NavigationBar = () => {
  const location = useLocation();
  const isActive = (pathname) => location.pathname === pathname;

  const [modalOpen, setModalOpen] = useState(false);
  const handleOpenModal = () => {
    setModalOpen(true);
  }

  const handleCloseModal = () => {
    setModalOpen(false);
  }

  return (
    <nav className="bg-transparent px-4 py-3 font-sans">
      <div className="max-w-full mx-auto flex items-center justify-between">
        <div className="md:flex">
          <a
            href="/"
            className={`text-black hover:text-blue-500 mx-4 ${isActive("/") &&
              "text-black font-bold pointer-events-none"
              }`}
          >
            Home
          </a>
          <a
            href="/donation"
            className={`text-black hover:text-blue-500 mx-4 ${isActive("/donation") &&
              "text-black font-bold pointer-events-none"
              }`}
          >
            Donasi
          </a>
          <a
            href="/create-fundraiser"
            className={`text-black hover:text-blue-500 mx-4 ${isActive("/create-fundraiser") &&
              "text-black font-bold pointer-events-none"
              }`}
          >
            Buat Penggalangan Dana
          </a>
          <button
            onClick={handleOpenModal}
            className={`mr-2 hover:text-blue-500 ${modalOpen && "text-black font-bold pointer-events-none"}`}>
            Validator
          </button>
        </div>
        <div className="flex items-center">
          {!isActive("/") && <UserEthAddress />}

          <ValidatorModal isOpen={modalOpen} onClose={handleCloseModal} />
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;