const database = require('../middlewares/database');

function findByEmail(email) {
    return database.query('SELECT * FROM users WHERE ?', { email });
}

function findOne(user) {
    return database.query('SELECT * FROM users WHERE ? LIMIT 1', user);
}

function insert(user) {
    return database.query('INSERT INTO users SET ?', user);
}

function update(user, updateValues) {
    return database.query('UPDATE users SET ? WHERE ?', [updateValues, user]);
}

module.exports = {
    findByEmail,
    findOne,
    insert,
    update,
};
