const mongoose = require('mongoose'),
    _ = require('lodash'),
    sessionSchema = require('../schemas/Session');

let Session = mongoose.model('Session', sessionSchema, 'Sessions');

const populateSchema = [{
    path: 'car_id',
    model: 'Car'
}, {
    path: 'user_id',
    model: 'User'
}, {
    path: 'zone_id',
    model: 'Zone'
}];

/* Create */
Session.addSession = (body, cb) => {
    let session = new Session(body);
    session.save((err, docs) => {
        if (err) {
            cb(err, null);
        } else {
            Session.getSessionById(docs.id, (err, session) => {
                if (err) {
                    cb(err, null);
                } else if (session) {
                    cb(null, session);
                }
            });
        }
    });
};

/* Read (all sessions) */
Session.getSessions = (cb) => {
    Session.find({})
        .sort({
            active: -1,
            started_on: -1
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
        .populate(populateSchema)
        .sort({
            active: -1,
            started_on: -1
        })
        .exec((err, docs) => {
            if (err) {
                cb(err, null);
            } else {
                cb(null, docs);
            }
        });
};

/* Read (get recent sessions) */
Session.getRecentSessionsByUserId = (userid, amount, cb) => {
    Session.find({
            user_id: userid,
            active: false
        })
        .populate(populateSchema)
        .sort({
            started_on: -1
        })
        .limit(amount)
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
        .populate(populateSchema)
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