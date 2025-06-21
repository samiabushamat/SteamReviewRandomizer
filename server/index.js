// server/index.js

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

app.get('/', (req, res) => {
  res.send('🎉 Steam Review API is live!');
});


const corsOptions = {
  origin: ['http://localhost:5000', 'https://steam-review-randomizer.web.app','http://localhost:3000'],
  methods: ['GET'],
};

app.use(cors(corsOptions));

app.get('/search/:query', async (req, res) => {
  const { query } = req.params;
  try {
    const response = await axios.get(`https://steamcommunity.com/actions/SearchApps/${query}`);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Search failed' });
  }
});

app.get('/gameinfo/:appid', async (req, res) => {
  const { appid } = req.params;
  try {
    const response = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${appid}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching game info:', error.message);
    res.status(500).json({ error: 'Failed to fetch game info' });
  }
});


// For Node/Express
app.get('/reviews/:appid', async (req, res) => {
  const appid = req.params.appid;
  const cursor = req.query.cursor || '*';
  const num = req.query.num || 100;

  try {
    const steamRes = await fetch(`https://store.steampowered.com/appreviews/${appid}?json=1&cursor=${encodeURIComponent(cursor)}&num_per_page=${num}&filter=recent&language=english&purchase_type=all`);
    const data = await steamRes.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Steam API fetch failed', details: err.message });
  }
});





app.get('/gamename/:appid', async (req, res) => {
  const { appid } = req.params;

  try {
    const response = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${appid}`);
    res.json(response.data);
  } catch (error) {
    console.error('Failed to fetch game name:', error.message);
    res.status(500).json({ error: 'Failed to fetch game name' });
  }
});


app.listen(5000, () => console.log(' Server running on http://localhost:5000'));
