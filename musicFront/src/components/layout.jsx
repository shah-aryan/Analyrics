import React from 'react';
import SmallCard from './smallcard.jsx';
import CardList from './cardlist.jsx';
import WordCloud from './wordcloud.jsx';
import GraphHolder from './graphholder.jsx';
import NavBar from './navbar.jsx';

import { BiSolidAlbum } from "react-icons/bi";
import { FaMusic } from "react-icons/fa6";
import { IoIosPerson } from "react-icons/io";
import { FaPeopleGroup } from "react-icons/fa6";
import { FaCloud } from "react-icons/fa";
import { GoHeartFill } from "react-icons/go";


import D3Chart from './collaborationsd3.jsx';
import LineChart from './sentimentsds3.jsx';

const Layout = () => {
  let artistName = 'Artist Name';
  let quote = "Artist Name";
  let steps = quote.length;
  let time = (steps/7.0).toString() + 's';
  //let time = "10s";

  return (
    <>
      {/* <h1
        className="flex-wrap relative w-[max-content] font-mono text-5xl
        before:absolute before:inset-0 before:animate-typewriter
        before:bg-black
        after:absolute after:inset-0 after:w-[0.125em] after:animate-caret
        after:bg-black"
        style={{
          '--time': `${time}`, // Set time
          '--typewriter-steps': `${steps}`, // Set steps
        }}
      >
        {quote}
      </h1> */}

      <NavBar title={artistName} />

      <div className="flex flex-wrap gap-8 p-8">
        <div className="grid grid-flow-row grid-cols-2 w-max gap-8">
          <SmallCard number="56" label="Albums" icon={<BiSolidAlbum />} showPlus={false} />
          <SmallCard number="5" label="Songs" icon={<FaMusic />} showPlus={false} />
          <SmallCard number="5000" label="Total Hours" icon={<IoIosPerson />} showPlus={true} />
          <SmallCard number="9999999" label="Total Words" icon={<IoIosPerson />} showPlus={true} />
          <SmallCard number="999" label="Seconds/Song" icon={<IoIosPerson />} showPlus={false} />
          <SmallCard number="999.4" label="Words/Song" icon={<IoIosPerson />} showPlus={false} />
        </div>

        <CardList title="Top 5 something - decide what"/>

        <GraphHolder title="Collaborations Chart" subtitle="Interactive Collaborations Visualizer" icon={<FaPeopleGroup />} chart={<D3Chart />} />
        <GraphHolder title="Sentiments Chart" subtitle="Sentiments Chart" icon={<GoHeartFill />
} chart={<LineChart />} />


        <div className="grid grid-cols-1 gap-8">
          <SmallCard number="999000" label="Vocabulary Size" icon={<IoIosPerson />} showPlus={true} />
          <SmallCard number="12.1" label="Reading Level" icon={<IoIosPerson />} showPlus={false} />
        </div>
      
        <GraphHolder
          title="Word Cloud"
          subtitle="Word Cloud"
          icon={<FaCloud />}
          chart={<WordCloud 
            words={["hello", "world", "example", "react", "javascript", "d3", "cloud", "word", "awesome", "fantastic", "amazing", "great", "beautiful", "awesome", "love", "openai", "technology", "innovation", "inspiration", "creative"]} 
            weights={[0.1, 0.05, 0.08, 0.07, 0.06, 0.05, 0.04, 0.03, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01].map(weight => weight / 0.61)} />}
          />
          <GraphHolder title="Sentiment Trends" chart={<h1>Chart</h1>} />
      </div>

      </>
  );
};

export default Layout;


        // {/* <div className="bg-base-200 rounded-3xl outline outline-1 outline-base-300" style={{ height: '400px', width: '500px' }}>
        //   <div className="flex justify-center items-center text-center text-l text-info pt-4">
        //     <span className="text-accent"><FaPeopleGroup /></span>
        //     <span className="ml-2">Sentiments Chart</span>
        //   </div>
        //   <div className="text-center text-xl">
        //     <span className="">{artist}</span>
        //     <span className="">'s Album Sentiments over Time</span>
        //   </div>
        //   <LineChart/>
        // </div> */}

        //         {/* <div className="bg-base-200 rounded-3xl outline outline-1 outline-base-300" style={{ height: '300px', width: '400px' }}>
        //   <div className="flex justify-center items-center text-center text-l text-info pt-4">
        //     <span className="text-accent"><FaPeopleGroup /></span>
        //     <span className="ml-2">Collaborations Chart</span>
        //   </div>
        //   <div className="text-center text-xl">
        //     <span className="">{artist}</span>
        //     <span className="">'s Top Collaborators</span>
        //   </div>
        //   <D3Chart />
        // </div> */}
