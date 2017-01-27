const mongoose = require('mongoose'),
    mongooseHidden = require('mongoose-hidden')({
        defaultHidden: {
            __v: true,
			created_at: true,
            updated_at: true
        }
    }),
    autoIncrement = require('mongoose-increment');

const subscriptionSchema = new mongoose.Schema({
    place: {
        type: String,
        required: true,
        trim: true
    },
	subscription: {
		type: String,
		required: true,
		trim: true
	},
    team: {
        type: Number,
        ref: 'Team',
        required: true
    },
    user: {
        type: Number,
        ref: 'User',
        required: true
    }
}, {
    _id: false,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

subscriptionSchema.plugin(autoIncrement, {
	modelName: 'Subscription',
	fieldName: '_id'
});
subscriptionSchema.plugin(mongooseHidden);

subscriptionSchema.index({
	user: 1,
    team: 1,
	place: 1
}, {
    unique: true
});

module.exports = subscriptionSchema;