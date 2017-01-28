const mongoose = require('mongoose'),
    mongooseHidden = require('mongoose-hidden')({
        defaultHidden: {
            __v: true,
            created_at: true,
            updated_at: true
        }
    }),
    autoIncrement = require('mongoose-increment');

const zoneDataSchema = new mongoose.Schema({
    zone_id: {
        type: Number,
        required: true,
        ref: 'Zone'
    },
    street: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    }
}, {
    _id: false,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

zoneDataSchema.index({
    street: 1,
    city: 1
}, {
    unique: true
});

zoneDataSchema.plugin(mongooseHidden);
zoneDataSchema.plugin(autoIncrement, {
    modelName: 'ZoneData',
    fieldName: '_id'
});

module.exports = zoneDataSchema;