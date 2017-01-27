const mongoose = require('mongoose'),
    mongooseHidden = require('mongoose-hidden')({
        defaultHidden: {
            __v: true,
            created_at: true,
            updated_at: true
        }
    }),
    autoIncrement = require('mongoose-increment');

const regExp = /^[A-zÀ-ÿ0-9-\s]{2,100}$/;
const descriptionRegExp = /^[A-zÀ-ÿ0-9-\s.,!'/]{2,1000}$/;

const competitionSchema = new mongoose.Schema({
    country: {
        type: Number,
        ref: 'Country',
        required: true
    },
	description: {
        type: String,
        required: true,
        trim: true,
        match: descriptionRegExp
    },
    logo: {
        type: String,
        required: true,
        trim: true
    },
	name: {
        type: String,
        required: true,
        trim: true,
        match: regExp
    },
    sport: {
        type: Number,
        ref: 'Sport',
        required: true
    }
}, {
    _id: false,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

competitionSchema.pre('remove', function(next) {
    const Team = require('../models/Teams');

    let competition = this;
    Team.deleteTeamsByCompetition(competition._id, (err) => {
        if (err) {
            return next(err);
        } else {
            return next(null);
        }
    });
});

competitionSchema.plugin(mongooseHidden);
competitionSchema.plugin(autoIncrement, {
    modelName: 'Competition',
    fieldName: '_id'
});

competitionSchema.index({
    country: 1,
    sport: 1,
    name: 1
}, {
    unique: true
});

module.exports = competitionSchema;