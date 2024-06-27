import { useEffect } from 'react';

const useZoomOutOnXs = () => {
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 350) {
        document.documentElement.style.transform = 'scale(0.7)'; // Scale down to 70%
        document.documentElement.style.transformOrigin = 'top left'; // Ensure scaling starts from the top-left corner
        document.documentElement.style.width = '142.86%'; // Compensate for the scale
      } else if (window.innerWidth <= 400) {
        document.documentElement.style.transform = 'scale(0.8)'; // Scale down to 80%
        document.documentElement.style.transformOrigin = 'top left'; // Ensure scaling starts from the top-left corner
        document.documentElement.style.width = '125%'; // Compensate for the scale
      } else if (window.innerWidth <= 430) {
        document.documentElement.style.transform = 'scale(0.9)'; // Scale down to 90%
        document.documentElement.style.transformOrigin = 'top left'; // Ensure scaling starts from the top-left corner
        document.documentElement.style.width = '111.11%'; // Compensate for the scale
      } else {
        document.documentElement.style.transform = 'scale(1)'; // Default scale
        document.documentElement.style.width = '100%'; // Reset width
      }
    };

    // Add event listener on mount
    window.addEventListener('resize', handleResize);
    // Run once to set the initial zoom level
    handleResize();

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
};

export default useZoomOutOnXs;
