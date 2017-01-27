const path = require('path'),
    authenticate = require('./authenticate');

const routesController = (app) => {
    app.use('/', authenticate);

    app.get('*', (req, res) => {
        let index = path.resolve(__dirname, '../views/index.html');
        res.sendFile(index);
    });
};

module.exports.routes = routesController;