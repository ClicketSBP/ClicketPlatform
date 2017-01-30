const express = require('express'),
    moment = require('moment'),
    jwt = require('jwt-simple'),
    authenticate = require('../middleware/authenticate'),
    admin = require('../middleware/admin'),
    loadUser = require('../middleware/loadUser'),
    bodyValidator = require('../helpers/bodyValidator'),
    zoneCalculator = require('../middleware/zoneCalculator'),
    Session = require('../models/Session'),
    User = require('../models/User'),
    sessionPrice = require('../helpers/sessionPrice'),
    config = require('../../config/clicket.config'),
    notifications = require('../helpers/notifications');

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

/* Get recent sessions through user_id via token */
router.post("/sessions/recent", authenticate, loadUser, (req, res) => {
    if (req.granted) {
        if (Object.keys(req.body).length !== 1 || bodyValidator(req.body.amount)) {
            res.json({
                info: "Please supply all required fields",
                success: false
            });
        } else {
            Session.getRecentSessionsByUserId(req.user._id, req.body.amount, (err, sessions) => {
                if (err) {
                    res.json({
                        info: "Error during retrieving recent sessions",
                        success: false,
                        error: err.errmsg
                    });
                } else if (sessions) {
                    res.json({
                        info: "Successfully retrieved recent sessions",
                        success: true,
                        data: sessions
                    });
                } else {
                    res.json({
                        info: "Recent sessions not found",
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

/* Check if session is active */
router.post("/session/check/active", authenticate, loadUser, (req, res) => {
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
                    sessionPrice.calculatePrice(session, (data) => {
                        res.json({
                            info: "Price successfully calculated",
                            success: true,
                            data: data
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

/* Calculate total amount all sessions */
router.get("/sessions/price/all", authenticate, loadUser, (req, res) => {
    if (req.granted) {
        Session.getSessionsByUserId(req.user._id, (err, sessions) => {
            if (err) {
                res.json({
                    info: "Error during reading sessions",
                    success: false,
                    error: err.errmsg
                });
            } else if (sessions) {
                let totalData = {
                    time: {
                        hoursParked: 0,
                        minutesParked: 0
                    },
                    price: {
                        'parkCosts': 0,
                        'transactionCosts': 0,
                        'total': 0
                    }
                };

                sessions.forEach((ses) => {
                    if (!ses.active) {
                        sessionPrice.calculatePrice(ses, (data) => {
                            totalData.time.hoursParked += data.time.hoursParked;
                            totalData.time.minutesParked += data.time.minutesParked;
                            totalData.price.parkCosts += data.price.parkCosts;
                            totalData.price.transactionCosts += config.prices.costsPerTransaction;
                            totalData.price.total += (config.prices.costsPerTransaction + data.price.parkCosts);
                        });
                    }
                });

                res.json({
                    info: "Successfully calculated all sessions",
                    success: true,
                    data: totalData
                });
            } else {
                res.json({
                    info: "No sessions found for you",
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
    if (req.granted) {
        if (Object.keys(req.body).length !== 3 || bodyValidator(req.body.car_id, req.body.lat, req.body.lng)) {
            res.json({
                info: "Please supply all required fields",
                success: false
            });
        } else {
            if (req.zone == -1) {
                res.status(404);
                res.json({
                    info: "Zone not found",
                    success: false
                });
            } else {
                req.body.zone_id = req.zone._id;
                req.body.user_id = req.user._id;

                Session.addSession(req.body, (err, session) => {
                    if (err) {
                        res.json({
                            info: "Error during creating session: there might be some validation errors",
                            success: false,
                            error: err.errmsg
                        });
                    } else {
                        notifications.notifyStartProvider(session, (err, providerRes) => {
                            if (err) {
                                res.json({
                                    info: "Error during notifying provider: " + config.zoneProviders.devEnv,
                                    success: false,
                                    error: err
                                });
                            } else {
                                notifications.notifyStartCustomer(session, (err, customerRes) => {
                                    if (err) {
                                        res.json({
                                            info: "Error during notifying customer: " + session.user_id.phone,
                                            success: false,
                                            error: err
                                        });
                                    }
                                });
                            }
                        });
                        res.json({
                            info: "Session created successfully",
                            success: true,
                            data: session
                        });
                    }
                });
            }
        }
    } else {
        res.status(403);
        res.json({
            info: "Unauthorized",
            success: false
        });
    }
});

/* Update */
router.put("/session", authenticate, loadUser, (req, res) => {
    if (req.granted) {
        if (Object.keys(req.body).length !== 4 || bodyValidator(req.body.id, req.body.car_id, req.body.lat, req.body.lng)) {
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
                    if (session.user_id._id == req.user._id) {
                        req.body.user_id = req.user._id;
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
                    if (req.user._id == session.user_id._id) {
                        if (session.active === true) {
                            session.active = !session.active;
                            session.stopped_on = moment().toISOString();

                            Session.updateSession(session, req.body, (err) => {
                                if (err) {
                                    res.json({
                                        info: "Error during updating active state",
                                        success: false,
                                        error: err.errmsg
                                    });
                                } else {
                                    sessionPrice.calculatePrice(session, (data) => {
                                        notifications.notifyStopProvider(session, (err, providerData) => {
                                            if (err) {
                                                res.json({
                                                    info: "Error during notifying provider: " + config.zoneProviders.devEnv,
                                                    success: false,
                                                    error: err
                                                });
                                            } else {
                                                notifications.notifyStopCustomer(session, data, (err, customerData) => {
                                                    if (err) {
                                                        res.json({
                                                            info: "Error during notifying customer: " + session.user_id.phone,
                                                            success: false,
                                                            error: err
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                        User.addInvoiceAmount(session.user_id, data.price.total, (err) => {
                                            if (err) {
                                                res.json({
                                                    info: "Error during adding invoice amount",
                                                    success: false,
                                                    error: err
                                                });
                                            } else {
                                                res.json({
                                                    info: "Session active updated successfully",
                                                    success: true,
                                                    data: {
                                                        session: session,
                                                        info: data
                                                    }
                                                });
                                            }
                                        });
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
                            info: "Unauthorized to session active state",
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

module.exports = router;;