const NodeGeocoder = require('node-geocoder'),
    config = require('../../config/clicket.config.js'),
    zoneData = require('../models/ZoneData');


const zoneCalculator = (req, res, next) => {
    let geocoder = NodeGeocoder(config.geocoder);

    geocoder.reverse({
        lat: parseFloat(req.body.lat),
        lon: parseFloat(req.body.lng)
    }, function(err, result) {
        zoneData.getZoneByStreetCity(result[0].streetName, result[0].city, function(err, zone) {
            if (zone) {
                req.zone = zone.zone_id;
            } else {
                req.zone = -1;
            }
            next();
        });
    });
};

module.exports = zoneCalculator;