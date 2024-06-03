import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import SmallCard from '../components/smallcard.jsx';
import CardList from '../components/cardlist.jsx';
import WordCloud from '../graphs/wordcloud.jsx';
import GraphHolder from '../components/graphholder.jsx';
import NavBar from '../components/navbar.jsx';
import D3Chart from '../graphs/collaborationsd3.jsx';
import LineChart from '../graphs/sentimentsds3.jsx';

import { BiSolidAlbum } from "react-icons/bi";
import { FaMusic } from "react-icons/fa6";
import { IoIosPerson } from "react-icons/io";
import { FaPeopleGroup } from "react-icons/fa6";
import { FaCloud } from "react-icons/fa";
import { GoHeartFill } from "react-icons/go";


const Layout = () => {
  const { i } = useParams(); // Get the artist ID from the URL
  const [artistData, setArtistData] = useState(null);

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        const response = await axios.get(`http://localhost:5555/artists/${i}`);
        setArtistData(response.data);
      } catch (error) {
        console.error('Error fetching artist data:', error);
      }
    };

    fetchArtistData();
  }, [i]);

  if (!artistData) {
    return <div>Loading...</div>;
  }
  
  console.log(artistData);

  const artistId = artistData._id;
  const albums = artistData.albums;
  const averageSentenceLength = artistData.averageSentenceLength;
  const averageSongLengthSeconds = artistData.averageSongLengthSeconds;
  const averageSongLengthWords = artistData.averageSongLengthWords;
  const averageWordLength = artistData.averageWordLength;
  const collaborationNetwork = artistData.collaborationNetwork;
  const emotion = artistData.emotion;
  const index = artistData.i;
  const mostUsedWords = artistData.mostUsedWords;
  const name = artistData.name;
  const numberOfCharacters = artistData.numberOfCharacters;
  const numberOfSongs = artistData.numberOfSongs;
  const numberOfWords = artistData.numberOfWords;
  const readingLevel = artistData.readingLevel;
  const varianceOfEmotionsOfAlbums = artistData.varianceOfEmotionsOfAlbums;
  const vocabularySize = artistData.vocabularySize;


  return (
    <>
      <NavBar title={name}/>
      <div className="flex flex-wrap gap-8 p-8">
        <div className="grid grid-flow-row grid-cols-2 w-max gap-8">
          <SmallCard number={albums.length} label="Albums" icon={<BiSolidAlbum />} showPlus={false} />
          <SmallCard number={numberOfSongs} label="Songs" icon={<FaMusic />} showPlus={false} />
          <SmallCard number="000" label="Total Hours" icon={<IoIosPerson />} showPlus={true} />
          <SmallCard number={numberOfWords} label="Total Words" icon={<IoIosPerson />} showPlus={true} />
          <SmallCard number={averageSongLengthSeconds} label="Seconds/Song" icon={<IoIosPerson />} showPlus={false} />
          <SmallCard number={averageSongLengthWords} label="Words/Song" icon={<IoIosPerson />} showPlus={false} />
        </div>
        <GraphHolder title="Collaborations Chart" subtitle="Interactive Collaborations Visualizer" icon={<FaPeopleGroup />} chart={<D3Chart  />} />
        <GraphHolder title="Sentiments Chart" subtitle="Sentiments Chart" icon={<GoHeartFill />} chart={<LineChart />} />
        <div className="grid grid-cols-1 gap-8">
          <SmallCard label="Vocabulary Size" icon={<IoIosPerson />} showPlus={true} />
          <SmallCard label="Reading Level" icon={<IoIosPerson />} showPlus={false} />
        </div>
        <GraphHolder title="Word Cloud" subtitle="Word Cloud" icon={<FaCloud />}  />
        <GraphHolder title="Sentiment Trends" chart={<h1>Chart</h1>} />
      </div>
      <div className='flex h-96'>
          <CardList title="Top 5 something - decide what" />
      </div>
    </>
  );
};

export default Layout;
