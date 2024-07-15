// ScrollToTopButton.js
import React from 'react';
import { FaArrowUp } from "react-icons/fa";

const ScrollToTopButton = () => {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={handleScrollToTop}
      className="btn btn-circle border-1 border-accent bg-black text-accent hover:bg-accent hover:text-black hover:border-black"
      aria-label="Scroll to top"
    >
      <FaArrowUp className="h-4 w-4" />
    </button>
  );
};

export default ScrollToTopButton;
