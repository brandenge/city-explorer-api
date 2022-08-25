'use strict';

console.log('The EXPLORE-CITY-API server is up and running');

const express = require('express');
require('dotenv').config();
const data = require('./data/weather.json');
const cors = require('cors');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`The server is up on PORT: ${PORT}`));

app.get('/', (request, response) => {
  console.log('Hello from the EXPLORE-CITY-API!');
  response.status(200).send('Welcome to the EXPLORE-CITY-API');
});

app.get('/weather', (request, response) => {
  try {
    const cityName = request.query.cityName;
    const dataToGroom = data.find(city => city.city_name === cityName);
    const dataToSend = dataToGroom.data.map(day => new Forecast(day));
    response.status(200).send(dataToSend);
  } catch(error) {
    response.status(500).send(error.message);
  }
});

class Forecast {
  constructor(dayObj) {
    this.date = dayObj.valid_date;
    this.description = dayObj.weather.description;
  }
}

app.get('*', (request, response) => {
  response.status(404).send('This route does not exist');
});
