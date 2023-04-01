const db = require('./DBConnection');

function getRestaurants() {
    return db.query('SELECT * FROM restaurants').then(({results}) => {
        return results;
      });
}

module.exports = {
    getRestaurants: getRestaurants,
};