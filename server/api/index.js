const users = require('./users'),
    cars = require('./cars'),
    sessions = require('./sessions'),
    zones = require('./zones'),
    zoneDatas = require('./zoneDatas'),
    twilio = require('./twilio');

const apiController = (app) => {
    app.use('/api', users);
    app.use('/api', cars);
    app.use('/api', sessions);
    app.use('/api', zones);
    app.use('/api', zoneDatas);
    app.use('/api', twilio);

    app.all('/api/*', (req, res) => {
        res.json({
            info: "API path doesn't exist",
            success: false
        });
    });
};

module.exports.api = apiController;