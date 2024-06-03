import React from 'react';
import ListCard from './listcard.jsx';
import { CiSquareQuestion } from "react-icons/ci";

const CardList = ({title = "example", subtitle = "example", icon = <CiSquareQuestion />, list=[
  'example1', 'example2', 'example3', 'example4', 'example5', 
  'example6', 'example7', 'example8', 'example9', 'example10'], 
  iconlist=[
  <CiSquareQuestion />, <CiSquareQuestion />, <CiSquareQuestion />, <CiSquareQuestion />, <CiSquareQuestion />,
  <CiSquareQuestion />, <CiSquareQuestion />, <CiSquareQuestion />, <CiSquareQuestion />, <CiSquareQuestion />
]}) => {

  if (list.length !== iconlist.length) {
    console.log("list and iconlist must have the same size");
    title = "Error";
    subtitle = "Error";
  }

  if (list.length === 0) {
    console.log("list and iconlist must have at least one element");
    title = "Error";
    subtitle = "Error";
  }

  return (
    <div className="flex h-full">
      <div className="bg-base-200 h-full min-w-72 rounded-3xl outline outline-1 outline-base-300 flex flex-col">
        <div className="flex justify-center items-center text-center text-l text-info pt-4">
          <span className="text-accent">{icon}</span>
          <span className="ml-2">{subtitle}</span>
        </div>
        <div className="text-center text-xl mb-2"> {/* Add margin-bottom to create gap */}
          <span className="">{title}</span>
        </div>
        <div className="card-list flex-grow overflow-y-auto p-2">
          {list.map((title, index) => (
            <ListCard key={index} title={title}/>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardList;
