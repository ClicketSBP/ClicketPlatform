const mongoose = require('mongoose'),
    _ = require('lodash'),
    zoneSchema = require('../schemas/Zone');

let Zone = mongoose.model('Zone', zoneSchema, 'Zones');

/* Create */
Zone.addZone = (body, cb) => {
    let zone = new Zone(body);
    zone.save((err) => {
        if (err) {
            cb(err);
        } else {
            cb(null);
        }
    });
};

/* Read (all zones) */
Zone.getZones = (cb) => {
    Zone.find({})
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

/* Read (one zone) */
Zone.getZoneById = (id, cb) => {
    Zone.findById(id)
        .exec((err, docs) => {
            if (err) {
                cb(err, null);
            } else {
                cb(null, docs);
            }
        });
};

/* Update */
Zone.updateZone = (zone, body, cb) => {
    _.merge(zone, body);
    zone.save((err) => {
        if (err) {
            cb(err);
        } else {
            cb(null);
        }
    });
};

/* Delete */
Zone.deleteZone = (id, cb) => {
    Zone.findById(id, (err, docs) => {
        if (err || !docs) {
            cb(err);
        } else {
            docs.remove(cb);
        }
    });
};

module.exports = Zone;