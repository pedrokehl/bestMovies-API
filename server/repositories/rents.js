const database = require('../middlewares/database');

function insert(rent) {
    return database.query('INSERT INTO rents set ?', rent);
}

function returnMovie(movie, user) {
    return database.query('UPDATE rents SET returned = 1 WHERE movie = ? AND user = ? AND returned = 0 ORDER BY id LIMIT 1', [movie, user]);
}

module.exports = {
    insert,
    returnMovie
};
