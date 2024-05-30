import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiHome } from 'react-icons/hi';

const NavBar = ({ title }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    console.log('Searching for:', query);
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
          <div className="form-control w-full max-w-md text-white text-center">
            <input
              type="text"
              placeholder="Search Another Artist"
              className="input input-bordered w-full rounded-3xl opacity-75 text-white"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
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
