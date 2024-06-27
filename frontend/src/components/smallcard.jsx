import React from 'react';


const formatNumber = (num) => {

    // Check if it's a date in ISO format
  if (typeof num === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/.test(num)) {
    // Extract the year from the ISO date
    return (new Date(num)).getFullYear();
  }

  if (num === undefined || num === null || isNaN(Number(num))) {
    return 'N/A'; // Return a default value or handle the error as needed
  }
  num = Number(num); // Convert num to a number
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  else if (num % 1 !== 0) {
    return num.toFixed(2);
  }
  else {
    return num.toString();
  }
};



const SmallCard = ({ number, label, icon, showPlus = true }) => {
  return (
    <div className="relative bg-base-200 flex flex-col items-center p-2 rounded-3xl outline outline-1 outline-base-300 hover:bg-opacity-80 transition duration-300 h-full min-h-48">
      <div className="absolute inset-0 opacity-0 hover:opacity-30 bg-accent bg-opacity-20 transition duration-300 blur-lg rounded-3xl"></div>
      <div className="flex flex-col justify-between items-center h-full w-full">
        <div className="flex-grow"></div>
        <div className="flex items-center text-5xl font-bold mb-1">
          <span>{formatNumber(number)}</span> 
          {showPlus && <span className="text-accent text-4xl font-normal leading-none">+</span>}
        </div>
        <div className="mt-4 p-2 mb-2 flex items-center justify-center text-info text-l bg-base-300 rounded-3xl outline outline-1 outline-neutral-content w-11/12 mx-auto">
          <span className="text-accent">{icon}</span>
          <span className="ml-2">{label}</span>
        </div>
      </div>
    </div>
  );
  
};

export default SmallCard;
