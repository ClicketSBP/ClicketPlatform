const mongoose = require('mongoose'),
    mongooseHidden = require('mongoose-hidden')({
        defaultHidden: {
            __v: true,
            created_at: true,
            updated_at: true
        }
    }),
    autoIncrement = require('mongoose-increment');

const loanSchema = new mongoose.Schema({
    game: {
        type: Number,
        ref: 'Game',
        required: true
    },
	lent: {
        type: Boolean,
        required: true,
        default: false
    },
    lent_by: {
        type: Number,
        ref: 'User'
    },
    lent_on: {
        type: Date
    },
    lent_out_by: {
        type: Number,
        ref: 'User',
        required: true
    },
    paid: {
        type: Boolean,
        required: true,
        default: false
    },
    placed_on: {
        type: Date,
        required: true,
        default: Date.now
    },
    subscription: {
        type: Number,
        ref: 'Subscription',
        required: true
    }
}, {
    _id: false,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

loanSchema.pre('remove', function(next) {
    const Game = require('../models/Games');

    let loan = this;
    Game.getGameById(loan.game, (err, game) => {
        if (err) {
            return next(err);
        } else {
            Game.toggleLoans(game, loan._id, (err) => {
                if (err) {
                    return next(err);
                } else {
                    return next(null);
                }
            });
        }
    });
});

loanSchema.plugin(autoIncrement, {
    modelName: 'Loan',
    fieldName: '_id'
});
loanSchema.plugin(mongooseHidden);

loanSchema.index({
	game: 1,
	lent_out_by: 1,
    subscription: 1
}, {
    unique: true
});

module.exports = loanSchema;