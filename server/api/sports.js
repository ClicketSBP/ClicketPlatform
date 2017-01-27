const express = require('express'),
    authenticate = require('../middleware/authenticate'),
    admin = require('../middleware/admin'),
    bodyValidator = require('../helpers/bodyValidator'),
	cache = require('../helpers/caching'),
    Sport = require('../models/Sports');

let router = express.Router();

/* Create */
router.post("/sports", authenticate, admin, (req, res) => {
    if (req.granted) {
        if (Object.keys(req.body).length !== 2 || bodyValidator(req.body.name, req.body.featured)) {
            res.json({
                info: "Please supply all required fields",
                success: false
            });
        } else {
            Sport.addSport(req.body, (err) => {
                if (err) {
                    res.json({
                        info: "Error during creating sport",
                        success: false,
                        error: err.errmsg
                    });
                } else {
                    res.json({
                        info: "Sport created succesfully",
                        success: true
                    });
                    cache.del('/api/sports/*', (err, count) => {
                        if (err) {
                            console.error(err);
                        } else {
                            console.log("Cache for /api/sports cleared");
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

/* Read (all sports) */
router.get("/sports", cache.route('/api/sports/all'), (req, res) => {
    Sport.getSports((err, sports) => {
        if (err) {
            res.json({
                info: "Error during reading sports",
                success: false,
                error: err.errmsg
            });
        } else if (sports) {
            res.json({
                info: "Sports found succesfully",
                success: true,
                data: sports
            });
        } else {
            res.json({
                info: "Sports not found",
                success: false
            });
        }
    });
});

router.get("/sports/featured", cache.route('/api/sports/featured'), (req, res) => {
	Sport.getFeaturedSports((err, sports) => {
		if (err) {
            res.json({
                info: "Error during reading sports",
                success: false,
                error: err.errmsg
            });
        } else if (sports) {
            res.json({
                info: "Sports found succesfully",
                success: true,
                data: sports
            });
        } else {
            res.json({
                info: "Sports not found",
                success: false
            });
        }
	});
});

/* Read (one sport) */
router.get("/sports/:id", cache.route(), (req, res) => {
    Sport.getSportById(req.params.id, (err, sport) => {
        if (err) {
            res.json({
                info: "Error during reading sport",
                success: false,
                error: err.errmsg
            });
        } else if (sport) {
            res.json({
                info: "Sport found succesfully",
                success: true,
                data: sport
            });
        } else {
            res.json({
                info: "Sport not found",
                success: false
            });
        }
    });
});

/* Update */
router.put("/sports/:id", authenticate, admin, (req, res) => {
    if (req.granted) {
        if (Object.keys(req.body).length !== 2 || bodyValidator(req.body.name, req.body.featured)) {
            res.json({
                info: "Please supply all required fields",
                success: false
            });
        } else {
            Sport.getSportById(req.params.id, (err, sport) => {
                if (err) {
                    res.json({
                        info: "Error during reading sport",
                        success: false,
                        error: err.errmsg
                    });
                } else if (sport) {
                    Sport.updateSport(sport, req.body, (err) => {
                        if (err) {
                            res.json({
                                info: "Error during updating sport",
                                success: false,
                                error: err.errmsg
                            });
                        } else {
                            res.json({
                                info: "Sport updated succesfully",
                                success: true
                            });
                            cache.del('/api/sport/*', (err, count) => {
                                if (err) {
                                    console.error(err);
                                } else {
                                    console.log("Cache for /api/sports cleared");
                                }
                            });
                        }
                    });
                } else {
                    res.json({
                        info: "Sport not found",
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
router.delete("/sports/:id", authenticate, admin, (req, res) => {
    if (req.granted) {
        Sport.deleteSport(req.params.id, (err) => {
            if (err) {
                res.json({
                    info: "Error during deleting sport",
                    success: false,
                    error: err.errmsg
                });
            } else {
                res.json({
                    info: "Sport deleted succesfully",
                    success: true
                });
                cache.del('/api/sports/*', (err, count) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log("Cache for /api/sports cleared");
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