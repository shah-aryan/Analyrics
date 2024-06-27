import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import SmallCard from '../components/smallcard.jsx';
import GraphHolder from '../components/graphholder.jsx';
import NavBar from '../components/navbar.jsx';
import D3Chart from '../graphs/collaborationsd3.jsx';
import WordCloud from '../graphs/wordcloud.jsx';
import SentimentsBubble from '../graphs/sentimentsbubble.jsx';
import Carousel from '../components/albumcarousel.jsx';
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


const Layout = () => {
  const { i } = useParams(); // Get the artist ID from the URL
  const [artistData, setArtistData] = useState(null);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        const response = await axios.get(`${VITE_API_URL}artists/${i}`);
        setArtistData(response.data);
      } catch (error) {
        console.error('Error fetching artist data:', error);
      }
    };

    fetchArtistData();
  }, [i]);

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

  if (!artistData) {
    return <Loading />;
  }
  

  const numAlbums = artistData.albums.length;
  let temp = 0;

  for (let i = 0; i < artistData.albums.length; i++) {
    temp += artistData.albums[i].songs.length;
  }
  const name = artistData.name;
  const numberOfSongs = temp;
  const numberOfWords = artistData.numWords;
  const wordsPerSong = (numberOfWords / numberOfSongs).toFixed(2);
  const vocabularySize = artistData.vocabSize;
  const readingLevel = artistData.readingLevel;
  const averageWordLength = (artistData.numChars / numberOfWords).toFixed(2);
  const sentiments = artistData.sentiments;

  temp = 0
  // Iterate through collaborations dictionary/object and count integer values 
  for (let key in artistData.collaborations) {
    if (artistData.collaborations.hasOwnProperty(key)) {
      temp += artistData.collaborations[key];
    }
  }
  const numCollaborations = temp;

  const words_obj = artistData.top25words;

  return (
    <>
      <NavBar title={name} className="" />
      <div className="flex flex-col w-full xl:h-[calc(100vh-7rem)] sm:h-auto md:h-auto lg:h-full xl:min-h-xlminh xl:max-h-xlmaxh">
        <div className="order-1 grid grid-cols-24 grid-rows-12 gap-4 w-full h-full p-8 pt-4">
          <div className="col-span-24 row-span-4 md:col-span-12 lg:col-span-8 xl:col-span-6 xl:row-span-6">
            <div className="grid grid-cols-2 grid-flow-row gap-4 w-full h-full">
            <SmallCard number={readingLevel} label="Reading Level" icon={<FaBookReader />} showPlus={false} />
            <SmallCard number={numCollaborations} label="Collaborations" icon={<FaPeopleGroup/>} showPlus={false} />
            <SmallCard number={numberOfWords} label="Total Words" icon={<RiNumbersFill />} showPlus={false} />
            <SmallCard number={vocabularySize} label="Vocab Size" icon={<FaBook />} showPlus={false} />
            </div>
          </div>
          <div className="order-2 row-span-4 col-span-24 md:col-span-12 lg:col-span-8 xl:col-span-6 xl:row-span-6">
            <GraphHolder title="Artist Emotions" subtitle="Emotions" icon={<GoHeartFill />} chart={<SentimentsBubble values={sentiments} />} />
          </div>
          <div className="order-3 row-span-4 col-span-24 md:col-span-12 lg:col-span-8 xl:col-span-6 xl:row-span-6 sm:h-auto">
            <GraphHolder title="Hover To See Collaborations" subtitle="Interactive Collaborations Visualizer" icon={<FaPeopleGroup />} chart={<D3Chart artistName={name} numSongs={numberOfSongs} collaborations={artistData.collaborations} />} />
          </div>
          <div className="order-4 row-span-4 col-span-24 md:col-span-12 lg:col-span-10 xl:col-span-6 xl:row-span-6">
            <GraphHolder title="Top Words in Discography" subtitle="Word Cloud" icon={<FaCloud />} chart={<WordCloud words_obj={words_obj} />} />
          </div>
          <div className="order-5 row-span-4 col-span-24 md:col-span-12 lg:col-span-6 xl:col-span-4 xl:row-span-6">
            <GraphHolder title="Artist Sentiments" subtitle="Sentiments" icon={<FaSmile />} chart={<PieChart sentiments={sentiments} />} />
          </div>
          <div className="col-span-12 order-6 xl:order-7 row-span-4 md:col-span-6 lg:col-span-4 xl:row-span-6 xl:col-span-3">
            <div className="grid grid-cols-1 grid-flow-row gap-4 w-full h-full">
              <SmallCard number={numAlbums} label="Albums" icon={<BiSolidAlbum />} showPlus={false} />
              <SmallCard number={numberOfSongs} label="Songs" icon={<FaMusic />} showPlus={false} />
            </div>
          </div>
          <div className="col-span-12 order-7 xl:order-8 row-span-4 md:col-span-6 lg:col-span-4 xl:row-span-6 xl:col-span-3">
          <div className="grid grid-cols-1 grid-flow-row gap-4 w-full h-full">
            <SmallCard number={wordsPerSong} label="Words/Song" icon={<RiNumbersFill />} showPlus={false} />
            <SmallCard number={averageWordLength} label="Avg Word Size" icon={<FaRulerVertical />} showPlus={false} />
          </div>
          </div>
          <div className="col-span-24 xl:order-6 order-8 row-span-4 md:col-span-24 lg:col-span-24 xl:col-span-14 xl:row-span-6">
            <Carousel albums={artistData.albums} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
