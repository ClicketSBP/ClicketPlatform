const mongoose = require('mongoose'),
    _ = require('lodash'),
    teamSchema = require('../schemas/Teams'),
    Subscription = require('../models/Subscriptions'),
    Game = require('../models/Games');

let Team = mongoose.model('Team', teamSchema, 'Teams');

const populateSchema = [{
    path: 'address',
    model: 'Address',
    populate: [{
        path: 'country',
        model: 'Country'
    }]
}, {
    path: 'competition',
    model: 'Competition',
    populate: [{
        path: 'country',
        model: 'Country'
    }, {
        path: 'sport',
        model: 'Sport'
    }]
}];

/* Create */
Team.addTeam = (body, cb) => {
    let team = new Team(body);
    team.save((err) => {
        if (err) {
            cb(err);
        } else {
            cb(null);
        }
    });
};

/* Read (all teams) */
Team.getTeams = (cb) => {
    Team.find({})
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

Team.getTeamsByCompetition = (competition, cb) => {
    Team.find({
            competition: competition
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

/* Read (one team) */
Team.getTeamById = (id, cb) => {
    Team.findById(id)
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
Team.updateTeam = (team, body, cb) => {
    _.merge(team, body);
    team.save((err) => {
        if (err) {
            cb(err);
        } else {
            cb(null);
        }
    });
};

/* Delete */
Team.deleteTeam = (id, cb) => {
    Team.findById(id, (err, docs) => {
        if (err || !docs) {
            cb(err);
        } else {
            docs.remove(cb);
        }
    });
};

Team.deleteTeamReferences = (id, cb) => {
    Team.findById(id, (err, docs) => {
        if (err || !docs) {
            cb(err);
        } else {
            Subscription.deleteSubscriptionsByTeam(docs._id, (err) => {
                if (err) {
                    cb(err);
                } else {
                    Game.deleteGamesByTeam(docs._id, (err) => {
                        if (err) {
                            cb(err);
                        } else {
                            cb(null);
                        }
                    });
                }
            });
        }
    });
};

Team.deleteTeamsByCompetition = (competition, cb) => {
    Team.find({
        competition: competition
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

module.exports = Team;