import React from 'react';
import SmallCard from './smallcard.jsx';
import CardList from './cardlist.jsx';

import { BiSolidAlbum } from "react-icons/bi";
import { FaMusic } from "react-icons/fa6";
import { IoIosPerson } from "react-icons/io";
import { FaPeopleGroup } from "react-icons/fa6";

import D3Chart from './collaborationsd3.jsx';
import LineChart from './sentimentsds3.jsx';


const Layout = () => {
  let artist = 'Artist Name';
  return (
    <>
      <div className="flex p-4">
        <div className="grid grid-flow-row grid-cols-2 gap-4 w-max">
          <SmallCard number="56" label="Albums" icon={<BiSolidAlbum />} showPlus={false} />
          <SmallCard number="5" label="Songs" icon={<FaMusic />} showPlus={false} />
          <SmallCard number="5000" label="Total Hours" icon={<IoIosPerson />} showPlus={true} />
          <SmallCard number="9999999" label="Total Words" icon={<IoIosPerson />} showPlus={true} />
          <SmallCard number="999" label="Seconds/Song" icon={<IoIosPerson />} showPlus={false} />
          <SmallCard number="999.4" label="Words/Song" icon={<IoIosPerson />} showPlus={false} />
          <SmallCard number="999000" label="Vocabulary Size" icon={<IoIosPerson />} showPlus={true} />
          <SmallCard number="12.1" label="Reading Level" icon={<IoIosPerson />} showPlus={false} />
        </div>

        <div className="flex-grow pl-4 ">
          <div className="bg-base-200 rounded-3xl shadow-lg outline outline-1 outline-base-300" style={{ height: '300px', width: '400px' }}>
            <div className="flex justify-center items-center text-center text-l text-info pt-4">
              <span className="text-accent"><FaPeopleGroup /></span>
              <span className="ml-2">Collaborations Chart</span>
            </div>
            <div className="text-center text-xl">
              <span className="">{artist}</span>
              <span className="">'s Top Collaborators</span>
            </div>
            <D3Chart />
          </div>
        </div>

        <div className="flex-grow pl-4 ">
          <div className="bg-base-200 rounded-3xl shadow-lg outline outline-1 outline-base-300" style={{ height: '400px', width: '500px' }}>
            <div className="flex justify-center items-center text-center text-l text-info pt-4">
              <span className="text-accent"><FaPeopleGroup /></span>
              <span className="ml-2">Sentiments Chart</span>
            </div>
            <div className="text-center text-xl">
              <span className="">{artist}</span>
              <span className="">'s Album Sentiments over Time</span>
            </div>
            <LineChart/>
          </div>
        </div>
      </div>

      <div className="flex">
        <CardList/>
      </div>



    </>
  );
};

export default Layout;
