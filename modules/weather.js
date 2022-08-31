'use strict';

const cache = require('./cache.js');
const axios = require('axios');

function getWeather(latitude, longitude) {
  const key = 'weather-' + latitude + longitude;
  const baseWeatherURL = `http://api.weatherbit.io/v2.0/forecast/daily/`;

  if (cache[key] && (Date.now() - cache[key].timestamp < 60000)) {
    console.log('Weather Cache hit');
    return Promise.resolve(cache[key].data);
  } else {
    console.log('Weather Cache miss');
    return axios.get(baseWeatherURL, { params: {
      key: process.env.WEATHER_API_KEY,
      lat: latitude,
      lon: longitude,
      days: 5,
      lang: 'en'
    }})
      .then(response => parseWeather(response.data))
      .then(groomedData => {
        cache[key] = {};
        cache[key].timestamp = Date.now();
        cache[key].data = groomedData;
        return groomedData;
      })
      .catch(error => {
        console.log('Error in getWeather', error);
        return error;
      });
  }
}

function parseWeather(weatherData) {
  try {
    const weatherSummaries = weatherData.data.map(day => {
      return new Weather(day);
    });
    return weatherSummaries;
  } catch (error) {
    console.log('Error in parseWeather', error);
    return error;
  }
}

class Weather {
  constructor(day) {
    this.forecast = day.weather.description;
    this.time = day.datetime;
  }
}

module.exports = getWeather;
