const express = require('express'),
    authenticate = require('../middleware/authenticate'),
    admin = require('../middleware/admin'),
    formParser = require('../middleware/formParser'),
    imageSaver = require('../middleware/imageSaver'),
    loadUser = require('../middleware/loadUser'),
    bodyValidator = require('../helpers/bodyValidator'),
	cache = require('../helpers/caching'),
    Subscription = require('../models/Subscriptions'),
    User = require('../models/Users');

let router = express.Router();

/* Create */
router.post("/subscriptions", authenticate, formParser, imageSaver, loadUser, (req, res) => {
    if (req.granted) {
        if (Object.keys(req.body).length !== 3 || bodyValidator(req.body.place, req.body.subscription, req.body.team)) {
            res.json({
                info: "Please supply all required fields",
                success: false
            });
        } else {
            req.body.user = req.user._id;
            Subscription.addSubscription(req.body, (err, id) => {
                if (err || !id) {
                    res.json({
                        info: "Error during creating subscription" + err,
                        success: false,
                        error: err.errmsg
                    });
                } else {
                    User.toggleSubscription(req.user, id, (err, user) => {
                        if (err) {
                            res.json({
                                info: "Error during adding subscription",
                                success: false,
                                error: err.errmsg
                            });
                        } else {
                            res.json({
                                info: "Subscription created succesfully",
                                success: true,
                                data: user
                            });
                            cache.del('/api/subscriptions/*', (err, count) => {
                                if (err) {
                                    console.error(err);
                                } else {
                                    console.log("Cache for /api/subscriptions cleared");
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

/* Read (all subscriptions) */
router.get("/subscriptions", authenticate, admin, cache.route('/api/subscriptions/all'), (req, res) => {
    if (req.granted) {
        Subscription.getSubscriptions((err, subscriptions) => {
            if (err) {
                res.json({
                    info: "Error during reading subscriptions",
                    success: false,
                    error: err.errmsg
                });
            } else if (subscriptions) {
                res.json({
                    info: "Subscriptions found succesfully",
                    success: true,
                    data: subscriptions
                });
            } else {
                res.json({
                    info: "Subscriptions not found",
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

router.get("/subscriptions/team/:team", authenticate, admin, cache.route(), (req, res) => {
    if (req.granted) {
        Subscription.getSubscriptionsByTeam(req.params.team, (err, subscriptions) => {
            if (err) {
                res.json({
                    info: "Error during reading subscriptions",
                    success: false,
                    error: err.errmsg
                });
            } else if (subscriptions) {
                res.json({
                    info: "Subscriptions found succesfully",
                    success: true,
                    data: subscriptions
                });
            } else {
                res.json({
                    info: "Subscriptions not found",
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

router.get("/subscriptions/user/:user", authenticate, admin, cache.route(), (req, res) => {
    if (req.granted) {
        Subscription.getSubscriptionsByUser(req.params.user, (err, subscriptions) => {
            if (err) {
                res.json({
                    info: "Error during reading subscriptions",
                    success: false,
                    error: err.errmsg
                });
            } else if (subscriptions) {
                res.json({
                    info: "Subscriptions found succesfully",
                    success: true,
                    data: subscriptions
                });
            } else {
                res.json({
                    info: "Subscriptions not found",
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

/* Read (one subscription) */
router.get("/subscriptions/:id", authenticate, cache.route(), (req, res) => {
    if (req.granted) {
        Subscription.getSubscriptionById(req.params.id, (err, subscription) => {
            if (err) {
                res.json({
                    info: "Error during reading subscription",
                    success: false,
                    error: err.errmsg
                });
            } else if (subscription) {
                res.json({
                    info: "Subscription found succesfully",
                    success: true,
                    data: subscription
                });
            } else {
                res.json({
                    info: "Subscription not found",
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
router.put("/subscriptions/:id", authenticate, formParser, imageSaver, loadUser, (req, res) => {
    if (req.granted) {
        if (Object.keys(req.body).length !== 3 || bodyValidator(req.body.place, req.body.subscription, req.body.team)) {
            res.json({
                info: "Please supply all required fields",
                success: false
            });
        } else {
            Subscription.getSubscriptionById(req.params.id, (err, subscription) => {
                if (err || (req.user.admin === false && req.user._id !== subscription.user)) {
                    res.json({
                        info: "Error during reading subscription",
                        success: false,
                        error: err.errmsg
                    });
                } else if (subscription) {
                    Subscription.updateSubscription(subscription, req.body, (err) => {
                        if (err) {
                            res.json({
                                info: "Error during updating subscription",
                                success: false,
                                error: err.errmsg
                            });
                        } else {
                            res.json({
                                info: "Subscription updated succesfully",
                                success: true
                            });
                            cache.del('/api/subscriptions/*', (err, count) => {
                                if (err) {
                                    console.error(err);
                                } else {
                                    console.log("Cache for /api/subscriptions cleared");
                                }
                            });
                        }
                    });
                } else {
                    res.json({
                        info: "Subscription not found",
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
router.delete("/subscriptions/:id", authenticate, loadUser, (req, res) => {
    if (req.granted) {
        Subscription.deleteSubscription(req.params.id, req.user, (err) => {
            if (err) {
                res.json({
                    info: "Error during deleting subscription",
                    success: false,
                    error: err.errmsg
                });
            } else {
                User.toggleSubscription(req.user, req.params.id, (err, user) => {
                    if (err) {
                        res.json({
                            info: "Error during deleting subscription",
                            success: false,
                            error: err.errmsg
                        });
                    } else {
                        res.json({
                            info: "Subscription deleted succesfully",
                            success: true,
                            data: user
                        });
                        cache.del('/api/subscriptions/*', (err, count) => {
                            if (err) {
                                console.error(err);
                            } else {
                                console.log("Cache for /api/subscriptions cleared");
                            }
                        });
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