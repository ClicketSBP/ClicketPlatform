const mongoose = require('mongoose'),
    _ = require('lodash'),
    loanSchema = require('../schemas/Loans');

let Loan = mongoose.model('Loan', loanSchema, 'Loans');

const populateSchema = [{
    path: 'game',
    model: 'Game',
    populate: [{
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
    }]
}, {
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
}];

/* Create */
Loan.addLoan = (body, cb) => {
    let loan = new Loan(body);
    loan.save((err, docs) => {
        if (err || !docs) {
            cb(err, null);
        } else {
            cb(null, docs._id);
        }
    });
};

/* Read (all subscriptions) */
Loan.getLoans = (cb) => {
    Loan.find({})
        .populate(populateSchema)
        .exec((err, docs) => {
            if (err) {
                cb(err, null);
            } else {
                cb(null, docs);
            }
        });
};

Loan.getLoansByGame = (game, cb) => {
    Loan.find({
            game: game,
            lent: false
        })
        .populate(populateSchema)
        .exec((err, docs) =>  {
            if (err) {
                cb(err, null);
            } else {
                cb(null, docs);
            }
        });
};

Loan.getAmountOfLoanedOutGames = (game, cb) => {
    Loan.count({
            game: game,
            lent: true
        })
        .exec((err, count) =>  {
            if (err) {
                cb(err, null);
            } else {
                cb(null, count);
            }
        });
};

Loan.getLoansByLentBy = (user, cb) => {
    Loan.find({
            lent_by: user
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

Loan.getLoansByLentOutBy = (user, cb) => {
    Loan.find({
            lent_out_by: user
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

/* Read (one subscription) */
Loan.getLoanById = (id, cb) => {
    Loan.findById(id)
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
Loan.updateLoan = (loan, body, cb) => {
    _.merge(loan, body);
    loan.save((err) => {
        if (err) {
            cb(err);
        }
        cb(null);
    });
};

/* Delete */
Loan.deleteLoan = (id, cb) => {
    Loan.findById(id, (err, docs) => {
        if (err || !docs) {
            cb(err);
        } else {
            docs.remove(cb);
        }
    });
};

Loan.deleteLoansByGame = (game, cb) => {
    Loan.find({
        game: game
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

Loan.deleteLoansByUser = (user, cb) => {
    Loan.find({
        lent_out_by: user
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

module.exports = Loan;