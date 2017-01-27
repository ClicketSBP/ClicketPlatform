const mongoose = require('mongoose'),
    mongooseHidden = require('mongoose-hidden')({
        defaultHidden: {
            __v: true,
			created_at: true,
            updated_at: true
        }
    }),
    autoIncrement = require('mongoose-increment');

const regExpLicPlate = /([1TO]{1}-)?[A-Z]{3}-[0-9]{3}/gm;

const carSchema = new mongoose.Schema({
    license_plate: {
        type: String,
        required: true,
		trim: true,
        match: regExpLicPlate
    },
    name: {
        type: String,
        required: true,
		trim: true
    },
	default_car: {
		type: Boolean,
		required: true,
        default: false
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

carSchema.plugin(mongooseHidden);
carSchema.plugin(autoIncrement, {
    modelName: 'Car',
    fieldName: '_id'
});

module.exports = carSchema;