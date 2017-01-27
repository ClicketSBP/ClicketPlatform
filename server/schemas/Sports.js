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

const sportSchema = new mongoose.Schema({
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

sportSchema.pre('remove', function(next) {
    const Competition = require('../models/Competitions');

    let sport = this;
    Competition.deleteCompetitionsBySport(sport._id, (err) => {
        if (err) {
            return next(err);
        } else {
            return next(null);
        }
    });
});

sportSchema.plugin(mongooseHidden);
sportSchema.plugin(autoIncrement, {
    modelName: 'Sport',
    fieldName: '_id'
});

sportSchema.index({
    name: 1
}, {
    unique: true
});

module.exports = sportSchema;