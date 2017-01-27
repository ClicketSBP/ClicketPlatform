const mongoose = require('mongoose'),
    _ = require('lodash'),
    sportSchema = require('../schemas/Sports');

let Sport = mongoose.model('Sport', sportSchema, 'Sports');

/* Create */
Sport.addSport = (body, cb) => {
    let sport = new Sport(body);
    sport.save((err) => {
        if (err) {
            cb(err);
        } else {
            cb(null);
        }
    });
};

/* Read (all sports) */
Sport.getSports = (cb) => {
    Sport.find({})
        .sort({
            featured: -1,
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

Sport.getFeaturedSports = (cb) => {
    Sport.find({
            featured: true
        })
        .sort({
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

/* Read (one sport) */
Sport.getSportById = (id, cb) => {
    Sport.findById(id, (err, docs) => {
        if (err) {
            cb(err, null);
        } else {
            cb(null, docs);
        }
    });
};

/* Update */
Sport.updateSport = (sport, body, cb) => {
    _.merge(sport, body);
    sport.save((err) => {
        if (err) {
            cb(err);
        } else {
            cb(null);
        }
    });
};

/* Delete */
Sport.deleteSport = (id, cb) => {
    Sport.findById(id, (err, docs) => {
        if (err || !docs) {
            cb(err);
        } else {
            docs.remove(cb);
        }
    });
};

module.exports = Sport;