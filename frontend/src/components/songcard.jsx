import React from 'react';
import { FaMusic } from "react-icons/fa6";


const SongCard = ({ song, isTarget }) => {

  const year = new Date(song.releaseDate).getFullYear();
  const name = song.name;
  const id = song.songId;
  let sentiments = song.sentiments;

  const emotions = ['fear', 'anger', 'anticipation', 'trust', 'surprise', 'sadness', 'disgust', 'joy'];

  const positive = sentiments[5];
  const negative = sentiments[6];
  const positivepercent = ((positive / (positive + negative)) * 100).toFixed(2);

  const toSkip = [5, 6];

  let topEmotion = 'a';
  let topEmotionValue = -1;
  for (let i = 0; i < emotions.length; i++) {
    if (!toSkip.includes(i)) {
      if (sentiments[i] > topEmotionValue) {
        topEmotion = emotions[i];
        topEmotionValue = sentiments[i];
      }
    }
  }

  const repetivenessScore = song.numWords / song.numUniqueWords;

  let wordsCounter = song.top25words;
  //find topWord - top25words are an array of arrays with first entry of each small array string and second as number
  let topWord = wordsCounter[0][0];
  //capitalize first letter
  topWord = topWord.charAt(0).toUpperCase() + topWord.slice(1);
  


  topEmotion = topEmotion.charAt(0).toUpperCase() + topEmotion.slice(1);

  return (
    <div className={`bg-base-200 rounded-3xl outline outline-1 ${isTarget ? 'outline-accent' : 'outline-base-300'} h-full w-full p-4 flex flex-col`}>
      <div className="flex flex-col items-center text-center text-l text-info pt-4 h-24" style={{ minHeight: '4em', justifyContent: 'center' }}>
        <div className="flex items-center text-accent">
          <FaMusic />
          <span className="ml-2 text-info">Song</span>
        </div>
        <div className="text-xl mt-2">
          <span
            className="block truncate text-white h-16"
            style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', whiteSpace: 'normal' }}
          >
            {name}
          </span>
        </div>
      </div>
      <div className="flex justify-between mt-8">
        <span className="text-info">Top Emotion</span>
        <span className="text-white">{topEmotion}</span>
      </div>
      <hr className="border-t-1 border-neutral-content m-3" />
      <div className="flex justify-between">
        <span className="text-info">Reading Level</span>
        <span className="text-white">{song.readingLevel.toFixed(2)}</span>
      </div>
      <hr className="border-t-1 border-neutral-content m-3" />
      <div className="flex justify-between">
        <span className="text-info">Repetiveness</span>
        <span className="text-white">{repetivenessScore.toFixed(2)}</span>
      </div>
      <hr className="border-t-1 border-neutral-content m-3" />
      <div className="flex justify-between">
        <span className="text-info">Top Word</span>
        <span className="text-white">{topWord}</span>
      </div>
      <hr className="border-t-1 border-neutral-content m-3" />
      <div className="flex justify-between">
        <span className="text-info">% Positive</span>
        <span className="text-white">{positivepercent}</span>
      </div>
    </div>
  );
}

export default SongCard;
