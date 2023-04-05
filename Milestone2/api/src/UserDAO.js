const db = require('./DBConnection');
const User = require('./models/User');
const Favorite = require('./models/Favorite');

function getUserByCredentials(username, password) {
  return db.query('SELECT * FROM users WHERE username=?', [username]).then(({results}) => {
    if (results.length == 0) {
      throw new Error("No such user");
    }
    const user = new User(results[0]);
    if (user) { // we found our user
      console.log(user.password_hash);
      return user.validatePassword(password);
    }
    else { // if no user with provided username
      throw new Error("No such user");
    }
  });
}

function getUserById(userId) {
  return db.query('SELECT * FROM users WHERE user_id=?', [userId]).then(({results}) => {
    if (results[0]) {
      let newUser = new User(results[0]);
      //console.log(newUser);
      return newUser;
    }
  })
}

function getUserByUsername(userUsername) {
  return db.query('SELECT * FROM users WHERE username=?', [userUsername]).then(({results}) => {
    if (results[0]) {
      return true; // User exists
    } else {
      return null;
    }
  });
}

function createUser(user) {
  let newUser = new User(user);
  return db.query('INSERT INTO users (first_name, last_name, username, email, salt, password_hash) VALUES (?, ?, ?, ?, ?, ?)',
   [newUser.first_name, newUser.last_name, newUser.username, newUser.email, newUser.salt, newUser.password_hash]).then(({results}) => {
     getUserById(results.insertId);
  });
}

function addToUserFavorites(userId, restaurantId) {
  return db.query('INSERT INTO favorites (user_id, restaurant_id) VALUES (?, ?)', [userId, restaurantId]).then(({results}) => {
    return results.insertId;
  })
}

function getFavorite(userId, restaurantId) {
  return db.query('SELECT * FROM favorites WHERE user_id=? AND restaurant_id=?', [userId, restaurantId]).then(({results}) => {
    if (results[0]) {
      return new Favorite(results[0]);
    }
  });
}

function getUserFavorites(userId) {
  return db.query('SELECT * FROM favorites WHERE user_id=?', [userId]).then(({results}) => {
    return results;
  })
}

function removeUserFavorite(userId, restaurantId) {
  return db.query('DELETE FROM favorites WHERE user_id=? AND restaurant_id=?', [userId, restaurantId]).then(({results}) => {
    console.log(results);
    return results;
  })
}

module.exports = {
  getUserByCredentials: getUserByCredentials,
  getUserById: getUserById,
  createUser: createUser,
  addToUserFavorites: addToUserFavorites,
  getUserFavorites: getUserFavorites,
  removeUserFavorite, removeUserFavorite
};
