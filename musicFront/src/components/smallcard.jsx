import React from 'react';

const formatNumber = (num) => {
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
    <div className="relative bg-base-200 p-4 flex flex-col items-center rounded-3xl outline outline-1 outline-base-300 w-64 hover:bg-opacity-80">
      <div className="flex items-center text-5xl font-bold">
        <span>{formatNumber(number)}</span>
        {showPlus && <span className="text-accent text-4xl font-normal leading-none">+</span>}
      </div>
      <div className="mt-2 flex items-center justify-center text-info text-l bg-base-300 p-2 rounded-3xl outline outline-1 outline-neutral-content w-11/12 mx-auto">
        <span className="text-accent">{icon}</span>
        <span className="ml-2">{label}</span>
      </div>
      <div className="absolute inset-0 opacity-0 hover:opacity-30 bg-accent bg-opacity-20 transition duration-300 blur-lg"></div>
    </div>
  );
};

export default SmallCard;
