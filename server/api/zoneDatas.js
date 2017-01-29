const express = require('express'),
    moment = require('moment'),
    jwt = require('jwt-simple'),
    authenticate = require('../middleware/authenticate'),
    admin = require('../middleware/admin'),
    loadUser = require('../middleware/loadUser'),
    bodyValidator = require('../helpers/bodyValidator'),
    ZoneData = require('../models/ZoneData');

let router = express.Router();

/* Get all zone datas - ADMIN ONLY */
router.get("/zone/data/all", authenticate, admin, (req, res) => {
    if (req.granted) {
        ZoneData.getZoneDatasByUserId(req.user._id, (err, zoneData) => {
            if (err) {
                res.json({
                    info: "Error during retrieving zone datas",
                    success: false,
                    error: err.errmsg
                });
            } else if (zoneData) {
                res.json({
                    info: "Zone datas successfully retrieved",
                    success: true,
                    data: zoneData
                });
            } else {
                res.json({
                    info: "Zone datas not found",
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

/* Get zone by street and city */
router.post("/zone/data", authenticate, loadUser, (req, res) => {
    if (req.granted) {
        if (Object.keys(req.body).length !== 2 || bodyValidator(req.body.street, req.body.city)) {
            res.json({
                info: "Please supply all required fields",
                success: false
            });
        } else {
            ZoneData.getZoneByStreetCity(req.body.street, req.body.city, (err, zone) => {
                if (err) {
                    res.json({
                        info: "Error during retrieving zone",
                        success: false,
                        error: err.errmsg
                    });
                } else if (zone) {
                    res.json({
                        info: "Zone successfully retrieved",
                        success: true,
                        data: zone
                    });
                } else {
                    res.json({
                        info: "No zone found",
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

/* Get zoneData by id - ADMIN ONLY */
router.get("/zone/data/id/:id", authenticate, admin, (req, res) => {
    if (req.granted) {
        ZoneData.getZoneDataById(req.params.id, (err, zoneData) => {
            if (err) {
                res.json({
                    info: "Error during reading zone data",
                    success: false,
                    error: err.errmsg
                });
            } else if (zoneData) {
                res.json({
                    info: "Zone data found successfully",
                    success: true,
                    data: zoneData
                });
            } else {
                res.json({
                    info: "Zone data not found",
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

/* Create zone data - ADMIN ONLY */
router.post("/zone/create/data", authenticate, admin, (req, res) => {
    if (Object.keys(req.body).length !== 3 || bodyValidator(req.body.zone_id, req.body.street, req.body.city)) {
        res.json({
            info: "Please supply all required fields",
            success: false
        });
    } else {
        ZoneData.addZoneData(req.body, (err, zoneData) => {
            if (err) {
                res.json({
                    info: "Error during creating zone data: name could be already in use or there might be some validation errors",
                    success: false,
                    error: err.errmsg
                });
            } else {
                res.json({
                    info: "Zone data created successfully",
                    success: true
                });
            }
        });
    }
});

/* Update - ADMIN ONLY */
router.put("/zone/data", authenticate, admin, (req, res) => {
    if (req.granted) {
        if (Object.keys(req.body).length !== 4 || bodyValidator(req.body.id, req.body.zone_id, req.body.street, req.body.city)) {
            res.json({
                info: "Please supply all required fields",
                success: false
            });
        } else {
            ZoneData.getZoneDataByStreetCity(req.body.street, req.body.city, (err, zoneData) => {
                if (err) {
                    res.json({
                        info: "Error during reading zone data",
                        success: false,
                        error: err.errmsg
                    });
                } else if (zoneData) {
                    ZoneData.updateZoneData(zoneData, req.body, (err) => {
                        if (err) {
                            res.json({
                                info: "Error during updating zone data" + err,
                                success: false,
                                error: err.errmsg
                            });
                        } else {
                            res.json({
                                info: "Zone data updated successfully",
                                success: true
                            });
                        }
                    });
                } else {
                    res.json({
                        info: "Zone data not found",
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

/* Delete - ADMIN ONLY */
router.delete("/zone/data", authenticate, admin, (req, res) => {
    if (req.granted) {
        if (Object.keys(req.body).length !== 1 || bodyValidator(req.body.id)) {
            res.json({
                info: "Please supply a zoneData id",
                success: false
            });
        } else {
            ZoneData.getZoneDataById(req.body.id, (err, zoneData) => {
                if (err) {
                    res.json({
                        info: "Zone data not found",
                        success: false
                    });
                } else {
                    ZoneData.deleteZoneData(req.body.id, (err) => {
                        if (err) {
                            res.json({
                                info: "Error during deleting zone data",
                                success: false,
                                error: err.errmsg
                            });
                        } else {
                            res.json({
                                info: "Zone data deleted succesfully",
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