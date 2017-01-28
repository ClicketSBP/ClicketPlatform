const users = require('./users'),
    cars = require('./cars'),
    sessions = require('./sessions');

const apiController = (app) => {
    app.use('/api', users);
    app.use('/api', cars);
    app.use('/api', sessions);

    app.all('/api/*', (req, res) => {
        res.json({
            info: "API path doesn't exist",
            success: false
        });
    });
};

module.exports.api = apiController;