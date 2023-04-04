const db = require('./DBConnection');
const User = require('./models/User');

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
      console.log(newUser);
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

module.exports = {
  getUserByCredentials: getUserByCredentials,
  getUserById: getUserById,
  getUserByUsername: getUserByUsername,
  createUser: createUser
};
