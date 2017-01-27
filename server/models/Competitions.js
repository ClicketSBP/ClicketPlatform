const mongoose = require('mongoose'),
    _ = require('lodash'),
    competitionSchema = require('../schemas/Competitions');

let Competition = mongoose.model('Competition', competitionSchema, 'Competitions');

const populateSchema = {
    path: 'country sport'
};

/* Create */
Competition.addCompetition = (body, cb) => {
    let competition = new Competition(body);
    competition.save((err) => {
        if (err) {
            cb(err);
        } else {
            cb(null);
        }
    });
};

/* Read (all competitions) */
Competition.getCompetitions = (cb) => {
    Competition.find({})
        .populate(populateSchema)
        .sort({
            country: 1,
            sport: 1,
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

Competition.getCompetitionsByCountry = (country, cb) => {
    Competition.find({
            country: country
        })
        .populate(populateSchema)
        .sort({
            sport: 1,
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

Competition.getCompetitionsBySport = (sport, cb) => {
    Competition.find({
            sport: sport
        })
        .populate(populateSchema)
        .sort({
            country: 1,
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

Competition.getCompetitionsByCountryAndSport = (country, sport, cb) => {
    Competition.find({
            country: country,
            sport: sport
        })
        .populate(populateSchema)
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

/* Read (one competition) */
Competition.getCompetitionById = (id, cb) => {
    Competition.findById(id)
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
Competition.updateCompetition = (competition, body, cb) => {
    _.merge(competition, body);
    competition.save((err) => {
        if (err) {
            cb(err);
        } else {
            cb(null);
        }
    });
};

/* Delete */
Competition.deleteCompetition = (id, cb) => {
    Competition.findById(id, (err, docs) => {
        if (err || !docs) {
            cb(err);
        } else {
            docs.remove(cb);
        }
    });
};

Competition.deleteCompetitionsByCountry = (country, cb) => {
    Competition.find({
        country: country
    }, (err, docs) => {
        if (err || docs.length === 0) {
            cb(err);
        } else {
            docs.forEach((doc) => {
                doc.remove(cb);
            });
        }
    });
};

Competition.deleteCompetitionsBySport = (sport, cb) => {
    Competition.find({
        sport: sport
    }, (err, docs) => {
        if (err || docs.length === 0) {
            cb(err);
        } else {
            docs.forEach((doc) => {
                doc.remove(cb);
            });
        }
    });
};

module.exports = Competition;