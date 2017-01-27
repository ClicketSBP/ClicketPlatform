const express = require('express'),
    authenticate = require('../middleware/authenticate'),
    admin = require('../middleware/admin'),
    formParser = require('../middleware/formParser'),
    imageSaver = require('../middleware/imageSaver'),
    bodyValidator = require('../helpers/bodyValidator'),
	cache = require('../helpers/caching'),
    Competition = require('../models/Competitions');

let router = express.Router();

/* Create */
router.post("/competitions", authenticate, admin, formParser, imageSaver, (req, res) => {
    if (req.granted) {
        if (Object.keys(req.body).length !== 5 || bodyValidator(req.body.country, req.body.description, req.body.logo, req.body.name, req.body.sport)) {
            res.json({
                info: "Please supply all required fields",
                success: false
            });
        } else {
            Competition.addCompetition(req.body, (err) => {
                if (err) {
                    res.json({
                        info: "Error during creating competition",
                        success: false,
                        error: err.errmsg
                    });
                } else {
                    res.json({
                        info: "Competition created succesfully",
                        success: true
                    });
                    cache.del('/api/competitions/*', (err, count) => {
                        if (err) {
                            console.error(err);
                        } else {
                            console.log("Cache for /api/competitions cleared");
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

/* Read (all competitions) */
router.get("/competitions", cache.route('/api/competitions/all'), (req, res) => {
    Competition.getCompetitions((err, competitions) => {
        if (err) {
            res.json({
                info: "Error during reading competitions",
                success: false,
                error: err.errmsg
            });
        } else if (competitions) {
            res.json({
                info: "Competitions found succesfully",
                success: true,
                data: competitions
            });
        } else {
            res.json({
                info: "Competitions not found",
                success: false
            });
        }
    });
});

router.get("/competitions/country/:country", cache.route(), (req, res) => {
    Competition.getCompetitionsByCountry(req.params.country, (err, competitions) => {
        if (err) {
            res.json({
                info: "Error during reading competitions",
                success: false,
                error: err.errmsg
            });
        } else if (competitions) {
            res.json({
                info: "Competitions found succesfully",
                success: true,
                data: competitions
            });
        } else {
            res.json({
                info: "Competitions not found",
                success: false
            });
        }
    });
});

router.get("/competitions/sport/:sport", cache.route(), (req, res) => {
    Competition.getCompetitionsBySport(req.params.sport, (err, competitions) => {
        if (err) {
            res.json({
                info: "Error during reading competitions",
                success: false,
                error: err.errmsg
            });
        } else if (competitions) {
            res.json({
                info: "Competitions found succesfully",
                success: true,
                data: competitions
            });
        } else {
            res.json({
                info: "Competitions not found",
                success: false
            });
        }
    });
});

router.get("/competitions/country/:country/sport/:sport", cache.route(), (req, res) => {
    Competition.getCompetitionsByCountryAndSport(req.params.country, req.params.sport, (err, competitions) => {
        if (err) {
            res.json({
                info: "Error during reading competitions",
                success: false,
                error: err.errmsg
            });
        } else if (competitions) {
            res.json({
                info: "Competitions found succesfully",
                success: true,
                data: competitions
            });
        } else {
            res.json({
                info: "Competitions not found",
                success: false
            });
        }
    });
});

/* Read (one competition) */
router.get("/competitions/:id", cache.route(), (req, res) => {
    Competition.getCompetitionById(req.params.id, (err, competition) => {
        if (err) {
            res.json({
                info: "Error during reading competition",
                success: false,
                error: err.errmsg
            });
        } else if (competition) {
            res.json({
                info: "Competition found succesfully",
                success: true,
                data: competition
            });
        } else {
            res.json({
                info: "Competition not found",
                success: false
            });
        }
    });
});

/* Update */
router.put("/competitions/:id", authenticate, admin, formParser, imageSaver, (req, res) => {
    if (req.granted) {
        if (Object.keys(req.body).length !== 5 || bodyValidator(req.body.country, req.body.description, req.body.logo, req.body.name, req.body.sport)) {
            res.json({
                info: "Please supply all required fields",
                success: false
            });
        } else {
            Competition.getCompetitionById(req.params.id, (err, competition) => {
                if (err) {
                    res.json({
                        info: "Error during reading competition",
                        success: false,
                        error: err.errmsg
                    });
                } else if (competition) {
                    Competition.updateCompetition(competition, req.body, (err) => {
                        if (err) {
                            res.json({
                                info: "Error during updating competition",
                                success: false,
                                error: err.errmsg
                            });
                        } else {
                            res.json({
                                info: "Competition updated succesfully",
                                success: true
                            });
                            cache.del('/api/competitions/*', (err, count) => {
                                if (err) {
                                    console.error(err);
                                } else {
                                    console.log("Cache for /api/competitions cleared");
                                }
                            });
                        }
                    });
                } else {
                    res.json({
                        info: "Competition not found",
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
router.delete("/competitions/:id", authenticate, admin, (req, res) => {
    if (req.granted) {
        Competition.deleteCompetition(req.params.id, (err) => {
            if (err) {
                res.json({
                    info: "Error during deleting competition",
                    success: false,
                    error: err.errmsg
                });
            } else {
                res.json({
                    info: "Competition deleted succesfully",
                    success: true
                });
                cache.del('/api/competitions/*', (err, count) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log("Cache for /api/competitions cleared");
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