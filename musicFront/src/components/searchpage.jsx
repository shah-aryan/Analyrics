import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';

const SearchPage = () => {
  const [query, setQuery] = useState('');
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

  const handleSearch = debounce(() => {
    navigate('/layout');
  }, 300);

  return (
    <div ref={vantaRef} className="min-h-screen font-bold text-white flex flex-col items-center justify-center bg-base-100 p-8">
      <h1 className="text-10xl">Analyrics</h1>
      <h1 className="text-xl mb-4 font-light">Analyze Any Artist's Lyrics</h1>
      <div className="form-control w-full max-w-md mb-4 text-white text-center">
        <input
          type="text"
          placeholder="Enter Artist Name"
          className="input input-bordered w-full rounded-3xl mb-4 opacity-75 text-white"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>
    </div>
  );
};

export default SearchPage;
