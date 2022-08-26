'use strict';

const axios = require('axios');

const getMovies = async (request, response) => {
  try {
    const cityName = request.query.cityName;
    const moviesURL = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&query=${cityName}&page=1&include_adult=false`;
    const dataToGroom = await axios.get(moviesURL);
    const dataToSend = dataToGroom.data.results.map(movie => new Movie(movie));
    response.status(200).send(dataToSend);
  } catch(error) {
    console.log('ERROR FROM getMovies');
    response.status(500).send(error.message);
  }
};

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

module.exports = getMovies;
