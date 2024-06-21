import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import SmallCard from '../components/smallcard.jsx';
import GraphHolder from '../components/graphholder.jsx';
import NavBar from '../components/navbar.jsx';
import D3Chart from '../graphs/collaborationsd3.jsx';
import WordCloud from '../graphs/wordcloud.jsx';
import SentimentsBubble from '../graphs/sentimentsbubble.jsx';
import Loading from './loading.jsx';

import { BiSolidAlbum } from "react-icons/bi";
import { FaMusic } from "react-icons/fa6";
import { FaCloud } from "react-icons/fa";
import { GoHeartFill } from "react-icons/go";
import { FaSmile } from "react-icons/fa";
import { FaBookReader } from "react-icons/fa";
import { FaBook } from "react-icons/fa";
import { RiNumbersFill } from "react-icons/ri";
import { FaRulerVertical } from "react-icons/fa";

const SongLayout = () => {
  const { i } = useParams();
  //convert to int
  const songId = parseInt(i);
  const [songData, setSongData] = useState(null);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const fetchSongData = async () => {
      try {
        const response = await axios.get(`http://localhost:5555/songs/${songId}`);
        setSongData(response.data);
      } catch (error) {
        console.error('Error fetching song data:', error);
      }
    };

    fetchSongData();
  }, [songId]);

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

  if (!songData) {
    return <Loading />;
  }

  const name = songData.name;
  const numberOfWords = songData.numWords;
  const vocabularySize = songData.numUniqueWords;
  const readingLevel = songData.readingLevel;
  const averageWordLength = (songData.numChars / numberOfWords).toFixed(2);
  const sentiments = songData.sentiments;

  let temp = 0;
  for (let key in songData.collaborations) {
    if (songData.collaborations.hasOwnProperty(key)) {
      temp += songData.collaborations[key];
    }
  }
  const numCollaborations = temp;

  const words_obj = songData.top25words;

  return (
    <>
      <p>Name: {name}</p>
      <p>Number of Words: {numberOfWords}</p>
      <p>Vocabulary Size: {vocabularySize}</p>
      <p>Reading Level: {readingLevel}</p>
      <p>Average Word Length: {averageWordLength}</p>
      <p>Number of Collaborations: {numCollaborations}</p>
      <p>Sentiments: {sentiments}</p>
    </>
  );
}

export default SongLayout;
