import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';

import SmallCard from '../components/smallcard.jsx';
import GraphHolder from '../components/graphholder.jsx';
import NavBar from '../components/navbar.jsx';
import D3Chart from '../graphs/collaborationsd3.jsx';
import WordCloud from '../graphs/wordcloud.jsx';
import SentimentsBubble from '../graphs/sentimentsbubble.jsx';
import SongCarousel from '../components/songcarousel.jsx';
import PieChart from '../graphs/positivenegative.jsx';
import Loading from './loading.jsx';

import { BiSolidAlbum } from "react-icons/bi";
import { FaMusic } from "react-icons/fa6";
import { IoIosPerson } from "react-icons/io";
import { FaPeopleGroup } from "react-icons/fa6";
import { FaCloud } from "react-icons/fa";
import { GoHeartFill } from "react-icons/go";
import { FaSmile } from "react-icons/fa";
import { FaBookReader } from "react-icons/fa";
import { FaBook } from "react-icons/fa";
import { RiNumbersFill } from "react-icons/ri";
import { FaRulerVertical } from "react-icons/fa";

import dotenv from 'dotenv';
const VITE_API_URL = import.meta.env.VITE_API_URL;

const AlbumLayout = () => {

  function ScrollToBottom(songId, albumId) {
    const location = useLocation();
  
    useEffect(() => {

      if (albumId !== songId) {
      // Scroll to the bottom when the component mounts or when the location changes
        window.scrollTo(0, document.body.scrollHeight);
      }
    }, [location]);
  
    return null; // This component doesn't render anything visible
  }

  const { i , j } = useParams();
  //convert to int
  const albumId = parseInt(i);
  let songId = parseInt(j);
  ScrollToBottom(songId, albumId);

  let currentURL = useLocation().pathname;
  //get songId by getting all characters from the back until a '/'
  songId = parseInt(currentURL.slice(currentURL.lastIndexOf('/') + 1));

  if (isNaN(songId) || songId < 0) {
    songId = -1;
  }

  const [albumData, setAlbumData] = useState(null);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });


  useEffect(() => {
    const fetchAlbumData = async () => {
      try {
        const response = await axios.get(`${VITE_API_URL}albums/${albumId}`);
        setAlbumData(response.data);
      } catch (error) {
        console.error('Error fetching album data:', error);
      }

    };

    fetchAlbumData();
  }, [albumId]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (!albumData) {
    return <Loading />;
  }


  const name = albumData.name;
  const numberOfSongs = albumData.songs.length;
  const numberOfWords = albumData.numWords;
  const wordsPerSong = (numberOfWords / numberOfSongs).toFixed(2);
  const vocabularySize = albumData.vocabSize;
  const readingLevel = albumData.readingLevel;
  const averageWordLength = (albumData.numChars / numberOfWords).toFixed(2);
  const sentiments = albumData.sentiments;
  const releaseDate = albumData.releaseDate; 
  
  let temp = 0;
  for (let key in albumData.collaborations) {
    if (albumData.collaborations.hasOwnProperty(key)) {
      temp += albumData.collaborations[key];
    }
  }
  const numCollaborations = temp;

  const words_obj = albumData.top25words;



  return (
    <>
      <NavBar title={name + " (Album)"} className="" />
      <div className="flex flex-col w-full xl:h-[calc(100vh-7rem)] sm:h-auto md:h-auto lg:h-full xl:min-h-xlminh xl:max-h-xlmaxh">
        <div className="order-1 grid grid-cols-24 grid-rows-12 gap-4 w-full h-full p-8 pt-4">
          <div className="col-span-24 row-span-4 md:col-span-12 lg:col-span-8 xl:col-span-6 xl:row-span-6">
            <div className="grid grid-cols-2 grid-flow-row gap-4 w-full h-full">
            <SmallCard number={readingLevel} label="Reading Level" icon={<FaBookReader />} showPlus={false} />
            <SmallCard number={numCollaborations} label="Collaborations" icon={<FaPeopleGroup/>} showPlus={false} />
            <SmallCard number={numberOfWords} label="Total Words" icon={<RiNumbersFill />} showPlus={false} />
            <SmallCard number={vocabularySize} label="Unique Words" icon={<FaBook />} showPlus={false} />
            </div>
          </div>
          <div className="order-2 row-span-4 col-span-24 md:col-span-12 lg:col-span-8 xl:col-span-6 xl:row-span-6">
            <GraphHolder title="Album Emotions" subtitle="Emotions" icon={<GoHeartFill />} chart={<SentimentsBubble values={sentiments} />} />
          </div>
          <div className="order-3 row-span-4 col-span-24 md:col-span-12 lg:col-span-8 xl:col-span-6 xl:row-span-6">
            <GraphHolder title="Top Words in Album" subtitle="Word Cloud" icon={<FaCloud />} chart={<WordCloud words_obj={words_obj} />} />
          </div>
          <div className="order-4 row-span-4 col-span-24 md:col-span-12 lg:col-span-8 xl:col-span-6 xl:row-span-6 sm:h-auto">
            <GraphHolder title="Hover To See Top Collaborations" subtitle="Interactive Collaborations Visualizer" icon={<FaPeopleGroup />}              chart={<D3Chart artistName={name} numSongs={numberOfSongs} collaborations={albumData.collaborations} />}/>
          </div>
          <div className="order-5 row-span-4 col-span-24 md:col-span-12 lg:col-span-8 xl:col-span-4 xl:row-span-6">
            <GraphHolder title="Album Sentiments" subtitle="Sentiments" icon={<FaSmile />} chart={<PieChart sentiments={sentiments} />} />
          </div>
          <div className="col-span-24 order-6 xl:order-7 row-span-4 md:col-span-12 lg:col-span-8 xl:col-span-6 xl:row-span-6">
            <div className="grid grid-cols-2 grid-flow-row gap-4 w-full h-full">
            <SmallCard number={numberOfSongs} label="Songs" icon={<FaMusic />} showPlus={false} />
            <SmallCard number={releaseDate} label="Release Year" icon={<BiSolidAlbum />} showPlus={false} />
            <SmallCard number={wordsPerSong} label="Words/Song" icon={<RiNumbersFill />} showPlus={false} />
            <SmallCard number={averageWordLength} label="Avg Word Size" icon={<FaRulerVertical />} showPlus={false} />
            </div>
          </div>
          {/* <div className="col-span-12 order-6 xl:order-7 row-span-4 md:col-span-6 lg:col-span-4 xl:row-span-6 xl:col-span-3">
            <div className="grid grid-cols-1 grid-flow-row gap-4 w-full h-full">

            </div>
          </div>
          <div className="col-span-12 order-7 xl:order-8 row-span-4 md:col-span-6 lg:col-span-4 xl:row-span-6 xl:col-span-3">
          <div className="grid grid-cols-1 grid-flow-row gap-4 w-full h-full">

          </div>
          </div> */}
          <div className="col-span-24 xl:order-6 order-8 row-span-4 md:col-span-24 lg:col-span-24 xl:col-span-14 xl:row-span-6">
            <SongCarousel songs={albumData.songsObj} targetSongId={songId}/>
          </div>
        </div>
      </div>
    </>
  );
};

export default AlbumLayout;
