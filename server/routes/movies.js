module.exports = (app) => {
    const moviesController = app.controllers.movies;
    app.routes.get('/movies', app.token.validateAndRefresh, moviesController.getAvailableMovies);
    app.routes.get('/movies/:title', app.token.validateAndRefresh, moviesController.getMoviesByTitle);
};
