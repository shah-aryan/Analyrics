import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import NavBar from './components/navbar.jsx';
import SearchPage from './components/searchpage.jsx';
import Layout from './components/layout.jsx';

const AppContent = () => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-base-100">
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/layout" element={<Layout />} />
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





// import './App.css';
// import Layout from './components/layout.jsx';

//   export default function App() {
//     return (
//       <div className="bg-base-100 min-h-screen" data-theme="mytheme">
//         <Layout />
//       </div>
//     );
//   }
