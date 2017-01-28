const mongoose = require('mongoose'),
    _ = require('lodash'),
    zoneDataSchema = require('../schemas/ZoneData');

let ZoneData = mongoose.model('ZoneData', zoneDataSchema, 'ZoneDatas');

const populateSchema = {
    path: 'zone_id'
}

/* Create */
ZoneData.addZoneData = (body, cb) => {
    let zoneData = new ZoneData(body);
    zoneData.save((err) => {
        if (err) {
            cb(err);
        } else {
            cb(null);
        }
    });
};

/* Read (all zoneDatas) */
ZoneData.getZoneDatas = (cb) => {
    ZoneData.find({})
        .sort({
            name: 1,
            street: 1,
            city: 1
        })
        .exec((err, docs) => {
            if (err) {
                cb(err, null);
            } else {
                cb(null, docs);
            }
        });
};

/* Read (get specific zoneData by street and city) */
ZoneData.getZoneDataByStreetCity = (street, city, cb) => {
    ZoneData.findOne({
            street: street,
            city: city
        })
        .sort({
            street: 1,
            city: 1
        })
        .exec((err, docs) => {
            if (err) {
                cb(err, null);
            } else {
                cb(null, docs);
            }
        });
};

/* Read (get specific zone by street and city) */
ZoneData.getZoneByStreetCity = (street, city, cb) => {
    ZoneData.findOne({
            street: street,
            city: city
        })
        .populate(populateSchema)
        .sort({
            street: 1,
            city: 1
        })
        .exec((err, docs) => {
            if (err) {
                cb(err, null);
            } else {
                cb(null, docs);
            }
        });
};

/* Read (one zoneData) */
ZoneData.getZoneDataById = (id, cb) => {
    ZoneData.findById(id)
        .exec((err, docs) => {
            if (err) {
                cb(err, null);
            } else {
                cb(null, docs);
            }
        });
};

/* Update */
ZoneData.updateZoneData = (zoneData, body, cb) => {
    _.merge(zoneData, body);
    zoneData.save((err) => {
        if (err) {
            cb(err);
        } else {
            cb(null);
        }
    });
};

/* Delete */
ZoneData.deleteZoneData = (id, cb) => {
    ZoneData.findById(id, (err, docs) => {
        if (err || !docs) {
            cb(err);
        } else {
            docs.remove(cb);
        }
    });
};

module.exports = ZoneData;