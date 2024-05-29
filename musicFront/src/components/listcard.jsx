import React from 'react';
import { CiSquareQuestion } from "react-icons/ci";

const ListCard = ({ title, icon = <CiSquareQuestion /> }) => {
  return (
    <div className="relative flex items-center p-2 bg-base-300 rounded-xl m-4 outline outline-1 outline-neutral-content hover:bg-opacity-80">
      <div className="flex-shrink-0 p-2 bg-neutral-content rounded-xl">
        <span className="text-success">{icon}</span>
      </div>
      <span className="ml-4 text-warning font-medium">{title}</span>
      <div className="absolute inset-0 opacity-0 hover:opacity-30 bg-accent bg-opacity-20 transition duration-300 blur-lg"></div>
    </div>
  );
};

export default ListCard;
