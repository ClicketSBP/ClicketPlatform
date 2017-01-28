const mongoose = require('mongoose'),
    mongooseHidden = require('mongoose-hidden')({
        defaultHidden: {
            __v: true,
            created_at: true,
            updated_at: true
        }
    }),
    autoIncrement = require('mongoose-increment');

const zoneSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    }
}, {
    _id: false,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

zoneSchema.plugin(mongooseHidden);
zoneSchema.plugin(autoIncrement, {
    modelName: 'Zone',
    fieldName: '_id'
});

module.exports = zoneSchema;