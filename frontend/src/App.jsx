import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import SearchPage from './pages/home.jsx';
import Layout from './pages/artist.jsx';
import AlbumLayout from './pages/album.jsx';
import SongLayout from './pages/song.jsx';
import NotFound from './pages/404.jsx';


const AppContent = () => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-base-100">
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/artist/:i" element={<Layout />} />
        <Route path="/album/:i/:song?" element={<AlbumLayout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  ); 
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
