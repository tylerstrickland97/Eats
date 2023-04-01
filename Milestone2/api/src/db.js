let restaurants = require('./data/restaurants.json');

module.exports = {
    getRestaurants: () => {
        return new Promise((resolve, reject) => {
            resolve(restaurants);
        });
    }
}