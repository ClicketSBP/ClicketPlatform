const express = require('express'),
    moment = require('moment'),
    jwt = require('jwt-simple'),
    authenticate = require('../middleware/authenticate'),
    admin = require('../middleware/admin'),
    loadUser = require('../middleware/loadUser'),
    bodyValidator = require('../helpers/bodyValidator'),
    Zone = require('../models/Zone'),
    ZoneData = require('../models/ZoneData');

let router = express.Router();

/* Get all zones */
router.get("/zones/all", authenticate, admin, (req, res) => {
    if (req.granted) {
        Zone.getZonesByUserId(req.user._id, (err, zone) => {
            if (err) {
                res.json({
                    info: "Error during retrieving zones",
                    success: false,
                    error: err.errmsg
                });
            } else if (zone) {
                res.json({
                    info: "Zones successfully retrieved",
                    success: true,
                    data: zone
                });
            } else {
                res.json({
                    info: "Zones not found",
                    success: false
                });
            }
        });
    } else {
        res.status(403);
        res.json({
            info: "Unauthorized",
            success: false
        });
    }
});

/* Get zone by id - ADMIN ONLY */
router.get("/zone/id/:id", authenticate, admin, (req, res) => {
    if (req.granted) {
        Zone.getZoneById(req.params.id, (err, zone) => {
            if (err) {
                res.json({
                    info: "Error during reading zone",
                    success: false,
                    error: err.errmsg
                });
            } else if (zone) {
                res.json({
                    info: "Zone found successfully",
                    success: true,
                    data: zone
                });
            } else {
                res.json({
                    info: "Zone not found",
                    success: false
                });
            }
        });
    } else {
        res.status(403);
        res.json({
            info: "Unauthorized",
            success: false
        });
    }
});

/* Create zone - ADMIN ONLY */
router.post("/zone", authenticate, admin, (req, res) => {
    if (Object.keys(req.body).length !== 2 || bodyValidator(req.body.name, req.body.price)) {
        res.json({
            info: "Please supply all required fields",
            success: false
        });
    } else {
        Zone.addZone(req.body, (err, zone) => {
            if (err) {
                res.json({
                    info: "Error during creating zone: name could be already in use or there might be some validation errors",
                    success: false,
                    error: err.errmsg
                });
            } else {
                res.json({
                    info: "Zone created successfully",
                    data: {
                        name: req.body.name,
                        price: req.body.price
                    },
                    success: true
                });
            }
        });
    }
});

/* Update */
router.put("/zone", authenticate, admin, (req, res) => {
    if (req.granted) {
        if (Object.keys(req.body).length !== 3 || bodyValidator(req.body.id, req.body.name, req.body.price)) {
            res.json({
                info: "Please supply all required fields",
                success: false
            });
        } else {
            Zone.getZoneById(req.body.id, (err, zone) => {
                if (err) {
                    res.json({
                        info: "Error during reading zone",
                        success: false,
                        error: err.errmsg
                    });
                } else if (zone) {
                    Zone.updateZone(zone, req.body, (err) => {
                        if (err) {
                            res.json({
                                info: "Error during updating zone" + err,
                                success: false,
                                error: err.errmsg
                            });
                        } else {
                            res.json({
                                info: "Zone updated successfully",
                                success: true
                            });
                        }
                    });
                } else {
                    res.json({
                        info: "Zone not found",
                        success: false,
                    });
                }
            });
        }
    } else {
        res.status(403);
        res.json({
            info: "Unauthorized",
            success: false
        });
    }
});

/* Update zonename */
router.post("/zone/update/name", authenticate, admin, (req, res) => {
    if (req.granted) {
        if (Object.keys(req.body).length !== 3 || bodyValidator(req.body.id, req.body.name, req.body.price)) {
            res.json({
                info: "Please supply all valid fields",
                success: false
            });
        } else {
            Zone.getZoneById(req.body.id, (err, zone) => {
                if (err) {
                    res.json({
                        info: "Error during reading zone",
                        success: false,
                        error: err.errmsg
                    });
                } else if (zone) {
                    zone.name = req.body.name;
                    Zone.updateZone(zone, req.body, (err) => {
                        if (err) {
                            res.json({
                                info: "Error during updating zone name",
                                success: false,
                                error: err.errmsg
                            });
                        } else {
                            res.json({
                                info: "Zone name updated successfully",
                                success: true
                            });
                        }
                    });
                } else {
                    res.json({
                        info: "Zone not found",
                        success: false
                    });
                }
            });
        }
    } else {
        res.status(403);
        res.json({
            info: "Unauthorized",
            success: false
        });
    }
});

/* Delete */
router.delete("/zone", authenticate, admin, (req, res) => {
    if (req.granted) {
        if (Object.keys(req.body).length !== 1 || bodyValidator(req.body.id)) {
            res.json({
                info: "Please supply a zone id",
                success: false
            });
        } else {
            Zone.getZoneById(req.body.id, (err, zone) => {
                if (err) {
                    res.json({
                        info: "Zone not found",
                        success: false
                    });
                } else {
                    Zone.deleteZone(req.body.id, (err) => {
                        if (err) {
                            res.json({
                                info: "Error during deleting zone",
                                success: false,
                                error: err.errmsg
                            });
                        } else {
                            res.json({
                                info: "Zone deleted succesfully",
                                success: true
                            });
                        }
                    });
                }
            });
        }
    } else {
        res.status(403);
        res.json({
            info: "Unauthorized",
            success: false
        });
    }
});

module.exports = router;