'use strict';

const axios = require('axios');

const getWeather = async (request, response) => {
  try {
    const lat = request.query.lat;
    const lon = request.query.lon;
    const weatherURL = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}`;
    const dataToGroom = await axios.get(weatherURL);
    const dataToSend = dataToGroom.data.data.map(day => new Forecast(day));
    response.status(200).send(dataToSend);
  } catch(error) {
    console.log('ERROR FROM getWeather');
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
