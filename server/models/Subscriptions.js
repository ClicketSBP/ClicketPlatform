const mongoose = require('mongoose'),
    _ = require('lodash'),
    subscriptionSchema = require('../schemas/Subscriptions');

let Subscription = mongoose.model('Subscription', subscriptionSchema, 'Subscriptions');

const populateSchema = [{
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
}, {
    path: 'user',
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
}];

/* Create */
Subscription.addSubscription = (body, cb) => {
    let subscription = new Subscription(body);
    subscription.save((err, docs) => {
        if (err) {
            cb(err, null);
        } else {
            cb(null, docs._id);
        }
    });
};

/* Read (all subscriptions) */
Subscription.getSubscriptions = (cb) => {
    Subscription.find({})
        .populate(populateSchema)
        .sort({
            team: 1,
            user: 1,
            place: 1
        })
        .exec((err, docs) => {
            if (err) {
                cb(err, null);
            } else {
                cb(null, docs);
            }
        });
};

Subscription.getSubscriptionsByTeam = (team, cb) => {
    Subscription.find({
            team: team
        })
        .populate(populateSchema)
        .sort({
            user: 1,
            place: 1
        })
        .exec((err, docs) => {
            if (err) {
                cb(err, null);
            } else {
                cb(null, docs);
            }
        });
};

Subscription.getSubscriptionsByUser = (user, cb) => {
    Subscription.find({
            user: user
        })
        .populate(populateSchema)
        .sort({
            team: 1,
            place: 1
        })
        .exec((err, docs) => {
            if (err) {
                cb(err, null);
            } else {
                cb(null, docs);
            }
        });
};

/* Read (one subscription) */
Subscription.getSubscriptionById = (id, cb) => {
    Subscription.findById(id)
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
Subscription.updateSubscription = (subscription, body, cb) => {
    _.merge(subscription, body);
    subscription.save((err) => {
        if (err) {
            cb(err);
        } else {
            cb(null);
        }
    });
};

/* Delete */
Subscription.deleteSubscription = (id, user, cb) => {
    Subscription.findById(id, (err, docs) => {
        if (err || !docs || (user.admin === false && user._id !== docs.user)) {
            cb(err);
        } else {
            docs.remove(cb);
        }
    });
};

Subscription.deleteSubscriptionsByTeam = (team, cb) => {
    Subscription.find({
        team: team
    }, (err, docs) => {
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

Subscription.deleteSubscriptionsByUser = (user, cb) =>{
    Subscription.find({
        user: user
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

module.exports = Subscription;