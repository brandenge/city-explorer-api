'use strict';

const cache = require('./cache.js');
const axios = require('axios');

const getYelp = async (request, response) => {
  try {
    const { lat, lon } =  request.query;
    const key = 'restaurants-' + lat + lon;
    if (cache[key] && (Date.now() - cache[key].timestamp < 60000)) {
      console.log('Yelp Cache hit');
      response.status(200).send(cache[key].data);
    } else {
      console.log('Yelp Cache miss');
      const yelpBaseURL = `https://api.yelp.com/v3/businesses/search`;

      const dataToGroom = await axios.get(yelpBaseURL,
        {
          params: {
            latitude: lat,
            longitude: lon,
            categories: 'restaurants',
            limit: 20
          },
          headers: {
            Authorization: `Bearer ${process.env.YELP_API_KEY}`
          }
        });
      const dataToSend = dataToGroom.data.businesses.map(restaurant => new Restaurant(restaurant));
      cache[key] = {};
      cache[key].timestamp = Date.now();
      cache[key].data = dataToSend;
      response.status(200).send(dataToSend);
    }
  } catch(error) {
    console.log('ERROR FROM getYelp', error);
    response.status(500).send(error.message);
  }
};

class Restaurant {
  constructor(restaurant) {
    this.name = restaurant.name;
    this.image_url = restaurant.image_url;
    this.price = restaurant.price;
    this.rating = restaurant.rating;
    this.url = restaurant.url;
    this.id = restaurant.id;
  }
}

module.exports = getYelp;
