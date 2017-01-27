const mongoose = require('mongoose'),
    mongooseHidden = require('mongoose-hidden')({
        defaultHidden: {
            __v: true,
            created_at: true,
            updated_at: true
        }
    }),
    autoIncrement = require('mongoose-increment');

const gameSchema = new mongoose.Schema({
    away: {
        type: Number,
        ref: 'Team',
        required: true
    },
    banner: {
        type: String,
        required: true,
        trim: true
    },
    competition: {
        type: Number,
        ref: 'Competition',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    home: {
        type: Number,
        ref: 'Team',
        required: true
    },
    importance: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    loans: [{
        type: Number,
        ref: 'Loan'
    }]
}, {
    _id: false,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

gameSchema.pre('remove', function(next) {
    const Loan = require('../models/Loans');

    let game = this;
    Loan.deleteLoansByGame(game._id, (err) => {
        if (err) {
            return next(err);
        } else {
            return next(null);
        }
    });
});

gameSchema.plugin(autoIncrement, {
    modelName: 'Game',
    fieldName: '_id'
});
gameSchema.plugin(mongooseHidden);

gameSchema.index({
    home: 1,
    away: 1,
    competition: 1,
    date: 1
}, {
    unique: true
});

module.exports = gameSchema;