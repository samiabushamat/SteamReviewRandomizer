import React from 'react';
import '../styles/searchbar.css';

const SearchBar = ({ query, setQuery, handleSearch }) => {
  return (
    <div className="search-container">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a game..."
      />
      <button className="search-button" onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar;
