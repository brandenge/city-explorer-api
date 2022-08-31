'use strict';

const cache = require('./cache.js');
const axios = require('axios');

const getMovies = async (request, response) => {
  try {
    const { cityName } = request.query;
    const key = 'movies-' + cityName;
    if (cache[key] && (Date.now() - cache[key].timestamp < 60000)) {
      console.log('Movies Cache hit');
      response.status(200).send(cache[key].data);
    } else {
      console.log('Movies Cache miss');
      const moviesBaseURL = `https://api.themoviedb.org/3/search/movie`;
      const dataToGroom = await axios.get(moviesBaseURL, { params: {
        api_key: process.env.MOVIE_API_KEY,
        query: cityName,
        language: 'en-US',
        page: 1,
        include_adult: false
      }});
      const dataToSend = dataToGroom.data.results.map(movie => new Movie(movie));
      cache[key] = {};
      cache[key].timestamp = Date.now();
      cache[key].data = dataToSend;
      response.status(200).send(dataToSend);
    }
  } catch(error) {
    console.log('ERROR FROM getMovies', error);
    response.status(500).send(error.message);
  }
};

class Movie {
  constructor(movie) {
    const imageURL = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://post.medicalnewstoday.com/wp-content/uploads/sites/3/2020/02/322868_1100-800x825.jpg';

    this.id = movie.id;
    this.title = movie.title;
    this.overview = movie.overview;
    this.average_votes = movie.vote_average;
    this.total_votes = movie.vote_count;
    this.image_url = imageURL;
    this.popularity = movie.popularity;
    this.released_on = movie.release_date;
  }
}

module.exports = getMovies;
