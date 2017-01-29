const express = require('express'),
    moment = require('moment'),
    jwt = require('jwt-simple'),
    authenticate = require('../middleware/authenticate'),
    admin = require('../middleware/admin'),
    loadUser = require('../middleware/loadUser'),
    bodyValidator = require('../helpers/bodyValidator'),
    zoneCalculator = require('../middleware/zoneCalculator'),
    Session = require('../models/Session'),
    sessionPrice = require('../helpers/sessionPrice');

let router = express.Router();

/* Get all sessions by user_id via token */
router.get("/sessions/all", authenticate, loadUser, (req, res) => {
    if (req.granted) {
        Session.getSessionsByUserId(req.user._id, (err, session) => {
            if (err) {
                res.json({
                    info: "Error during retrieving sessions",
                    success: false,
                    error: err.errmsg
                });
            } else if (session) {
                res.json({
                    info: "Sessions successfully retrieved",
                    success: true,
                    data: session
                });
            } else {
                res.json({
                    info: "Sessions not found",
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

/* Check if session is active */
router.post("/session/active", authenticate, loadUser, (req, res) => {
    if (req.granted) {
        if (Object.keys(req.body).length !== 1 || bodyValidator(req.body.id)) {
            res.json({
                info: "Please supply all required fields",
                success: false
            });
        } else {
            Session.getSessionById(req.body.id, (err, session) => {
                if (err) {
                    res.json({
                        info: "Error during retrieving sessions",
                        success: false,
                        error: err.errmsg
                    });
                } else if (session) {
                    if (session.user_id._id == req.user._id) {
                        if (session.active) {
                            res.json({
                                info: "Session is active",
                                success: true,
                                data: session
                            });
                        } else if (session.active === false) {
                            res.json({
                                info: "Session is not active anymore",
                                success: false,
                                data: session
                            });
                        }
                    } else {
                        res.status(403);
                        res.json({
                            info: "Unauthorized to check active state",
                            success: false
                        });
                    }
                } else {
                    res.json({
                        info: "Session not found",
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

/* Get session by id - ADMIN ONLY */
router.get("/session/id/:id", authenticate, admin, (req, res) => {
    if (req.granted) {
        Session.getSessionById(req.params.id, (err, session) => {
            if (err) {
                res.json({
                    info: "Error during reading session",
                    success: false,
                    error: err.errmsg
                });
            } else if (session) {
                res.json({
                    info: "Session found successfully",
                    success: true,
                    data: session
                });
            } else {
                res.json({
                    info: "Session not found",
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

/* Calculate price of session */
router.get("/session/price/:id", authenticate, loadUser, (req, res) => {
    if (req.granted) {
        Session.getSessionById(req.params.id, (err, session) => {
            if (err) {
                res.json({
                    info: "Error during reading session",
                    success: false,
                    error: err.errmsg
                });
            } else if (session) {
                if (session.user_id._id == req.user._id) {
                    sessionPrice.calculatePrice(session.started_on, session.stopped_on, session.zone_id.price, (price) => {
                        res.json({
                            info: "Price successfully calculated",
                            success: true,
                            data: price
                        });
                    });
                } else {
                    res.status(403);
                    res.json({
                        info: "Unauthorized to calculate price of given session",
                        success: false
                    });
                }
            } else {
                res.json({
                    info: "Session not found",
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

/* Create session */
router.post("/session", authenticate, loadUser, zoneCalculator, (req, res) => {
    if (Object.keys(req.body).length !== 4 || bodyValidator(req.body.car_id, req.body.lat, req.body.lng, req.body.user_id)) {
        res.json({
            info: "Please supply all required fields",
            success: false
        });
    } else {
        if (req.user._id == req.body.user_id) {
            req.body.zone_id = req.zone._id;
            Session.addSession(req.body, (err, session) => {
                if (err) {
                    res.json({
                        info: "Error during creating session: there might be some validation errors",
                        success: false,
                        error: err.errmsg
                    });
                } else {
                    res.json({
                        info: "Session created successfully",
                        success: true
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
    }
});

/* Update */
router.put("/session", authenticate, loadUser, (req, res) => {
    if (req.granted) {
        if (Object.keys(req.body).length !== 7 || bodyValidator(req.body.id, req.body.car_id, req.body.lat, req.body.lng, req.body.user_id, req.body.active, req.body.stopped_on)) {
            res.json({
                info: "Please supply all required fields",
                success: false
            });
        } else {
            Session.getSessionById(req.body.id, (err, session) => {
                if (err) {
                    res.json({
                        info: "Error during reading session",
                        success: false,
                        error: err.errmsg
                    });
                } else if (session) {
                    if (session.user_id == req.user._id) {
                        Session.updateSession(session, req.body, (err) => {
                            if (err) {
                                res.json({
                                    info: "Error during updating session" + err,
                                    success: false,
                                    error: err.errmsg
                                });
                            } else {
                                res.json({
                                    info: "Session updated successfully",
                                    success: true
                                });
                            }
                        });
                    } else {
                        res.status(403);
                        res.json({
                            info: "Unauthorized to update session",
                            success: false
                        });
                    }
                } else {
                    res.json({
                        info: "Session not found",
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

/* Update session - AMDIN ONLY */
router.put("/session/:id", authenticate, admin, (req, res) => {
    if (req.granted) {
        if (Object.keys(req.body).length !== 6 || bodyValidator(req.body.car_id, req.body.lat, req.body.lng, req.body.user_id, req.body.active, req.body.stopped_on)) {
            res.json({
                info: "Please supply all required fields",
                success: false
            });
        } else {
            Session.getSessionById(req.params.id, (err, session) => {
                if (err) {
                    res.json({
                        info: "Error during reading session",
                        success: false,
                        error: err.errmsg
                    });
                } else if (session) {
                    Session.updateSession(session, req.body, (err) => {
                        if (err) {
                            res.json({
                                info: "Error during updating session",
                                success: false,
                                error: err.errmsg
                            });
                        } else {
                            res.json({
                                info: "Session updated successfully",
                                success: true
                            });
                        }
                    });
                } else {
                    res.json({
                        info: "Session not found",
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

/* Update session active -> set it unactive */
router.post("/session/active", authenticate, loadUser, (req, res) => {
    if (req.granted) {
        if (Object.keys(req.body).length !== 1 || bodyValidator(req.body.id)) {
            res.json({
                info: "Please supply all valid fields",
                success: false
            });
        } else {
            Session.getSessionById(req.body.id, (err, session) => {
                if (err) {
                    res.json({
                        info: "Error during reading session",
                        success: false,
                        error: err.errmsg
                    });
                } else if (session) {
                    if (req.user._id == session.user_id) {
                        if (session.active === true) {
                            session.active = !session.active;
                            session.stopped_on = moment().toISOString();

                            Session.updateSession(session, req.body, (err) => {
                                if (err) {
                                    res.json({
                                        info: "Error during updating session name",
                                        success: false,
                                        error: err.errmsg
                                    });
                                } else {
                                    res.json({
                                        info: "Session active updated successfully",
                                        success: true
                                    });
                                }
                            });
                        } else {
                            res.json({
                                info: "Session not active anymore",
                                success: false
                            });
                        }
                    } else {
                        res.status(403);
                        res.json({
                            info: "Unauthorized to change session name",
                            success: false
                        });
                    }
                } else {
                    res.json({
                        info: "Session not found",
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

/* Delete session - ADMIN ONLY */
router.delete("/session/:id", authenticate, admin, (req, res) => {
    if (req.granted) {
        Session.deleteSession(req.params.id, (err) => {
            if (err) {
                res.json({
                    info: "Error during deleting session",
                    success: false,
                    error: err.errmsg
                });
            } else {
                res.json({
                    info: "Session deleted succesfully",
                    success: true
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