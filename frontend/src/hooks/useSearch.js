// src/hooks/useSearch.js
import { useState, useEffect } from 'react';
import debounce from 'lodash.debounce';
import axios from 'axios';

const useSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ artists: [], albums: [], songs: [] });

  useEffect(() => {
    if (!query) {
      setResults({ artists: [], albums: [], songs: [] });
      return;
    }

    const fetchResults = async (searchQuery) => {
      try {
        const response = await axios.get(`http://localhost:5555/search?search=${searchQuery}`);
        const { artists, albums, songs } = response.data;

        const sortedArtists = artists.sort((a, b) => {
          const aStartsWith = a.name.toLowerCase().startsWith(searchQuery.toLowerCase());
          const bStartsWith = b.name.toLowerCase().startsWith(searchQuery.toLowerCase());

          if (aStartsWith && !bStartsWith) return -1;
          if (!aStartsWith && bStartsWith) return 1;
          return 0;
        });

        const sortedAlbums = albums.sort((a, b) => {
          const aStartsWith = a.name.toLowerCase().startsWith(searchQuery.toLowerCase());
          const bStartsWith = b.name.toLowerCase().startsWith(searchQuery.toLowerCase());

          if (aStartsWith && !bStartsWith) return -1;
          if (!aStartsWith && bStartsWith) return 1;
          return 0;
        });

        const sortedSongs = songs.sort((a, b) => {
          const aStartsWith = a.name.toLowerCase().startsWith(searchQuery.toLowerCase());
          const bStartsWith = b.name.toLowerCase().startsWith(searchQuery.toLowerCase());

          if (aStartsWith && !bStartsWith) return -1;
          if (!aStartsWith && bStartsWith) return 1;
          return 0;
        });

        setResults({
          artists: sortedArtists,
          albums: sortedAlbums,
          songs: sortedSongs,
        });
      } catch (error) {
        console.error('Error fetching search results', error);
      }
    };

    const debouncedFetchResults = debounce(fetchResults, 300);
    debouncedFetchResults(query);

    return () => {
      debouncedFetchResults.cancel();
    };
  }, [query]);

  return {
    query,
    setQuery,
    results,
  };
};

export default useSearch;
