'use strict';

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`The server is up on PORT: ${PORT}`));

const start = async (request, response) => {
  console.log('Hello from the EXPLORE-CITY-API!');
  response.status(200).send('Welcome to the EXPLORE-CITY-API');
};

app.get('/', start);

const getWeather = async (request, response) => {
  try {
    console.log('TESTING WEATHER ENDPOINT');
    const lat = request.query.lat;
    const lon = request.query.lon;
    const weatherURL = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}`;
    const dataToGroom = await axios.get(weatherURL);
    const dataToSend = dataToGroom.data.data.map(day => new Forecast(day));
    console.log(dataToSend);
    response.status(200).send(dataToSend);
  } catch(error) {
    response.status(500).send(error.message);
  }
};

app.get('/weather', getWeather);

class Forecast {
  constructor(dayObj) {
    this.date = dayObj.valid_date;
    this.description = dayObj.weather.description;
  }
}

const getMovies = async (request, response) => {
  try {
    const cityName = request.query.cityName;
    const moviesURL = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&query=${cityName}&page=1&include_adult=false`;
    const dataToGroom = await axios.get(moviesURL);
    console.log('TESTING getMovies in BACK END');
    console.log(dataToGroom.data);
    const dataToSend = dataToGroom.data.results.map(movie => new Movie(movie));
    response.status(200).send(dataToSend);
  } catch(error) {
    response.status(500).send(error.message);
  }
};

app.get('/movies', getMovies);

class Movie {
  constructor(movie) {
    this.id = movie.id;
    this.title = movie.title;
    this.overview = movie.overview;
    this.average_votes = movie.vote_average;
    this.total_votes = movie.vote_count;
    this.image_url = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    this.popularity = movie.popularity;
    this.released_on = movie.release_date;
  }
}

const notFound = (request, response) => {
  response.status(404).send('This route does not exist');
};

app.get('*', notFound);
