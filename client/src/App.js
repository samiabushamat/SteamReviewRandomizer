import React, { useState, useRef } from 'react';
import axios from 'axios';
import Card from './components/Card';
import './styles/app.css';
import { BASE_URL } from './config';
import {FaRandom} from 'react-icons/fa';
import GoogleAd from './components/AdBanner';

const App = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [appid, setAppid] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [randomReview, setRandomReview] = useState(null);
  const [gameName, setGameName] = useState('');
  const [funnyOnly, setFunnyOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const randomPicked = React.useRef(false);
  const latestFetchId = useRef(null);

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


const fetchReviews = async (appid, name, funnyOnly = false, maxReviews = 10000000) => {
  let allReviews = [];
  let cursor = '*';
  let keepGoing = true;
  const thisFetchId = Date.now();
  latestFetchId.current = thisFetchId;

  setLoading(true);
  setReviews([]);
  setRandomReview(null);
  randomPicked.current = false;

  try {
    while (keepGoing && allReviews.length < maxReviews) {
      const response = await fetch(
        `${BASE_URL}/reviews/${appid}?cursor=${encodeURIComponent(cursor)}&num=100`
      );
      const data = await response.json();

      if (!data.reviews || !data.reviews.length) break;

      let batch = data.reviews.map((review) => ({
        ...review,
        gameName: name,
      }));

      if (funnyOnly) {
        batch = batch.filter((r) => r.votes_funny > 10);
      }

      if (batch.length > 0) {
        if (latestFetchId.current !== thisFetchId) return;
        allReviews = [...allReviews, ...batch];
        setReviews((prev) => [...prev, ...batch]);

        if (!randomPicked.current) {
          setRandomReview(getRandomReview(batch, funnyOnly));
          randomPicked.current = true;
        }
      }

      cursor = data.cursor;

      await new Promise((res) => setTimeout(res, 500));
    }
  } catch (err) {
    console.error("Review fetch failed:", err);
  } finally {
    setLoading(false);
  }
};





  const getRandomReview = (arr) => {
    if (!arr.length) return null;

    const filtered = funnyOnly
      ? arr.filter((r) => r.votes_funny > 10)
      : arr;

    if (!filtered.length) return null;
    
    return arr[Math.floor(Math.random() * arr.length)];
  };

  const handleSelectGame = async (game) => {
    setAppid(game.appid);
    setResults([]);
    const name = await fetchGameName(game.appid);
    setGameName(name);
    setQuery(name);
    fetchReviews(game.appid, name,funnyOnly, 10000000, true);
  };

return (
  <div className="app-wrapper">
    <div className="side-ad left-ad">
      <GoogleAd />
    </div>

    <div className="app-container">
      <h1 className="body">Stuffle</h1>
      <p className="body">Search for a game to get started!</p>
      <p className="body">Please wait for another search until we fetch all the reviews, especially for popular games. Thank you!</p>
      <div className="search-container">
        <div className="search-row">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
              }
            }}
            placeholder="Search for a game..."
          />
          <button className="search-button" onClick={handleSearch}>
            Search
          </button>
          <button
            className={`funny-toggle-button ${funnyOnly ? 'outline' : 'filled'}`}
            onClick={() => {
              const newFunnyOnly = !funnyOnly;
              setFunnyOnly(newFunnyOnly); 
              randomPicked.current = false;
              setReviews([]);
              setRandomReview(null);
              setRandomReview(null);
              if (appid) {
                const gameLabel = gameName || query;
                fetchReviews(appid, gameLabel, newFunnyOnly,10000000, true);
              }
            }}
          >
            {funnyOnly ? ' Funny' : 'All'}
          </button>

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
            funny: randomReview.votes_funny,
          }}
        />
      )}
        {loading && (
          <p style={{ textAlign: 'center' }}>
            {funnyOnly ? 'Finding something funny… Please Wait!' : 'Loading reviews... Please Wait!'}
          </p>
        )}


      {reviews.length > 0 && (
        <button
          className="shuffle-button"
          onClick={() => setRandomReview(getRandomReview(reviews,funnyOnly))}
        >
          <span>Stuffle</span>
          <FaRandom className="shuffle-icon" />
        </button>
      )}
    </div>

    {/* Right Ad */}
    <div className="side-ad right-ad">
      <GoogleAd />
    </div>
  </div>
);
}
export default App;
