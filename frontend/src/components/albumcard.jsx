import React from 'react';
import { BiSolidAlbum } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';

const AlbumCard = ({ album }) => {
  const navigate = useNavigate();
  const numCollaborations = Object.keys(album.collaborations).length;
  const year = new Date(album.releaseDate).getFullYear();
  const nam = album.name;
  const id = album.albumId;

  let sentiments = album.sentiments;

  //nltk 10 emotions
  const emotions = ['fear', 'anger', 'anticipation', 'trust', 'surprise', 'sadness', 'disgust', 'joy']

  //remove indices 5 and 6 from sentiments and emotions

  const positive = sentiments[5];
  const negative = sentiments[6];
  const positivepercent =((positive / (positive + negative)) * 100).toFixed(2);

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

  topEmotion = topEmotion.charAt(0).toUpperCase() + topEmotion.slice(1);

  const handleTitleClick = () => {
    navigate(`/album/${id}`);
  };

  return (
    <div className="bg-base-200 rounded-3xl outline outline-1 outline-base-300 h-full w-full p-4 flex flex-col">
      <div className="flex flex-col items-center text-center text-l text-info pt-4 h-24" style={{ minHeight: '4em', justifyContent: 'center' }}>
        <div className="flex items-center text-accent">
          <BiSolidAlbum />
          <span className="ml-2 text-info">Album {album.numberInDiscography} ({year})</span>
        </div>
        <div className="text-xl mt-2">
          <span
            onClick={handleTitleClick}
            className="block truncate text-white h-16 cursor-pointer hover:underline hover:text-accent"
            style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', whiteSpace: 'normal' }}
          >
            {nam}
          </span>
        </div>
      </div>
      <div className="flex justify-between mt-8">
        <span className="text-info">Songs</span>
        <span className="text-white">{album.songs.length}</span>
      </div>
      <hr className="border-t-1 border-neutral-content m-3" />
      <div className="flex justify-between">
        <span className="text-info">Top Emotion</span>
        <span className="text-white">{topEmotion}</span>
      </div>
      <hr className="border-t-1 border-neutral-content m-3" />
      <div className="flex justify-between">
        <span className="text-info">% Positive</span>
        <span className="text-white">{positivepercent}</span>
      </div>
      <hr className="border-t-1 border-neutral-content m-3" />
      <div className="flex justify-between">
        <span className="text-info">Collaborators</span>
        <span className="text-white">{numCollaborations}</span>
      </div>
      <hr className="border-t-1 border-neutral-content m-3" />
      <div className="flex justify-between">
        <span className="text-info">Reading Level</span>
        <span className="text-white">{album.readingLevel.toFixed(2)}</span>
      </div>
    </div>
  );
}

export default AlbumCard;
