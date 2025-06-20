import React, { useState } from 'react';
import axios from 'axios';
import Card from './components/Card';
import './styles/app.css';
import { BASE_URL } from './config';

const App = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [appid, setAppid] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [randomReview, setRandomReview] = useState(null);
  const [gameName, setGameName] = useState('');

  const handleSearch = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/search/${query}`);

      setResults(res.data);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  const fetchGameName = async (appid) => {
    try {
      const response = await axios.get(`${BASE_URL}/gameinfo/${appid}`);
      const appData = response.data[String(appid)];
      if (appData?.success && appData.data?.name) {
        return appData.data.name;
      }
      return "Unknown Game";
    } catch (err) {
      console.error("Game name fetch failed:", err);
      return "Unknown Game";
    }
  };

  const fetchReviews = async (appid, name) => {
    try {
      const res = await axios.get(`${BASE_URL}/reviews/${appid}?cursor=*&num=30`);
      const enrichedReviews = res.data.reviews.map((review) => ({
        ...review,
        gameName: name,
      }));
      setReviews(enrichedReviews);
      setRandomReview(getRandomReview(enrichedReviews));
    } catch (err) {
      console.error("Review fetch failed:", err);
    }
  };

  const getRandomReview = (arr) => {
    if (!arr.length) return null;
    return arr[Math.floor(Math.random() * arr.length)];
  };

  const handleSelectGame = async (game) => {
    setAppid(game.appid);
    setResults([]);
    const name = await fetchGameName(game.appid);
    setGameName(name);
    setQuery(name);
    fetchReviews(game.appid, name);
  };

  return (
  <div className="app-container">
    <h1 className="body">Steam Review Randomizer</h1>

    <div className="search-container">
      <div className="search-row">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a game..."
        />
        <button className="search-button" onClick={handleSearch}>Search</button>
      </div>

    {results.length > 0 && (
      <ul className="dropdown-results">
        {results.map((game) => (
          <li
            key={game.appid}
            className="dropdown-item"
            onClick={() => handleSelectGame(game)}
          >
            <span className="game-name">{game.name}</span>
          </li>
        ))}
      </ul>
    )}
    </div>

    {randomReview && (
      <Card
        gameName={randomReview.gameName}
        reviewText={randomReview.review}
        reviewer={randomReview.personaName}
        hoursPlayed={(randomReview.author.playtime_forever / 60).toFixed(1)}
        reactions={{
          thumbsUp: randomReview.votes_up,
          thumbsDown: randomReview.votes_down,
          funny: randomReview.votes_funny,
        }}
      />
    )}

    {reviews.length > 0 && (
      <button className="shuffle-button" onClick={() => setRandomReview(getRandomReview(reviews))}>
        Shuffle Review
      </button>
    )}
  </div>
  );
};

export default App;
