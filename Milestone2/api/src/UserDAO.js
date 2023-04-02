const db = require('./DBConnection');
const User = require('./models/User');

function getUserByCredentials(username, password) {
  return db.query('SELECT * FROM users WHERE username=?', [username]).then(({results}) => {
    const user = new User(results[0]);
    if (user) { // we found our user
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
      return new User(results[0]);
    }
  })
}

function createUser(user) {
  console.log(user);
  let newUser = new User(user);
  console.log("new user: ");
  console.log(newUser);
  return db.query('INSERT INTO users (first_name, last_name, username, email, salt, password_hash) VALUES (?)', [newUser]).then(({results}) => {
    return getUserById(results.insertId);
  })
}

module.exports = {
  getUserByCredentials: getUserByCredentials,
  getUserById: getUserById,
  createUser: createUser

};
