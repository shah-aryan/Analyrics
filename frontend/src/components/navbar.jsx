import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiHome } from 'react-icons/hi';
import useSearch from '../hooks/useSearch';
import { set } from 'mongoose';

const NavBar = ({ title }) => {
  const { query, setQuery, results } = useSearch();
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      setHighlightedIndex((prevIndex) => Math.min(prevIndex + 1, totalResults() - 1));
    } else if (e.key === 'ArrowUp') {
      setHighlightedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      const { type, id } = getItemTypeAndId(highlightedIndex);
      handleItemClick(type, id);
    }
  };

  const totalResults = () => {
    return results.artists.length + results.albums.length + results.songs.length;
  };

  const getItemTypeAndId = (index) => {
    if (index < results.artists.length) {
      return { type: 'artist', id: results.artists[index].artistId };
    } else if (index < results.artists.length + results.albums.length) {
      const albumIndex = index - results.artists.length;
      return { type: 'album', id: results.albums[albumIndex].albumId };
    } else {
      const songIndex = index - results.artists.length - results.albums.length;
      return { type: 'album', id: `${results.songs[songIndex].albumId[0]}/${results.songs[songIndex].songId}` };
    }
  };

  const handleItemClick = (type, id) => {
    //navigate to loading page for a second and then go there
    navigate('/loading');
    setTimeout(() => navigate(`/${type}/${id}`), 50);
    // navigate(`/${type}/${id}`);
  };

  return (
    <div className="w-full px-8 mt-8 relative">
      <div className="navbar bg-base-200 rounded-3xl p-4 flex flex-col md:flex-row items-center justify-between w-full">
        <div className="w-full flex justify-between items-center md:w-auto md:flex-none gap-2 relative">
          <Link to="/" className="btn btn-ghost no-animation hover:text-accent">
            <HiHome size={24} className="hover:text-accent" />
          </Link>
          <div className="absolute inset-0 flex justify-center items-center md:hidden">
            <span className="text-2xl font-bold text-center truncate max-w-full">{title}</span>
          </div>
        </div>
        <div className="w-full md:w-1/3 md:max-w-96 flex items-center mt-4 md:mt-0">
          <div className="form-control w-full text-white text-center relative">
            <input
              type="text"
              placeholder="Search for Artists, Albums, or Songs..."
              className="input input-bordered w-full rounded-3xl opacity-75 text-white"
              value={query}
              onChange={handleSearch}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 100)} // Delay to allow click event
              onKeyDown={handleKeyDown}
            />
            {isFocused && totalResults() > 0 && (
              <div className="absolute z-50 text-left top-full left-0 right-0 bg-black backdrop-blur-2xl w-full rounded-3xl p-4 text-white font-normal opacity-80">
                <ul>
                  {results.artists.slice(0, 20).map((artist, index) => (
                    <li
                      key={artist.artistId}
                      onMouseDown={() => handleItemClick('artist', artist.artistId)}
                      className={`cursor-pointer hover:bg-gray-700 p-2 rounded-md ${highlightedIndex === index ? 'bg-gray-700' : ''}`}
                    >
                      {"Artist: " + artist.name}
                    </li>
                  ))}
                  {results.artists.length < 20 && results.albums.slice(0, 20 - results.artists.length).map((album, index) => (
                    <li
                      key={album.albumId}
                      onMouseDown={() => handleItemClick('album', album.albumId)}
                      className={`cursor-pointer hover:bg-gray-700 p-2 rounded-md ${highlightedIndex === index + results.artists.length ? 'bg-gray-700' : ''}`}
                    >
                      {"Album: " + album.name}
                    </li>
                  ))}
                  {results.artists.length + results.albums.length < 20 && results.songs.slice(0, 20 - results.artists.length - results.albums.length).map((song, index) => (
                    <li
                      key={song.songId}
                      onMouseDown={() => handleItemClick('album', `${song.albumId[0]}/${song.songId}`)}
                      className={`cursor-pointer hover:bg-gray-700 p-2 rounded-md ${highlightedIndex === index + results.artists.length + results.albums.length ? 'bg-gray-700' : ''}`}
                    >
                      {"Song: " + song.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:block">
          <span className="text-2xl font-bold">{title}</span>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
