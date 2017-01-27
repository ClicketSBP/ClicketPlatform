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

const teamSchema = new mongoose.Schema({
    address: {
        type: Number,
        ref: 'Address',
        required: true
    },
    background: {
        type: String,
        required: true,
        trim: true
    },
    competition: {
        type: Number,
        ref: 'Competition',
        required: true
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
    price: {
        type: Number,
        required: true,
        min: 1,
        max: 99
    },
    stadion: {
        type: String,
        required: true,
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


teamSchema.pre('remove', function(next) {
    const Address = require('../models/Addresses'),
        Subscription = require('../models/Subscriptions'),
        Game = require('../models/Games');

    let team = this;
    Address.deleteAddress(team.address, (err) => {
        if (err) {
            return next(err);
        } else {
            Subscription.deleteSubscriptionsByTeam(team._id, (err) => {
                if (err) {
                    return next(err);
                } else {
                    Game.deleteGamesByTeam(team._id, (err) => {
                        if (err) {
                            return next(err);
                        } else {
                            return next(null);
                        }
                    });
                }
            });
        }
    });
});

teamSchema.plugin(autoIncrement, {
    modelName: 'Team',
    fieldName: '_id'
});
teamSchema.plugin(mongooseHidden);

teamSchema.index({
    competition: 1,
    name: 1
}, {
    unique: true
});

module.exports = teamSchema;