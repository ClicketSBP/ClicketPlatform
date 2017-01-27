const mongoose = require('mongoose'),
    _ = require('lodash'),
    sessionSchema = require('../schemas/Session');

let Session = mongoose.model('Session', sessionSchema, 'Sessions');

/* Create */
Session.addSession = (body, cb) => {
    let session = new Session(body);
    session.save((err) => {
        if (err) {
            cb(err);
        } else {
            cb(null);
        }
    });
};

/* Read (all sessions) */
Session.getSessions = (cb) => {
    Session.find({})
        .sort({
            default_session: -1,
            name: 1
        })
        .exec((err, docs) => {
            if (err) {
                cb(err, null);
            } else {
                cb(null, docs);
            }
        });
};

/* Read (get all sessions by user id) */
Session.getSessionsByUserId = (userid, cb) => {
    Session.find({
            user_id: userid
        })
        .sort({
            default_session: -1,
            name: 1
        })
        .exec((err, docs) => {
            if (err) {
                cb(err, null);
            } else {
                cb(null, docs);
            }
        });
};

/* Read (get all sessions by car id) */
Session.getSessionsByCarId = (carId, cb) => {
    Session.find({
            car_id: carId
        })
        .sort({
            car_id: 1
        })
        .exec((err, docs) => {
            if (err) {
                cb(err, null);
            } else {
                cb(null, docs);
            }
        });
};

/* Read (one session) */
Session.getSessionById = (id, cb) => {
    Session.findById(id)
        .exec((err, docs) => {
            if (err) {
                cb(err, null);
            } else {
                cb(null, docs);
            }
        });
};

/* Update */
Session.updateSession = (session, body, cb) => {
    _.merge(session, body);
    session.save((err) => {
        if (err) {
            cb(err);
        } else {
            cb(null);
        }
    });
};

/* Delete */
Session.deleteSession = (id, cb) => {
    Session.findById(id, (err, docs) => {
        if (err || !docs) {
            cb(err);
        } else {
            docs.remove(cb);
        }
    });
};

module.exports = Session;