const database = require('../middlewares/database');

function checkAvailable(movie) {
    return database.query('SELECT * FROM movies WHERE available > 0 && ?', movie);
}

function findAvailables() {
    return database.query('SELECT * FROM movies WHERE available > 0');
}

function findByTitle(title) {
    const param = '%' + title.toUpperCase() + '%';
    return database.query('SELECT * FROM movies WHERE UPPER(title) like ? && available > 0', param);
}

function rentMovie(movie) {
    return database.query('UPDATE movies SET available = available -1 WHERE ?', movie);
}

function returnMovie(movie) {
    return database.query('UPDATE movies SET available = available +1 WHERE ?', movie);
}

module.exports = {
    checkAvailable,
    findAvailables,
    findByTitle,
    rentMovie,
    returnMovie
};
