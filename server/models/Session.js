var mongoose = require('mongoose'),
    _ = require('lodash'),
    EventEmitter = require('events').EventEmitter,
    sessionSchema = require('../schemas/Session');

var Session = (function(EventEmitter) {
    var _session = mongoose.model('Session', sessionSchema, 'Sessions');
    var _emitter = new EventEmitter();

    var on = (event, cb) => {
        _emitter.on(event, cb);
    };

    var emit = (tag, body) => {
        _emitter.emit(tag, body);
    };

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
    var addSession = (body, cb) => {
        var session = new _session(body);
        session.save((err, docs) => {
            if (err) {
                cb(err, null);
            } else {
                getSessionById(docs.id, (err, ses) => {
                    if (err) {
                        cb(err, null);
                    } else if (ses) {
                        cb(null, ses);
                    }
                });
            }
        });
    };

    /* Read (all sessions) */
    var getSessions = (cb) => {
        _session.find({})
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
    var getSessionsByUserId = (userid, cb) => {
        _session.find({
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
    var getRecentSessionsByUserId = (userid, amount, cb) => {
        _session.find({
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

    /* Read (get active session) */
    var getActiveSession = (userid, cb) => {
        _session.findOne({
                user_id: userid,
                active: true
            })
            .populate(populateSchema)
            .exec((err, docs) => {
                if (err) {
                    cb(err, null);
                } else {
                    cb(null, docs);
                }
            });
    };

    /* Read (get all sessions by car id) */
    var getSessionsByCarId = (carId, cb) => {
        _session.find({
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
    var getSessionById = (id, cb) => {
        _session.findById(id)
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
    var updateSession = (session, body, cb) => {
        _.merge(session, body);
        session.save((err) => {
            if (err) {
                cb(err);
            } else {
                cb(null);
            }
        });
    };

    /* Devare */
    var devareSession = (id, cb) => {
        _session.findById(id, (err, docs) => {
            if (err || !docs) {
                cb(err);
            } else {
                docs.remove(cb);
            }
        });
    };

    return {
        model: _session,
        on: on,
        emit: emit,
        addSession: addSession,
        getSessions: getSessions,
        getSessionsByUserId: getSessionsByUserId,
        getRecentSessionsByUserId: getRecentSessionsByUserId,
        getActiveSession: getActiveSession,
        getSessionsByCarId: getSessionsByCarId,
        getSessionById: getSessionById,
        updateSession: updateSession,
        devareSession: devareSession
    };
})(EventEmitter);

module.exports = Session;