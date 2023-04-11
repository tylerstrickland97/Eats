const db = require('./DBConnection');
const Allergy = require('./models/Allergy');

function getAllergies() {
    return db.query('SELECT * FROM allergies').then(({results}) => {
        return results.map(allergy => new Allergy(allergy));
    })
}

function getUserAllergies(userId) {
    return db.query('SELECT * FROM user_allergies WHERE user_id=?', [userId]).then(({results}) => {
        return results;
    })
}

function getAllergyByType(type) {
    return db.query('SELECT * FROM allergies WHERE allergy_type=?', [type]).then(({results}) => {
        if (results[0]) {
            return new Allergy(results[0]);
        }
    })
}

function getAllergyById(id) {
    return db.query('SELECT * FROM allergies WHERE allergy_id=?', [id]).then(({results}) => {
        if (results[0]) {
            return new Allergy(results[0]);
        }
    })
}

function addUserAllergy(userId, allergyId) {
    return db.query('INSERT INTO user_allergies (user_id, allergy_id) VALUES (?, ?)', [userId, allergyId]).then(({results}) => {
        return results.insertId;
    });
}

function deleteUserAllergy(userId, allergyId) {
    return db.query('DELETE FROM user_allergies WHERE user_id=? AND allergy_id=?', [userId, allergyId]).then(({results}) => {
        return results;
    });
}

module.exports = {
    getAllergies: getAllergies,
    getUserAllergies: getUserAllergies,
    getAllergyByType: getAllergyByType,
    getAllergyById: getAllergyById,
    addUserAllergy: addUserAllergy,
    deleteUserAllergy: deleteUserAllergy
};