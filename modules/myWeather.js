'use strict';

const axios = require('axios');

const getWeather = async (request, response) => {
  try {
    const { lat, lon } =  request.query;
    const weatherBaseURL = `https://api.weatherbit.io/v2.0/forecast/daily`;
    const dataToGroom = await axios.get(weatherBaseURL, { params: {
      lat: lat,
      lon: lon,
      key: process.env.WEATHER_API_KEY
    }});
    const dataToSend = dataToGroom.data.data.map(day => new Forecast(day));
    response.status(200).send(dataToSend);
  } catch(error) {
    console.log('ERROR FROM getWeather', error);
    response.status(500).send(error.message);
  }
};

class Forecast {
  constructor(dayObj) {
    this.date = dayObj.valid_date;
    this.description = dayObj.weather.description;
  }
}

module.exports = getWeather;
