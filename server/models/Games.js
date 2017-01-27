const mongoose = require('mongoose'),
    moment = require('moment'),
    _ = require('lodash'),
    gameSchema = require('../schemas/Games'),
    Competition = require('../models/Competitions');

let Game = mongoose.model('Game', gameSchema, 'Games');

const populateSchema = [{
    path: 'home',
    model: 'Team',
    populate: [{
        path: 'address',
        model: 'Address',
        populate: [{
            path: 'country',
            model: 'Country'
        }]
    }]
}, {
    path: 'away',
    model: 'Team',
    populate: [{
        path: 'address',
        model: 'Address',
        populate: [{
            path: 'country',
            model: 'Country'
        }]
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
}, {
    path: 'loans',
    model: 'Loan',
    populate: [{
        path: 'lent_by',
        model: 'User',
        populate: [{
            path: 'address',
            model: 'Address',
            populate: [{
                path: 'country',
                model: 'Country'
            }]
        }, {
            path: 'favorites',
            model: 'Team',
            populate: [{
                path: 'competition',
                model: 'Competition',
                populate: [{
                    path: 'country',
                    model: 'Country'
                }, {
                    path: 'sport',
                    model: 'Sport'
                }]
            }, {
                path: 'address',
                model: 'Address',
                populate: [{
                    path: 'country',
                    model: 'Country'
                }]
            }]
        }, {
            path: 'subscriptions',
            model: 'Subscription',
            populate: [{
                path: 'team',
                model: 'Team',
                populate: [{
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
                }]
            }]
        }]
    }, {
        path: 'lent_out_by',
        model: 'User',
        populate: [{
            path: 'address',
            model: 'Address',
            populate: [{
                path: 'country',
                model: 'Country'
            }]
        }, {
            path: 'favorites',
            model: 'Team',
            populate: [{
                path: 'competition',
                model: 'Competition',
                populate: [{
                    path: 'country',
                    model: 'Country'
                }, {
                    path: 'sport',
                    model: 'Sport'
                }]
            }, {
                path: 'address',
                model: 'Address',
                populate: [{
                    path: 'country',
                    model: 'Country'
                }]
            }]
        }, {
            path: 'subscriptions',
            model: 'Subscription',
            populate: [{
                path: 'team',
                model: 'Team',
                populate: [{
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
                }]
            }]
        }]
    }, {
        path: 'subscription',
        model: 'Subscription',
        populate: [{
            path: 'team',
            model: 'Team',
            populate: [{
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
            }]
        }]
    }]
}];

/* Create */
Game.addGame = (body, cb) => {
    let game = new Game(body);
    game.save((err) => {
        if (err) {
            cb(err);
        } else {
            cb(null);
        }
    });
};

/* Read (all games) */
Game.getGames = (cb) => {
    Game.find({
            date: {
                $gt: moment().toDate()
            }
        })
        .populate(populateSchema)
        .sort({
            date: 1,
            importance: -1,
            home: 1,
            away: 1
        })
        .exec((err, docs) => {
            if (err) {
                cb(err, null);
            } else {
                cb(null, docs);
            }
        });
};

Game.getFeaturedGames = (competition, cb) => {
    Game.find({
            competition: competition,
            date: {
                $gt: moment().toDate()
            }
        })
        .limit(6)
        .populate(populateSchema)
        .sort({
            date: 1
        })
        .exec((err, docs) => {
            if (err) {
                cb(err, null);
            } else {
                cb(null, docs);
            }
        });
};

Game.getGamesByCompetition = (competition, cb) => {
    Game.find({
            competition: competition,
            date: {
                $gt: moment().toDate()
            }
        })
        .populate(populateSchema)
        .sort({
            date: 1
        })
        .exec(function(err, docs) {
            if (err) {
                cb(err, null);
            } else {
                cb(null, docs);
            }
        });
};

Game.getGamesByCountryForThisWeek = (country, cb) => {
    Competition.getCompetitionsByCountry(country, (err, docs) => {
        if (err || !docs) {
            cb(err);
        } else {
            let ids = docs.map((doc) => {
                return doc._id;
            });

            Game.find({
                    competition: {
                        $in: ids
                    },
                    date: {
                        $gt: moment().toDate(),
                        $lt: moment().add(7, 'days').toDate()
                    }
                })
                .populate(populateSchema)
                .sort({
                    date: 1
                })
                .exec((err, docs) => {
                    if (err) {
                        cb(err, null);
                    } else {
                        cb(null, docs);
                    }
                });
        }
    });
};

Game.getGamesByCompetitionForThisWeek = (competition, cb) => {
    Game.find({
            competition: competition,
            date: {
                $gt: moment().toDate(),
                $lt: moment().add(7, 'days').toDate()
            }
        })
        .populate(populateSchema)
        .sort({
            date: 1
        })
        .exec((err, docs) => {
            if (err) {
                cb(err, null);
            } else {
                cb(null, docs);
            }
        });
};

Game.getGamesByTeam = (team, cb) => {
    Game.find({
            home: team,
            date: {
                $gt: moment().toDate()
            }
        })
        .populate(populateSchema)
        .sort({
            date: 1
        })
        .exec((err, docs) => {
            if (err) {
                cb(err, null);
            } else {
                cb(null, docs);
            }
        });
};

/* Read (one game) */
Game.getGameById = (id, cb) => {
    Game.findById(id)
        .populate(populateSchema)
        .exec((err, docs) => {
            if (err) {
                cb(err, null);
            } else {
                cb(null, docs);
            }
        });
};

/* Loans */
Game.toggleLoans = (game, loan, cb) => {
    game.loans.toggleAndSort(loan);
    game.save((err) => {
        if (err) {
            cb(err);
        } else {
            cb(null);
        }
    });
};

/* Helper */
Array.prototype.toggleAndSort = function(value) {
    let i = this.findIndex(item => item._id === value);

    if (i === -1) {
        this.push(value);
    } else {
        this.splice(i, 1);
    }

    this.sort((a, b) => {
        return a - b;
    });
};

/* Update */
Game.updateGame = (game, body, cb) => {
    _.merge(game, body);
    game.save((err) => {
        if (err) {
            cb(err);
        } else {
            cb(null);
        }
    });
};

/* Delete */
Game.deleteGame = (id, cb) => {
    Game.findById(id, (err, docs) => {
        if (err || !docs) {
            cb(err);
        } else {
            docs.remove(cb);
        }
    });
};

Game.deleteGamesByTeam = (team, cb) => {
    Game.find({
            home: team
        })
        .exec((err, docs) => {
            if (err) {
                cb(err);
            } else if (docs.length !== 0) {
                docs.forEach((doc) => {
                    doc.remove(cb);
                });
            } else {
                cb(null);
            }
        });
};

module.exports = Game;