// server/index.js

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

app.get('/', (req, res) => {
  res.send('🎉 Steam Review API is live!');
});


const corsOptions = {
  origin: ['http://localhost:3000', 'https://steam-review-randomizer.web.app'],
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


app.listen(3000, () => console.log(' Server running on http://localhost:3000'));
