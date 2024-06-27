import React, { useState, useRef, useEffect } from 'react';
import AlbumCard from './albumcard.jsx';

const Carousel = ({ albums }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showButtons, setShowButtons] = useState(true);
  const carouselRef = useRef(null);
  const timeoutRef = useRef(null);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.children[0].offsetWidth + 16;
      carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, albums.length - 1));
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

  return (
    <div className="relative w-full h-full">
      <div ref={carouselRef} className="carousel carousel-start space-x-4 bg-base-100 rounded-3xl h-full w-full overflow-x-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-track-neutral-content scrollbar-thumb-slate-300" >
        {albums.map((album, index) => (
          <div key={index} className="carousel-item flex items-center justify-center bg-base-200 rounded-3xl w-2/3 xs:w-3/4 sm:w-1/2 md:w-1/4 lg:w-1/5 xl:w-1/4 outline outline-1 outline-base-300 overflow-y-hidden">
            <AlbumCard album={album} />
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

export default Carousel;





