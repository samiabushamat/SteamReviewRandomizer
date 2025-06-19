import React, { useState } from 'react';
import axios from 'axios';
import Card from './components/Card';
import './styles/app.css';

const App = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [appid, setAppid] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [randomReview, setRandomReview] = useState(null);
  const [gameName, setGameName] = useState('');

  const handleSearch = async () => {
    try {
      const res = await axios.get(`https://steamreviewrandomizer.onrender.com/search/${query}`);
      setResults(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchReviews = async (appid, name) => {
    try {
      const res = await axios.get(`https://steamreviewrandomizer.onrender.com/reviews/${appid}?cursor=*&num=30`);
      const enrichedReviews = res.data.reviews.map((review) => ({
        ...review,
        gameName: name,
      }));
      setReviews(enrichedReviews);
      setRandomReview(getRandomReview(enrichedReviews));
    } catch (err) {
      console.error(err);
    }
  };

  const getRandomReview = (arr) => {
    if (!arr.length) return null;
    return arr[Math.floor(Math.random() * arr.length)];
  };

  const handleSelectGame = async (game) => {
    setAppid(game.appid);
    setResults([]);

    const name = await fetchGameName(game.appid); // ✅ get actual name
    setGameName(name);                             // ✅ set game name
    fetchReviews(game.appid, name);                // ✅ pass name to reviews
  };

  const fetchGameName = async (appid) => {
    try {
      const response = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${appid}`);
      const appData = response.data[String(appid)];

      if (appData && appData.success && appData.data?.name) {
        return appData.data.name;
      } else {
        return "Unknown Game";
      }
    } catch (error) {
      console.error("Failed to fetch game name:", error);
      return "Unknown Game";
    }
  };

  return (
    <div className="app-container">
      <h1 className="body">Steam Review Randomizer</h1>
      <div className="search-container">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a game..."
        />
        <button className="search-button" onClick={handleSearch}>Search</button>
      </div>

      {results.length > 0 && (
        <ul>
          {results.map((game) => (
            <li key={game.appid} onClick={() => handleSelectGame(game)}>
              {game.name}
            </li>
          ))}
        </ul>
      )}

      {randomReview && (
        <Card
          gameName={randomReview.gameName}
          reviewText={randomReview.review}
          reviewer={randomReview.personaName}
          hoursPlayed={(randomReview.author.playtime_forever / 60).toFixed(1)}
          reactions={{
            thumbsUp: randomReview.votes_up,
            funny: randomReview.votes_funny,
          }}
        />
      )}

      {reviews.length > 0 && (
        <button onClick={() => setRandomReview(getRandomReview(reviews))}>
          Show Another Random Review
        </button>
      )}
    </div>
  );
};

export default App;
