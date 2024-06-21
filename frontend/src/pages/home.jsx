// src/pages/SearchPage.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSearch from '../hooks/useSearch';

const SearchPage = () => {
  const { query, setQuery, results } = useSearch();
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const navigate = useNavigate();
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);

  useEffect(() => {
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    const loadScriptsAndInitialize = async () => {
      try {
        if (!window.p5) {
          await loadScript('https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.min.js');
        }
        if (!window.VANTA) {
          await loadScript('https://cdnjs.cloudflare.com/ajax/libs/vanta/0.5.21/vanta.topology.min.js');
        }

        if (vantaRef.current && !vantaEffect.current) {
          vantaEffect.current = window.VANTA.TOPOLOGY({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0xA290FC,
            backgroundColor: 0x050505,
          });
        }
      } catch (error) {
        console.error('Error loading scripts:', error);
      }
    };

    loadScriptsAndInitialize();

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }

      const p5Script = document.querySelector('script[src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.min.js"]');
      const vantaScript = document.querySelector('script[src="https://cdnjs.cloudflare.com/ajax/libs/vanta/0.5.21/vanta.topology.min.js"]');
      if (p5Script) document.body.removeChild(p5Script);
      if (vantaScript) document.body.removeChild(vantaScript);
    };
  }, []);

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
    navigate(`/${type}/${id}`);
  };

  return (
    <div ref={vantaRef} className="min-h-screen font-bold text-white flex flex-col items-center justify-center bg-base-100 p-8">
      <h1 className="text-10xl">Analyrics</h1>
      <div className="form-control w-full max-w-md text-white text-center relative">
        <input
          type="text"
          placeholder="Search for artists, albums, or songs..."
          className="input input-bordered w-full rounded-3xl opacity-75 text-white"
          value={query}
          onChange={handleSearch}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 100)} // Delay to allow click event
          onKeyDown={handleKeyDown}
        />
        {isFocused && totalResults() > 0 && (
          <div className="absolute text-left top-full left-0 right-0 bg-black w-full rounded-3xl p-4 text-white opacity-50 font-normal max-h-80 overflow-auto">
            <ul>
              {results.artists.slice(0, 20).map((artist, index) => (
                <li
                  key={artist.artistId}
                  onMouseDown={() => handleItemClick('artist', artist.artistId)}
                  className={`cursor-pointer hover:bg-gray-700 p-2 rounded-md ${highlightedIndex === index ? 'bg-gray-700' : ''}`}
                >
                  {artist.name}
                </li>
              ))}
              {results.artists.length < 20 && results.albums.slice(0, 20 - results.artists.length).map((album, index) => (
                <li
                  key={album.albumId}
                  onMouseDown={() => handleItemClick('album', album.albumId)}
                  className={`cursor-pointer hover:bg-gray-700 p-2 rounded-md ${highlightedIndex === index + results.artists.length ? 'bg-gray-700' : ''}`}
                >
                  {album.name}
                </li>
              ))}
              {results.artists.length + results.albums.length < 20 && results.songs.slice(0, 20 - results.artists.length - results.albums.length).map((song, index) => (
                <li
                  key={song.songId}
                  onMouseDown={() => handleItemClick('album', `${song.albumId[0]}/${song.songId}`)}
                  className={`cursor-pointer hover:bg-gray-700 p-2 rounded-md ${highlightedIndex === index + results.artists.length + results.albums.length ? 'bg-gray-700' : ''}`}
                >
                  {song.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
