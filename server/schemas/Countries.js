const mongoose = require('mongoose'),
    mongooseHidden = require('mongoose-hidden')({
        defaultHidden: {
            __v: true,
            created_at: true,
            updated_at: true
        }
    }),
    autoIncrement = require('mongoose-increment');

const regExp = /^[A-zÀ-ÿ-\s]{2,100}$/;

const countrySchema = new mongoose.Schema({
    featured: {
        type: Boolean,
        required: true,
        default: false
    },
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: regExp
    }
}, {
    _id: false,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

countrySchema.pre('remove', function(next) {
    const Competition = require('../models/Competitions');

    let country = this;
    Competition.deleteCompetitionsByCountry(country._id, (err) => {
        if (err) {
            return next(err);
        } else {
            return next(null);
        }
    });
});

countrySchema.plugin(mongooseHidden);
countrySchema.plugin(autoIncrement, {
    modelName: 'Country',
    fieldName: '_id'
});

countrySchema.index({
    name: 1
}, {
    unique: true
});

module.exports = countrySchema;