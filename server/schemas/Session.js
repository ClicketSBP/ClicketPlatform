const mongoose = require('mongoose'),
    mongooseHidden = require('mongoose-hidden')({
        defaultHidden: {
            __v: true,
			created_at: true,
            updated_at: true
        }
    }),
    autoIncrement = require('mongoose-increment');

const sessionSchema = new mongoose.Schema({
    car_id: {
        type: Number,
        required: true,
        ref: 'Car'
    },
    gps_coordinates: {
        type: String,
        required: true,
		trim: true
    },
    user_id: {
        type: Number,
        required: true,
		ref: 'User'
    }
}, {
    _id: false,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

sessionSchema.plugin(mongooseHidden);
sessionSchema.plugin(autoIncrement, {
    modelName: 'Session',
    fieldName: '_id'
});

module.exports = sessionSchema;