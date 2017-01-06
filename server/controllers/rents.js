const movieRepository = require('../repositories/movies');
const rentRepository = require('../repositories/rents');
const userRepository = require('../repositories/user');

// Check if movie is available
// Find user id to populate rents history
// Insert into rents table
// Update available quantity in movies table
function rentMovie(req, res, next) {
    const movie = {
        id: req.body.movie
    };

    movieRepository.checkAvailable(movie).then((movieFound) => {
        if (!movieFound) {
            next({ status: 400, content: 'Filme Indisponível' });
        }
        else {
            userRepository.findByEmail(req.decoded.email).then((userFound) => {
                const rent = {
                    movie: req.body.movie,
                    user: userFound.id
                };
                rentRepository.insert(rent).then(() => {
                    movieRepository.rentMovie(movie).then(() => {
                        res.status(201).end();
                    }).catch(next);
                }).catch(next);
            });
        }
    }).catch(next);
}

// Find user id to populate rents history
// Update rents table, if any row have been updated, it's because it's not a true rent
// if a row was updated, update available quantity in movies table
function returnMovie(req, res, next) {
    const movie = {
        id: req.body.movie
    };

    userRepository.findByEmail(req.decoded.email).then((userFound) => {
        rentRepository.returnMovie(req.body.movie, userFound.id).then((data) => {
            if (!data || data.changedRows === 0) {
                next({ status: 400, content: 'Locação não encontrada para esta devolução' });
            }
            else {
                movieRepository.returnMovie(movie).then(() => {
                    res.status(201).end();
                }).catch(next);
            }
        }).catch(next);
    }).catch(next);
}

module.exports = {
    rentMovie,
    returnMovie
};
