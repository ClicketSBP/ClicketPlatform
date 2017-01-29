const mongoose = require('mongoose'),
    _ = require('lodash'),
    userSchema = require('../schemas/User');

let User = mongoose.model('User', userSchema, 'Users');

/* Create */
User.addUser = (body, cb) => {
    let user = new User(body);
    user.save((err, docs) => {
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
        .exec((err, docs) => {
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
            email: 1
        })
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
        .exec((err, docs) => {
            if (err) {
                cb(err, null);
            } else {
                cb(null, docs);
            }
        });
};

/* Update */
User.updateUser = (user, body, cb) => {
    _.merge(user, body);
    user.save((err) => {
        if (err) {
            cb(err);
        } else {
            cb(null);
        }
    });
};

/* Add invoice amount */
User.addInvoiceAmount = (user, invoiceAmount, cb) => {
    //_.merge(user, body);
    user.invoice_amount += parseFloat(invoiceAmount);
    user.save((err) => {
        if (err) {
            cb(err);
        } else {
            cb(null);
        }
    });
};

/* Update invoice amount */
User.updateInvoiceAmount = (user, invoiceAmount, cb) => {
    //_.merge(user, body);
    user.invoice_amount = invoiceAmount;
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