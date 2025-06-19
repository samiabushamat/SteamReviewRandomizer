import React, { useState } from 'react';
import axios from 'axios';
import SteamReviews from './SteamReviews';

function App() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [appid, setAppid] = useState('');
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchResults([]);
    setAppid('');
    setError('');

    try {
      const response = await axios.get(`http://localhost:5000/search/${query}`);
      if (response.data.length > 0) {
        setSearchResults(response.data);
      } else {
        setError('No games found.');
      }
    } catch (err) {
      console.error(err);
      setError('Search failed. Try again.');
    }
  };

  const handleSelect = (selectedAppid) => {
    setAppid(selectedAppid);
    setSearchResults([]);
  };

  return (
    <div className="App">
      <h1>Steam Game Reviews</h1>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter game name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {searchResults.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {searchResults.map((game) => (
            <li key={game.appid}>
              <button onClick={() => handleSelect(game.appid)}>
                {game.name}
              </button>
            </li>
          ))}
        </ul>
      )}

      {appid && <SteamReviews appid={appid} />}
    </div>
  );
}

export default App;
