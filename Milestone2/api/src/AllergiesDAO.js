const db = require('./DBConnection');
const Allergy = require('./models/Allergy');

function getAllergies() {
    return db.query('SELECT * FROM allergies').then(({results}) => {
        return results.map(allergy => new Allergy(allergy));
    })
}

function getUserAllergies(userId) {
    return db.query('SELECT * FROM user_allergies WHERE user_id=?', [userId]).then(({results}) => {
        return results.map(allergy => new Allergy(allergy));
    })
}

function getAllergyByType(type) {
    return db.query('SELECT * FROM allergies WHERE allergy_type=?', [type]).then(({results}) => {
        if (results[0]) {
            return new Allergy(results[0]);
        }
    })
}

function addUserAllergy(userId, type) {
    getAllergyByType(type).then(allergy => {
        if (allergy.type) {
            return db.query('INSERT INTO user_allergies (user_id, allergy_type) VALUES (?, ?)', [userId, allergy.id]).then(({results}) => {
                return results.insertId;
            })
        }
    });
}

function deleteUserAllergy(userId, type) {
    getAllergyByType(type).then(allergy => {
        if (allergy.type) {
            return db.query('DELETE FROM user_allergies WHERE user_id=? AND allergy_type=?', [userId, allergy.id]).then(({results}) => {
                return results;
            })
        }
    });
}

module.exports = {
    getAllergies: getAllergies,
    getUserAllergies: getUserAllergies,
    getAllergyByType: getAllergyByType,
    addUserAllergy: addUserAllergy,
    deleteUserAllergy: deleteUserAllergy
};