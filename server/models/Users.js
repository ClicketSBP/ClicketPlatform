const mongoose = require('mongoose'),
    _ = require('lodash'),
    userSchema = require('../schemas/Users');

let User = mongoose.model('User', userSchema, 'Users');

const populateSchema = [{
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
}];

/* Create */
User.addUser = (body, cb) => {
    let user = new User(body);
    user.save((err, docs) =>{
        if (err) {
            cb(err, null);
        } else {
            cb(null, docs);
        }
    });
};

/* Read (all users) */
User.getUsers = (cb) => {
    User.find({})
        .populate(populateSchema)
        .sort('username')
        .exec((err, docs) => {
            if (err) {
                cb(err, null);
            } else {
                cb(null, docs);
            }
        });
};

/* Read (one user) */
User.getUserById = (id, cb) => {
    User.findById(id)
        .populate(populateSchema)
        .exec((err, docs) =>{
            if (err) {
                cb(err, null);
            } else {
                cb(null, docs);
            }
        });
};

User.getUserByIdForLogin = (id, cb) => {
    User.findById(id, {
            password: 1,
            email: 1,
            id: 1
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

User.getUserByIdForAuth = (id, cb) => {
    User.findById(id, {
            admin: 1,
            email: 1
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

User.getUserByEmail = (email, cb) => {
    User.findOne({
            email: email
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

User.getUserByEmailForLogin = (email, cb) => {
    User.findOne({
            email: email
        }, {
            password: 1,
            email: 1,
            id: 1

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

User.getUserByEmailForAuth = (email, cb) => {
    User.findOne({
            email: email
        }, {
            admin: 1,
            email: 1
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

User.getUserByUsername = (username, cb) => {
    User.findOne({
            username: username
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

User.getUserByUsernameForLogin = (username, cb) => {
    User.findOne({
            username: username
        }, {
            password: 1,
            email: 1,
            id: 1
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

User.getUserByUsernameForAuth = (username, cb) => {
    User.findOne({
            username: username
        }, {
            admin: 1,
            email: 1
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

/* Favorites */
User.toggleFavorite = (user, favorite, cb) => {
    user.favorites.toggleAndSort(favorite);
    user.save((err, docs) =>{
        if (err || !docs) {
            cb(err, null);
        } else {
            User.populate(docs, populateSchema, (err, docs) => {
                if (err || !docs) {
                    cb(err, null);
                } else {
                    cb(null, docs);
                }
            });
        }
    });
};

/* Subscriptions */
User.toggleSubscription = (user, subscription, cb) => {
    user.subscriptions.toggleAndSort(subscription);
    user.save((err, docs) => {
        if (err || !docs) {
            cb(err, null);
        } else {
            User.populate(docs, populateSchema, (err, docs) => {
                if (err || !docs) {
                    cb(err, null);
                } else {
                    cb(null, docs);
                }
            });
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
User.updateUser = (user, body, cb) => {
    body.email = user.email;
    body.username = user.username;
    _.merge(user, body);
    user.save((err) => {
        if (err) {
            cb(err);
        } else {
            cb(null);
        }
    });
};

User.updateCrucial = (user, body, cb) => {
    _.merge(user, body);
    user.save((err) => {
        if (err) {
            cb(err);
        } else {
            cb(null);
        }
    });
};

/* Delete */
User.deleteUser = (id, cb) => {
    User.findById(id, (err, docs) => {
        if (err) {
            cb(err);
        } else {
            docs.remove(cb);
        }
    });
};

module.exports = User;