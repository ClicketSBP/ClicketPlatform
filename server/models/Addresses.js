const mongoose = require('mongoose'),
    _ = require('lodash'),
    addressSchema = require('../schemas/Addresses');

let Address = mongoose.model('Address', addressSchema, 'Addresses');

const populateSchema = {
    path: 'country'
};

/* Create */
Address.addAddress = (body, cb) => {
    let address = new Address(body);
    address.save((err) => {
        if (err) {
            cb(err);
        } else {
            cb(null);
        }
    });
};

/* Read (all addresses) */
Address.getAddresses = (cb) => {
    Address.find({})
        .populate(populateSchema)
        .sort({
            country: 1,
            postal: 1,
            city: 1,
            street: 1,
            number: 1
        })
        .exec((err, docs) => {
            if (err) {
                cb(err, null);
            } else {
                cb(null, docs);
            }
        });
};

Address.getAddressesByCountry = (country, cb) => {
    Address.find({
            country: country
        })
        .populate(populateSchema)
        .sort({
            postal: 1,
            city: 1,
            street: 1,
            number: 1
        })
        .exec((err, docs) => {
            if (err) {
                cb(err, null);
            } else {
                cb(null, docs);
            }
        });
};

/* Read (one address) */
Address.getAddressById = (id, cb) => {
    Address.findById(id)
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
Address.updateAddress = (address, body, cb) => {
    _.merge(address, body);
    address.save((err) => {
        if (err) {
            cb(err);
        } else {
            cb(null);
        }
    });
};

/* Delete */
Address.deleteAddress = (id, cb) => {
    Address.findById(id, (err, docs) => {
        if (err || !docs) {
            cb(err);
        } else {
            docs.remove(cb);
        }
    });
};

/* Create or update */
Address.addOrUpdateAddress = (id, body, cb) => {
    if (id === -1) {
        let address = new Address(body);
        address.save((err, docs) => {
            if (err || !docs) {
                cb(err, null);
            } else {
                cb(null, docs._id);
            }
        });
    } else {
        Address.findById(id, (err, docs) => {
            if (err || !docs) {
                cb(err, null);
            } else {
                _.merge(docs, body);
                docs.save((err, docs) => {
                    if (err || !docs) {
                        cb(err, null);
                    } else {
                        cb(null, docs._id);
                    }
                });
            }
        });
    }
};

module.exports = Address;