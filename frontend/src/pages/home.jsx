import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import useSearch from '../hooks/useSearch';
import CircleButton from '../components/circlebutton';
import AboutMeModal from '../components/aboutme';
import TopFiveCard from '../components/top5card';
import 'aos/dist/aos.css';
import AOS from 'aos';
import rankings from '../cache/rankings.json';
import ScrollToTopButton from '../components/scrolltotop'; 
import { popularArtists } from '../cache/popularArtists';

const SearchPage = () => {
  const { query, setQuery, results } = useSearch();
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showNotFound, setShowNotFound] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false); 
  const navigate = useNavigate();
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 500);

  const totalResults = () => {
    return results.artists.length + results.albums.length + results.songs.length;
  };

  useEffect(() => {
    AOS.init({ duration: 2000 });

    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 500);
    };

    window.addEventListener('resize', handleResize);

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
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    let timer;
    if (query && totalResults() === 0) {
      timer = setTimeout(() => setShowNotFound(true), 1000);
    } else {
      setShowNotFound(false);
    }
    return () => clearTimeout(timer);
  }, [query, totalResults]);

  useEffect(() => {
    const timer = setTimeout(() => setShowScrollDown(true), 1);
    return () => clearTimeout(timer);
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

  const handleOpenModal = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="h-auto flex flex-col">
      <div className='h-screen'>
        <div ref={vantaRef} className="h-full font-bold text-white flex flex-col items-center justify-center bg-base-100 p-8" data-aos="fade-up">
          <AboutMeModal isOpen={isModalOpen} onClose={handleCloseModal} />
          <h1 className="md:text-10xl sm:text-8xl text-6xl">Analyrics</h1>
          <h2 className="text-xs sm:text-sm md:text-md font-bold text-center mb-5 sm:tracking-wide text-white">Intelligent, Beautiful, and Unique Lyrics Analysis</h2>
          <div className="form-control w-full max-w-md text-gray text-center relative mb-4 ">
            <input
              type="text"
              placeholder="Search for artists, albums, or songs..."
              className="input input-bordered border-2 w-full rounded-3xl opacity-100 text-white"
              value={query}
              onChange={handleSearch}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 100)}  
              onKeyDown={handleKeyDown}
            />
            {isFocused && query && (
              <div className="absolute text-left top-full left-0 right-0 bg-black w-full rounded-3xl p-4 text-white opacity-75 font-normal max-h-80 overflow-auto ">
                {totalResults() > 0 ? (
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
                ) : (
                  showNotFound && (
                    <div className=" p-4">
                      We don't have this in our database yet!<br />
                      If you've spelled it correctly and would like to see it added, <br />
                      Please send a request at <a href="mailto:analyrics.contact@gmail.com" className="text-accent underline">analyrics.contact@gmail.com</a>, and<br />
                      Please support the project's growth at <a href="https://www.buymeacoffee.com/shahary" target="_blank" rel="noopener noreferrer" className="text-accent underline">buymeacoffee.com/shahary</a> <br />
                      so we can continue adding more music!
                    </div>
                  )
                )}
              </div>
            )}
          </div>
          <div className="flex flex-col items-center justify-center mb-16">
          </div>
          {showScrollDown && (
            <div className={`absolute ${isSmallScreen ? 'bottom-24' : 'bottom-16'} font-medium flex items-center justify-center space-x-2`}>
              <div className="animate-bounce">
                <svg className="w-4 h-4 text-info mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
              <p className="text-info tracking-wide text-sm font-bold">Scroll for leaderboards</p>
              <div className="animate-bounce">
                <svg className="w-4 h-4 text-info mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="w-full flex flex-col justify-center items-center mt-24" data-aos="fade-up">
        <h1 className="text-5xl font-bold text-center mx-8">
          The <span className="text-accent">Analyrics</span> Leaderboards
        </h1>
        <h3 className="text-xl font-normal text-center mt-1 mb-8 tracking-wide mx-8">
          Click on an artist's name to learn more about them, <br/> or hover over the info icon for calculation details!
        </h3>
      </div>
      <div className="container mx-auto p-4 w-full">
        <Routes>
          <Route path="/" element={
            <div className="flex flex-wrap w-full items-center justify-center">
              <div className="w-full md:w-2/5 lg:w-1/4 xl:w-1/5 px-2 m-4" data-aos="fade-up">
                <TopFiveCard items={rankings.largest_vocabulary} rankings title="Largest Vocabulary" label=" words" info='Number of Unique Words in discography'/>
              </div>
              <div className="w-full md:w-2/5 lg:w-1/4 xl:w-1/5 px-2 m-4" data-aos="fade-up">
                <TopFiveCard items={rankings.most_repetitive} rankings title="Most Repetitive" shownum={false} info='A ratio of number of unique words to number of total words'/>
              </div>
              <div className="w-full md:w-2/5 lg:w-1/4 xl:w-1/5 px-2 m-4" data-aos="fade-up">
                <TopFiveCard items={rankings.most_collaborative} rankings title="Most Collaborative" label=" collabs" info="Total number of collaborations in this artist's discography"/>
              </div>
              <div className="w-full md:w-2/5 lg:w-1/4 xl:w-1/5 px-2 m-4" data-aos="fade-up">
                <TopFiveCard items={rankings.highest_reading_level} rankings title="Highest Reading Level" info='Reading level calculated using Dale-Chall readability formula - the best formula for lyrics observed through testing'/>
              </div>
              <div className="w-full md:w-2/5 lg:w-1/4 xl:w-1/5 px-2 m-4" data-aos="fade-up">
                <TopFiveCard items={rankings.longest_songs} rankings title="Longest Songs" label=" words" info='Average number of words per song'/>
              </div>
              <div className="w-full md:w-2/5 lg:w-1/4 xl:w-1/5 px-2 m-4" data-aos="fade-up">
                <TopFiveCard items={rankings.most_positive_lyrics} rankings title="Most Positive Lyrics" label=" %" info='A ratio of positive lyrics over both positive and negative lyrics'/>
              </div>
              <div className="w-full md:w-2/5 lg:w-1/4 xl:w-1/5 px-2 m-4" data-aos="fade-up">
                <TopFiveCard items={rankings.most_negative_lyrics} rankings title="Most Negative Lyrics" label=" %" info='A ratio of negative lyrics over both positive and negative lyrics'/>
              </div>
              <div className="w-full md:w-2/5 lg:w-1/4 xl:w-1/5 px-2 m-4" data-aos="fade-up">
                <TopFiveCard items={rankings.most_trusting_lyrics} rankings title="Most Trusting Lyrics" label=" %" info='A ratio of trusting lyrics over total lyrics'/>
              </div>
              <div className="w-full md:w-2/5 lg:w-1/4 xl:w-1/5 px-2 m-4" data-aos="fade-up">
                <TopFiveCard items={rankings.most_fearful_lyrics} rankings title="Most Fearful Lyrics" label=" %" info='A ratio of fearful lyrics over total lyrics'/>
              </div>
              <div className="w-full md:w-2/5 lg:w-1/4 xl:w-1/5 px-2 m-4" data-aos="fade-up">
                <TopFiveCard items={rankings.most_surprise_in_lyrics} rankings title="Most Surprise in Lyrics" label=" %" info='A ratio of surprise lyrics over total lyrics'/>
              </div>
              <div className="w-full md:w-2/5 lg:w-1/4 xl:w-1/5 px-2 m-4" data-aos="fade-up">
                <TopFiveCard items={rankings.most_joyous_lyrics} rankings title="Most Joyous Lyrics" label=" %" info='A ratio of joyous lyrics over total lyrics'/>
              </div>
              <div className="w-full md:w-2/5 lg:w-1/4 xl:w-1/5 px-2 m-4" data-aos="fade-up">
                <TopFiveCard items={rankings.most_anticipation_in_lyrics} rankings title="Most Anticipation in Lyrics" label=" %" info='A ratio of anticipation lyrics over total lyrics'/>
              </div>
              <div className="w-full md:w-2/5 lg:w-1/4 xl:w-1/5 px-2 m-4" data-aos="fade-up">
                <TopFiveCard items={rankings.most_anger_in_lyrics} rankings title="Most Anger in Lyrics" label=" %" info='A ratio of anger lyrics over total lyrics'/>
              </div>
              <div className="w-full md:w-2/5 lg:w-1/4 xl:w-1/5 px-2 m-4" data-aos="fade-up">
                <TopFiveCard items={rankings.most_sad_lyrics} rankings title="Most Sad Lyrics" label=" %" info='A ratio of sad lyrics over total lyrics'/>
              </div>
              <div className="w-full md:w-2/5 lg:w-1/4 xl:w-1/5 px-2 m-4" data-aos="fade-up">
                <TopFiveCard items={rankings.most_disgust_in_lyrics} rankings title="Most Disgust in Lyrics" label=" %" info='A ratio of disgust lyrics over total lyrics'/>
              </div>
              <div className='flex flex-row justify-center items-center w-full mt-4 mb-8'>
                <ScrollToTopButton />
              </div>

            </div>
          } />
          <Route path="/song/:id" element={<div>Song ID: {window.location.pathname.split('/').pop()}</div>} />
          <Route path="/album/:id" element={<div>Album ID: {window.location.pathname.split('/').pop()}</div>} />
          <Route path="/artist/:id" element={<div>Artist ID: {window.location.pathname.split('/').pop()}</div>} />
        </Routes>
      </div>
      <div className={`fixed bottom-8 right-8`}>
        <CircleButton onClick={handleOpenModal} />
      </div>
    </div>
  );
};

export default SearchPage;
