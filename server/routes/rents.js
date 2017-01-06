module.exports = (app) => {
    const rentsController = app.controllers.rents;
    app.routes.post('/rent', app.token.validateAndRefresh, rentsController.rentMovie);
    app.routes.post('/return', app.token.validateAndRefresh, rentsController.returnMovie);
};
