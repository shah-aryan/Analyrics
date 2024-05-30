import React from 'react';
import ListCard from './listcard.jsx';
import { CiSquareQuestion } from "react-icons/ci";

const CardList = ({title = "example", subtitle = "example", icon = <CiSquareQuestion />, list=['example1', 'example2', 'example3', 'example4', 'example5'], iconlist=[<CiSquareQuestion />,<CiSquareQuestion />, <CiSquareQuestion  />, <CiSquareQuestion />, <CiSquareQuestion />]}) => {

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

  if (iconlist.length > 5) {
    console.log("list and iconlist must have at most 5 elements");
    title = "Error";
    subtitle = "Error";
  }

  return (
    // remove the pl4 that was just there for testing
    <div className="flex"> 
      <div className="bg-base-200 h-auto min-w-72 rounded-3xl outline outline-1 outline-base-300">
        <div className="flex justify-center items-center text-center text-l text-info pt-4">
          <span className="text-accent">{icon}</span>
          <span className="ml-2">{subtitle}</span>
        </div>
        <div className="text-center text-xl">
          <span className="">{title}</span>
        </div>
        <div className="card-list">
      {list.map((title, index) => (
        <ListCard key={index} title={title}/>
      ))}
    </div>
    </div>

    </div>
  );
};

export default CardList;