const db = require('./DBConnection');

function getUser(message) {
    console.log('successfully got to the functino that will query the database');
}

module.exports = {
    getUser: getUser,
  };