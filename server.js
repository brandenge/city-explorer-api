'use strict';

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const getWeather = require('./modules/weather');
const getMovies = require('./modules/movies');
const getYelp = require('./modules/yelp');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server up on ${PORT}`));

function weatherHandler(request, response) {
  const { lat, lon } = request.query;
  getWeather(lat, lon)
    .then(summaries => response.status(200).send(summaries))
    .catch((error) => {
      console.error(error);
      response.status(500).send('Sorry. Something went wrong!');
    });
}

app.get('/weather', weatherHandler);

app.get('/movies', getMovies);

app.get('/yelp', getYelp);

const notFound = (request, response) => {
  response.status(404).send('This route does not exist');
};

app.get('*', notFound);
