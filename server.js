'use strict';

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const getWeather = require('./modules/weather');
const getMovies = require('./modules/movies');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`The server is up on PORT: ${PORT}`));

const start = async (request, response) => {
  console.log('Hello from the EXPLORE-CITY-API!');
  response.status(200).send('Welcome to the EXPLORE-CITY-API');
};

app.get('/', start);

app.get('/weather', getWeather);

app.get('/movies', getMovies);

const notFound = (request, response) => {
  response.status(404).send('This route does not exist');
};

app.get('*', notFound);
