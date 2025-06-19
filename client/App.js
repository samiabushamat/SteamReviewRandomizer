import React, { useState } from 'react';
import SteamReviews from './src/SteamReviews';
import axios from 'axios';

function App() {
  const [appid, setAppid] = useState('');
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(
        `https://steamcommunity.com/actions/SearchApps/${query}`
      );

      if (response.data.length > 0) {
        setAppid(response.data[0].appid); // use first search result
        setError('');
      } else {
        setAppid('');
        setError('No game found.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to search for game.');
    }
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

      {appid && <SteamReviews appid={appid} />}
    </div>
  );
}

export default App;
