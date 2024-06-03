import React from 'react';

const formatNumber = (num) => {
  if (num === undefined || num === null || isNaN(num)) {
    return 'N/A'; // Return a default value or handle the error as needed
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(0) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K';
  } else {
    return num.toString();
  }
};

const SmallCard = ({ number, label, icon, showPlus = true }) => {
  return (
    <div className="w-64 h-40 relative bg-base-200 flex flex-col items-center p-4 rounded-3xl outline outline-1 outline-base-300 hover:bg-opacity-80 transition duration-300">
      <div className="flex items-center text-5xl font-bold">
        <span>{formatNumber(number)}</span> 
        {showPlus && <span className="text-accent text-4xl font-normal leading-none">+</span>}
      </div>
      <div className="mt-2 flex items-center justify-center text-info text-l bg-base-300 p-2 rounded-3xl outline outline-1 outline-neutral-content w-11/12 mx-auto">
        <span className="text-accent">{icon}</span>
        <span className="ml-2">{label}</span>
      </div>
      <div className="absolute inset-0 opacity-0 hover:opacity-30 bg-accent bg-opacity-20 transition duration-300 blur-lg rounded-3xl"></div>
    </div>
  );
};

export default SmallCard;
