const crypto = require('crypto');

module.exports = class {

  constructor(data) {
    this.first_name = data.first_name;
    this.last_name = data.last_name;
    this.username = data.username;
    this.email = data.email;
    this.salt = data.salt;
    this.password_hash = data.password_hash;
  }

  validatePassword(password) {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(password, this.salt, 100000, 64, 'sha512', (err, derivedKey) => {
        if (err) { //problem computing digest, like hash function not available
         reject("Error: " +err);
        }

        const digest = derivedKey.toString('hex');
        if (this.passwordHash == digest) {
          resolve(this);
        }
        else {
          reject("Invalid username or password");
        }
      });
    });
  }

  toJSON() {
    return {
      first_name: this.first_name,
      last_name: this.last_name,
      username: this.username,
      email: this.email,
      salt: this.salt,
      password_hash: this.password_hash
    }
  }
};