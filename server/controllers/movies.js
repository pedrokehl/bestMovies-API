const movieRepository = require('../repositories/movies');

// Find all available movies
function getAvailableMovies(req, res, next) {
    movieRepository.findAvailables().then((result) => {
        res.status(200).send(result);
    }).catch(next);
}

// Find movies
function getMoviesByTitle(req, res, next) {
    const title = req.params.title;
    if (title.length <= 3) {
        next({ status: 400, content: 'Apenas buscas com mais de 3 caracteres' });
    }
    else {
        movieRepository.findByTitle(title).then((result) => {
            res.status(200).send(result);
        }).catch(next);
    }
}

module.exports = {
    getAvailableMovies,
    getMoviesByTitle
};
