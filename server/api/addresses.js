const express = require('express'),
    authenticate = require('../middleware/authenticate'),
    admin = require('../middleware/admin'),
    bodyValidator = require('../helpers/bodyValidator'),
    cache = require('../helpers/caching'),
    Address = require('../models/Addresses');

let router = express.Router();

/* Create */
router.post("/addresses", authenticate, admin, (req, res) => {
    if (req.granted) {
        if (Object.keys(req.body).length !== 5 || bodyValidator(req.body.city, req.body.country, req.body.number, req.body.postal, req.body.street)) {
            res.json({
                info: "Please supply all required fields",
                success: false
            });
        } else {
            Address.addAddress(req.body, (err) => {
                if (err) {
                    res.json({
                        info: "Error during creating address",
                        success: false,
                        error: err.errmsg
                    });
                } else {
                    res.json({
                        info: "Address created succesfully",
                        success: true
                    });
                    cache.del('/api/addresses/*', (err, count) => {
                        if (err) {
                            console.error(err);
                        } else {
                            console.log("Cache for /api/addresses cleared");
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

/* Read (all addresses) */
router.get("/addresses", authenticate, admin, cache.route('/api/addresses/all'), (req, res) => {
    if (req.granted) {
        Address.getAddresses((err, addresses) => {
            if (err) {
                res.json({
                    info: "Error during reading addresses",
                    success: false,
                    error: err.errmsg
                });
            } else if (addresses) {
                res.json({
                    info: "Addresses found succesfully",
                    success: true,
                    data: addresses
                });
            } else {
                res.json({
                    info: "Addresses not found",
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

router.get("/addresses/country/:country", authenticate, admin, cache.route(), (req, res) => {
    if (req.granted) {
        Address.getAddressesByCountry(req.params.country, (err, addresses) => {
            if (err) {
                res.json({
                    info: "Error during reading addresses",
                    success: false,
                    error: err.errmsg
                });
            } else if (addresses) {
                res.json({
                    info: "Addresses found succesfully",
                    success: true,
                    data: addresses
                });
            } else {
                res.json({
                    info: "Addresses not found",
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

/* Read (one address) */
router.get("/addresses/:id", authenticate, admin, cache.route(), (req, res) => {
    if (req.granted) {
        Address.getAddressById(req.params.id, (err, address) => {
            if (err) {
                res.json({
                    info: "Error during reading address",
                    success: false,
                    error: err.errmsg
                });
            } else if (address) {
                res.json({
                    info: "Address found succesfully",
                    success: true,
                    data: address
                });
            } else {
                res.json({
                    info: "Address not found",
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

/* Update */
router.put("/addresses/:id", authenticate, admin, (req, res) => {
    if (req.granted) {
        if (Object.keys(req.body).length !== 5 || bodyValidator(req.body.city, req.body.country, req.body.number, req.body.postal, req.body.street)) {
            res.json({
                info: "Please supply all required fields",
                success: false
            });
        } else {
            Address.getAddressById(req.params.id, (err, address) => {
                if (err) {
                    res.json({
                        info: "Error during reading address",
                        success: false,
                        error: err.errmsg
                    });
                } else if (address) {
                    Address.updateAddress(address, req.body, (err) => {
                        if (err) {
                            res.json({
                                info: "Error during updating address",
                                success: false,
                                error: err.errmsg
                            });
                        } else {
                            res.json({
                                info: "Address updated succesfully",
                                success: true
                            });
                            cache.del('/api/addresses/*', (err, count) => {
                                if (err) {
                                    console.error(err);
                                } else {
                                    console.log("Cache for /api/addresses cleared");
                                }
                            });
                        }
                    });
                } else {
                    res.json({
                        info: "Address not found",
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

/* Delete */
router.delete("/addresses/:id", authenticate, admin, (req, res) => {
    if (req.granted) {
        Address.deleteAddress(req.params.id, (err) => {
            if (err) {
                res.json({
                    info: "Error during deleting address",
                    success: false,
                    error: err.errmsg
                });
            } else {
                res.json({
                    info: "Address deleted succesfully",
                    success: true
                });
                cache.del('/api/addresses/*', (err, count) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log("Cache for /api/addresses cleared");
                    }
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

module.exports = router;