const db = require('./DBConnection');
const Restaurant = require('./models/Restaurant');

function getRestaurants() {
    return db.query('SELECT * FROM restaurants').then(({results}) => {
        return results.map(restaurant => new Restaurant(restaurant));
    });
}

function getRestaurantById(restaurantId) {
    console.log(db.query('SELECT * FROM restaurants WHERE restaurant_id=?', [restaurantId]));
    return db.query('SELECT * FROM restaurants WHERE restaurant_id=?', [restaurantId]).then(({results}) => {
        if (results[0]) {
            return new Restaurant(results[0]);
        }
    })
}

function getRestaurantByName(restaurantName) {
    return db.query('SELECT * FROM restaurants WHERE restaurant_name=?', [restaurantName]).then(({results}) => {
        if (results[0]) {
            return new Restaurant(results[0]);
        }
    })
}

function createRestaurant(restaurant) {
    return db.query('INSERT INTO restaurants (restaurant_name) VALUES (?)', [restaurant]).then(({results}) => {
        return getRestaurantById(results.insertId);
    })
}

module.exports = {
    getRestaurants: getRestaurants,
    getRestaurantById: getRestaurantById,
    getRestaurantByName: getRestaurantByName,
    createRestaurant: createRestaurant
};