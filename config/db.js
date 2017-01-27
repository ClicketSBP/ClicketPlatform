const mongoose = require('mongoose'),
    config = require('./clicket.config');

(() => {
    let gracefulShutdown,
        db = config.db_dev;

    if (process.env.NODE_ENV === 'production') {
        db = config.db_prod;
    }

    mongoose.Promise = global.Promise;
    mongoose.connect(db);

    /* Connection events */

    mongoose.connection.on('connected', () => {
        console.log("Mongoose connected to " + db);
    });

    mongoose.connection.on('error', (err) => {
        console.log("Mongoose connection error: " + err);
    });

    mongoose.connection.on('disconnected', () => {
        console.log("Mongoose disconnected");
    });

    /* Restart events */
    /* On restart/termination */

    gracefulShutdown = (message, cb) => {
        mongoose.connection.close(() => {
            console.log("Mongoose disconnected through " + message);
            cb();
        });
    };

    /* Nodemon restart */

    process.once('SIGUSR2', () => {
        gracefulShutdown("Nodemon restart", () => {
            process.kill(process.pid, 'SIGUSR2');
        });
    });

    /* Termination */

    process.on('SIGINT', () => {
        gracefulShutdown("App termination", () => {
            process.exit(0);
        });
    });

    /* Schemas and models */
    require('../server/models/Addresses');
    require('../server/models/Users');
    require('../server/models/Countries');
    require('../server/models/Sports');
    require('../server/models/Competitions');
    require('../server/models/Subscriptions');
    require('../server/models/Games');
    require('../server/models/Teams');
    require('../server/models/Loans');
})();