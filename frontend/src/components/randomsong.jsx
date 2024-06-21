import React, { useState } from 'react';
import axios from 'axios';

const RandomSong = ({ albums }) => {
  const [songDetails, setSongDetails] = useState(null);

  const getRandomSong = async () => {
    const randomAlbumIndex = Math.floor(Math.random() * albums.length);
    const randomAlbum = albums[randomAlbumIndex];
    const randomSongIndex = Math.floor(Math.random() * randomAlbum.songs.length);
    const randomSong = randomAlbum.songs[randomSongIndex];

    try {
      const response = await axios.get(`http://localhost:5555/songs/${randomSong.id}`);
      setSongDetails(response.data);
    } catch (error) {
      console.error('Error fetching song details:', error);
    }
  };

  return (
    <div className="random-song">
      <button onClick={getRandomSong} className="random-song-button">
        Get Random Song
      </button>
      {songDetails && (
        <div className="song-details">
          <h3>{songDetails.title}</h3>
          <p>{songDetails.artist}</p>
          <p>{songDetails.album}</p>
          <p>{songDetails.releaseDate}</p>
          <p>{songDetails.genre}</p>
        </div>
      )}
    </div>
  );
};

export default RandomSong;
 