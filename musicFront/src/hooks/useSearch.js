// src/hooks/useSearch.js
import { useState, useEffect } from 'react';
import debounce from 'lodash.debounce';
import axios from 'axios';

const useSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ artists: [] });

  useEffect(() => {
    if (!query) {
      setResults({ artists: [] });
      return;
    }

    const fetchResults = async (searchQuery) => {
      try {
        const response = await axios.get(`http://localhost:5555/search?search=${searchQuery}`);
        const artists = response.data.artists;

        // Sort the artists so that those whose names start with the query come first
        const sortedArtists = artists.sort((a, b) => {
          const aStartsWith = a.name.toLowerCase().startsWith(searchQuery.toLowerCase());
          const bStartsWith = b.name.toLowerCase().startsWith(searchQuery.toLowerCase());

          if (aStartsWith && !bStartsWith) return -1;
          if (!aStartsWith && bStartsWith) return 1;
          return 0;
        });

        setResults({ artists: sortedArtists.slice(0, 6) });
      } catch (error) {
        console.error("Error fetching search results", error);
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
