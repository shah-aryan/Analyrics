import React, { useState, useRef, useEffect } from 'react';
import SongCard from './songcard.jsx'; // Assuming you have a SongCard component

const SongCarousel = ({ songs, targetSongId }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showButtons, setShowButtons] = useState(true);
  const carouselRef = useRef(null);
  const timeoutRef = useRef(null);

  //sort songs object by numInAlbum
  songs.sort((a, b) => {
    if (a.numInAlbum && b.numInAlbum) {
      return a.numInAlbum - b.numInAlbum;
    } else if (a.numInAlbum) {
      return -1;
    } else if (b.numInAlbum) {
      return 1;
    } else {
      return 0;
    }
  });

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.children[0].offsetWidth + 16;
      carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, songs.length - 1));
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.children[0].offsetWidth + 16;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleMouseMove = () => {
    setShowButtons(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setShowButtons(false);
    }, 800); // Hide buttons after 2 seconds of no mouse movement
  };

  useEffect(() => {
    const carouselElement = carouselRef.current;
    if (carouselElement) {
      carouselElement.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      if (carouselElement) {
        carouselElement.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setShowButtons(false);
    }, 800); // Initially hide buttons after 2 seconds
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (targetSongId && carouselRef.current) {
      const targetIndex = songs.findIndex(song => song.songId === targetSongId);
      if (targetIndex !== -1) {
        setCurrentIndex(targetIndex);
        const scrollAmount = carouselRef.current.children[0].offsetWidth + 16;
        carouselRef.current.scrollTo({ left: targetIndex * scrollAmount, behavior: 'smooth' });
      }
    }
  }, [targetSongId, songs]);

  return (
    <div className="relative w-full h-full">
      <div ref={carouselRef} className="carousel carousel-start space-x-4 bg-base-100 rounded-3xl h-full w-full overflow-x-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-track-neutral-content scrollbar-thumb-slate-300">
        {songs.map((song, index) => (
          <div key={index} className="carousel-item flex items-center justify-center bg-base-200 rounded-3xl sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/4 outline outline-1 outline-base-300 overflow-y-hidden">
            <SongCard song={song} />
          </div>
        ))}
      </div>
      <div className={`absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2 transition-opacity duration-500 ${showButtons ? 'opacity-100' : 'opacity-0'}`}>
        <button onClick={handlePrev} className="btn btn-circle outline outline-1 outline-base-300">❮</button>
        <button onClick={handleNext} className="btn btn-circle outline outline-1 outline-base-300">❯</button>
      </div>
    </div>
  );
};

export default SongCarousel;
