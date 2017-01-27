const mongoose = require('mongoose'),
    _ = require('lodash'),
    countrySchema = require('../schemas/Countries');

let Country = mongoose.model('Country', countrySchema, 'Countries');

/* Create */
Country.addCountry = (body, cb) => {
    let country = new Country(body);
    country.save((err) => {
        if (err) {
            cb(err);
        } else {
            cb(null);
        }
    });
};

/* Read (all countries) */
Country.getCountries = (cb) => {
    Country.find({})
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

Country.getFeaturedCountries = (cb) => {
    Country.find({
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
Country.getCountryById = (id, cb) => {
    Country.findById(id, (err, docs) => {
        if (err) {
            cb(err, null);
        } else {
            cb(null, docs);
        }
    });
};

/* Update */
Country.updateCountry = (country, body, cb) => {
    _.merge(country, body);
    country.save((err) => {
        if (err) {
            cb(err);
        } else {
            cb(null);
        }
    });
};

/* Delete */
Country.deleteCountry = (id, cb) => {
    Country.findById(id, (err, docs) => {
        if (err || !docs) {
            cb(err);
        } else {
            docs.remove(cb);
        }
    });
};

module.exports = Country;