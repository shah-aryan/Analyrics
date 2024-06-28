import React from 'react';
import { FaUser } from "react-icons/fa";

const CircleButton = ({ onClick }) => {
  return (
    <button
      className="btn btn-circle border-1 border-accent bg-black text-accent hover:bg-accent hover:text-black hover:border-black"
      onClick={onClick}>
      <FaUser className="h-4 w-4" />
    </button>
  );
};

export default CircleButton;
