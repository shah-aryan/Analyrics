import React from 'react';
import { CiSquareQuestion } from "react-icons/ci";

const GraphHolder = ({ title = 'exampletitle', subtitle = 'exampletitle', icon = <CiSquareQuestion />, chart = 'examplechart'}) => {
  return (
    <div className="bg-base-200 rounded-3xl outline outline-1 outline-base-300 h-80 w-96">
      <div className="flex justify-center items-center text-center text-l text-info pt-4">
        <span className="text-accent">{icon}</span>
        <span className="ml-2">{subtitle}</span>
      </div>
      <div className="text-center text-xl">
        <span className="">{title}</span>
      </div>
      {chart}
    </div>
  );
};

export default GraphHolder;
