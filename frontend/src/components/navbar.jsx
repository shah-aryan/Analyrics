// src/components/NavBar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiHome } from 'react-icons/hi';
import useSearch from '../hooks/useSearch';

const NavBar = ({ title }) => {
  const { query, setQuery, results, setPage } = useSearch();
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const navigate = useNavigate();

  const handleSearch = () => {
    console.log('Searching for:', query);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      setHighlightedIndex((prevIndex) => Math.min(prevIndex + 1, results.artists.length - 1));
    } else if (e.key === 'ArrowUp') {
      setHighlightedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      handleItemClick('artist', results.artists[highlightedIndex].i);
    }
  };

  const handleItemClick = (type, i) => {
    navigate(`/artist/${i}`);
  };

  return (
    <div className="w-full px-8 mt-8 relative">
      <div className="navbar bg-base-200 rounded-3xl p-4 flex items-center justify-between w-full">
        <div className="flex-none gap-2 flex items-center">
          <Link to="/" className="btn btn-ghost no-animation hover:text-accent">
            <HiHome size={24} className="hover:text-accent" />
          </Link>
        </div>
        <div className="flex-none flex items-center">
          <div className="form-control w-full max-w-md text-white text-center relative">
            <input
              type="text"
              placeholder="Search Another Artist"
              className="input input-bordered w-full rounded-3xl opacity-75 text-white"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 100)} // Delay to allow click event
              onKeyDown={handleKeyDown}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            {isFocused && results.artists.length > 0 && (
              <div className="absolute text-left top-full left-0 right-0 bg-black w-full rounded-3xl p-4 text-white opacity-50 font-normal">
                <ul>
                  {results.artists.map((artist, index) => (
                    <li
                      key={artist.i}
                      onMouseDown={() => handleItemClick('artist', artist.i)}
                      className={`cursor-pointer hover:bg-gray-700 p-2 rounded-md ${highlightedIndex === index ? 'bg-gray-700' : ''}`}
                    >
                      {artist.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <span className="text-2xl font-bold">{title}</span>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
