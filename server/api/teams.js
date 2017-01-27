const express = require('express'),
    authenticate = require('../middleware/authenticate'),
    admin = require('../middleware/admin'),
    formParser = require('../middleware/formParser'),
    imageSaver = require('../middleware/imageSaver'),
    loadUser = require('../middleware/loadUser'),
    bodyValidator = require('../helpers/bodyValidator'),
	cache = require('../helpers/caching'),
    Team = require('../models/Teams'),
    Address = require('../models/Addresses'),
    User = require('../models/Users');

let router = express.Router();

/* Create */
router.post("/teams", authenticate, admin, formParser, imageSaver, (req, res) => {
    if (req.granted) {
        if (Object.keys(req.body).length !== 12 || bodyValidator(req.body.address, req.body.background, req.body.city, req.body.competition, req.body.country, req.body.logo, req.body.name, req.body.number, req.body.postal, req.body.price, req.body.stadion, req.body.street)) {
            res.json({
                info: "Please supply all required fields",
                success: false
            });
        } else {
            Address.addOrUpdateAddress(req.body.address, req.body, (err, id) => {
                if (err || !id) {
                    res.json({
                        info: "Error during creating/updating address",
                        success: false,
                        error: err.errmsg
                    });
                } else {
                    req.body.address = id;
                    Team.addTeam(req.body, (err) => {
                        if (err) {
                            res.json({
                                info: "Error during creating team",
                                success: false,
                                error: err.errmsg
                            });
                        } else {
                            res.json({
                                info: "Team created succesfully",
                                success: true
                            });
                            cache.del('/api/teams/*', (err, count) => {
                                if (err) {
                                    console.error(err);
                                } else {
                                    console.log("Cache for /api/teams cleared");
                                }
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

/* Read (all teams) */
router.get("/teams", cache.route('/api/teams/all'), (req, res) => {
    Team.getTeams((err, teams) => {
        if (err) {
            res.json({
                info: "Error during reading teams",
                success: false,
                error: err.errmsg
            });
        } else if (teams) {
            res.json({
                info: "Teams found succesfully",
                success: true,
                data: teams
            });
        } else {
            res.json({
                info: "Teams not found",
                success: false
            });
        }
    });
});


router.get("/teams/competition/:competition", cache.route(), (req, res) => {
    Team.getTeamsByCompetition(req.params.competition, (err, teams) => {
        if (err) {
            res.json({
                info: "Error during reading teams",
                success: false,
                error: err.errmsg
            });
        } else if (teams) {
            res.json({
                info: "Teams found succesfully",
                success: true,
                data: teams
            });
        } else {
            res.json({
                info: "Teams not found",
                success: false
            });
        }
    });

});

router.get("/teams/country/:country", cache.route(), (req, res) => {
    Team.getTeamsByCountry(req.params.country, (err, teams) => {
        if (err) {
            res.json({
                info: "Error during reading teams",
                success: false,
                error: err.errmsg
            });
        } else if (teams) {
            res.json({
                info: "Teams found succesfully",
                success: true,
                data: teams
            });
        } else {
            res.json({
                info: "Teams not found",
                success: false
            });
        }
    });
});

/* Read (one team) */
router.get("/teams/:id", cache.route(), (req, res) => {
    Team.getTeamById(req.params.id, (err, team) => {
        if (err) {
            res.json({
                info: "Error during reading team",
                success: false,
                error: err.errmsg
            });
        } else if (team) {
            res.json({
                info: "Team found succesfully",
                success: true,
                data: team
            });
        } else {
            res.json({
                info: "Team not found",
                success: false
            });
        }
    });
});

/* Update */
router.put("/teams/:id", authenticate, admin, formParser, imageSaver, (req, res) => {
    if (req.granted) {
        if (Object.keys(req.body).length !== 12 || bodyValidator(req.body.address, req.body.background, req.body.city, req.body.competition, req.body.country, req.body.logo, req.body.name, req.body.number, req.body.postal, req.body.price, req.body.stadion, req.body.street)) {
            res.json({
                info: "Please supply all required fields",
                success: false
            });
        } else {
            Team.getTeamById(req.params.id, (err, team) => {
                if (err) {
                    res.json({
                        info: "Error during reading team",
                        success: false,
                        error: err.errmsg
                    });
                } else if (team) {
                    Address.addOrUpdateAddress(req.body.address, req.body, (err, id) => {
                        if (err || !id) {
                            res.json({
                                info: "Error during creating/updating address",
                                success: false,
                                error: err.errmsg
                            });
                        } else {
                            req.body.address = id;
                            Team.updateTeam(team, req.body, (err) => {
                                if (err) {
                                    res.json({
                                        info: "Error during updating team",
                                        success: false,
                                        error: err.errmsg
                                    });
                                } else {
                                    res.json({
                                        info: "Team updated succesfully",
                                        success: true
                                    });
                                    cache.del('/api/teams/*', (err, count) => {
                                        if (err) {
                                            console.error(err);
                                        } else {
                                            console.log("Cache for /api/teams cleared");
                                        }
                                    });
                                }
                            });
                        }
                    });
                } else {
                    res.json({
                        info: "Team not found",
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

/* Favorite */
router.post("/teams/favorite/:id", authenticate, loadUser, (req, res) => {
    if (req.granted) {
        User.toggleFavorite(req.user, req.params.id, (err, user) => {
            if (err) {
                res.json({
                    info: "Error during favoriting team",
                    success: false,
                    error: err.errmsg
                });
            } else {
                res.json({
                    info: "Team favorited succesfully",
                    success: true,
                    data: user
                });
                cache.del('/api/users/*', (err, count) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log("Cache for /api/users cleared");
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

/* Delete */
router.delete("/teams/:id", authenticate, admin, (req, res) => {
    if (req.granted) {
        Team.deleteTeam(req.params.id, (err) => {
            if (err) {
                res.json({
                    info: "Error during deleting team",
                    success: false,
                    error: err.errmsg
                });
            } else {
                res.json({
                    info: "Team deleted succesfully",
                    success: true
                });
                cache.del('/api/teams/*', (err, count) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log("Cache for /api/teams cleared");
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

router.delete("/teams/references/:id", authenticate, admin, (req, res) => {
    if (req.granted) {
        Team.deleteTeamReferences(req.params.id, (err) => {
            if (err) {
                res.json({
                    info: "Error during deleting team references",
                    success: false,
                    error: err.errmsg
                });
            } else {
                res.json({
                    info: "Team references deleted succesfully",
                    success: true
                });
                cache.del('/api/teams/*', (err, count) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log("Cache for /api/teams cleared");
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