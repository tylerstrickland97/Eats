const db = require('./DBConnection');
const Menu = require('./models/Menu');

function getMenuById(restaurantId) {
    return db.query('SELECT * FROM menu_items WHERE restaurant_id=?', [restaurantId]).then(({results}) => {
        return results.map(menu_item => new Menu(menu_item));
    });
}

module.exports = {
    getMenuById: getMenuById
};