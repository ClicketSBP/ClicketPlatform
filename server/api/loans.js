const express = require('express'),
    moment = require('moment'),
    authenticate = require('../middleware/authenticate'),
    admin = require('../middleware/admin'),
    loadUser = require('../middleware/loadUser'),
    bodyValidator = require('../helpers/bodyValidator'),
	cache = require('../helpers/caching'),
    Loan = require('../models/Loans'),
    Game = require('../models/Games');

let router = express.Router();

/* Create */
router.post("/loans", authenticate, loadUser, (req, res) => {
    if (req.granted) {
        if (Object.keys(req.body).length !== 2 || bodyValidator(req.body.subscription, req.body.game)) {
            res.json({
                info: "Please supply all required fields",
                success: false
            });
        } else {
            req.body.lent_out_by = req.user._id;
            Loan.addLoan(req.body, (err, id) => {
                if (err || !id) {
                    res.json({
                        info: "Error during creating loan",
                        success: false,
                        error: err.errmsg
                    });
                } else {
                    Game.getGameById(req.body.game, (err, game) => {
                        if (err) {
                            res.json({
                                info: "Error during creating loan",
                                success: false,
                                error: err.errmsg
                            });
                        } else {
                            Game.toggleLoans(game, id, (err) => {
                                if (err) {
                                    res.json({
                                        info: "Error during creating loan",
                                        success: false,
                                        error: err.errmsg
                                    });
                                } else {
                                    res.json({
                                        info: "Loan created succesfully",
                                        success: true
                                    });
                                    cache.del('/api/loans/*', (err, count) => {
                                        if (err) {
                                            console.error(err);
                                        } else {
                                            console.log("Cache for /api/loans cleared");
                                        }
                                    });
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

/* Read (all games) */
router.get("/loans", cache.route('/api/loans/all'), (req, res) => {
    Loan.getLoans((err, loans) => {
        if (err) {
            res.json({
                info: "Error during reading loans",
                success: false,
                error: err.errmsg
            });
        } else if (loans) {
            res.json({
                info: "Loans found succesfully",
                success: true,
                data: loans
            });
        } else {
            res.json({
                info: "Loans not found",
                success: false
            });
        }
    });
});

router.get("/loans/game/:game", cache.route(), (req, res) => {
    let game = req.params.game;
    Loan.getLoansByGame(game, (err, loans) => {
        if (err) {
            res.json({
                info: "Error during reading loans",
                success: false,
                error: err.errmsg
            });
        } else if (loans) {
            Loan.getAmountOfLoanedOutGames(game, (err, count) => {
                if (err) {
                    res.json({
                        info: "Error during reading loans",
                        success: false,
                        error: err.errmsg
                    });
                } else {
                    res.json({
                        info: "Loans found succesfully",
                        success: true,
                        data: loans,
                        count: count
                    });
                }
            });
        } else {
            res.json({
                info: "Loans not found",
                success: false
            });
        }
    });
});

router.get("/loans/lent_out_by/:lent_out_by", cache.route(), (req, res) => {
    Loan.getLoansByLentOutBy(req.params.lent_out_by, (err, loans) => {
        if (err) {
            res.json({
                info: "Error during reading loans",
                success: false,
                error: err.errmsg
            });
        } else if (loans) {
            res.json({
                info: "Loans found succesfully",
                success: true,
                data: loans
            });
        } else {
            res.json({
                info: "Loans not found",
                success: false
            });
        }
    });
});

router.get("/loans/lent_by/:lent_by", cache.route(), (req, res) => {
    Loan.getLoansByGame(req.params.lent_by, (err, loans) => {
        if (err) {
            res.json({
                info: "Error during reading loans",
                success: false,
                error: err.errmsg
            });
        } else if (loans) {
            res.json({
                info: "Loans found succesfully",
                success: true,
                data: loans
            });
        } else {
            res.json({
                info: "Loans not found",
                success: false
            });
        }
    });
});

/* Read (one game) */
router.get("/loans/:id", cache.route(), (req, res) => {
    Loan.getLoanById(req.params.id, (err, loan) => {
        if (err) {
            res.json({
                info: "Error during reading loan",
                success: false,
                error: err.errmsg
            });
        } else if (loan) {
            res.json({
                info: "Loan found succesfully",
                success: true,
                data: loan
            });
        } else {
            res.json({
                info: "Loan not found",
                success: false
            });
        }
    });
});

/* Update */
router.put("/loans/:id", authenticate, loadUser, (req, res) => {
    if (req.granted) {
        if (Object.keys(req.body).length !== 2 || bodyValidator(req.body.subscription, req.body.game)) {
            res.json({
                info: "Please supply all required fields",
                success: false
            });
        } else {
            Loan.getLoanById(req.params.id, (err, loan) => {
                if (err) {
                    res.json({
                        info: "Error during reading loan",
                        success: false,
                        error: err.errmsg
                    });
                } else if (loan) {
                    Loan.updateLoan(loan, req.body, (err) => {
                        if (err) {
                            res.json({
                                info: "Error during updating loan",
                                success: false,
                                error: err.errmsg
                            });
                        } else {
                            res.json({
                                info: "Loan updated succesfully",
                                success: true
                            });
                            cache.del('/api/loans/*', (err, count) => {
                                if (err) {
                                    console.error(err);
                                } else {
                                    console.log("Cache for /api/loans cleared");
                                }
                            });
                        }
                    });
                } else {
                    res.json({
                        info: "Loan not found",
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

router.put("/loans/lend/:id", authenticate, loadUser, (req, res) => {
    if (req.granted) {
        req.body.lent = true;
        req.body.paid = true;
        req.body.lent_by = req.user._id;
        req.body.lent_on = moment().toDate();
        Loan.getLoanById(req.params.id, (err, loan) => {
            if (err) {
                res.json({
                    info: "Error during reading loan",
                    success: false,
                    error: err.errmsg
                });
            } else if (loan && loan.lent_out_by !== req.body.lent_by) {
                Loan.updateLoan(loan, req.body, (err) => {
                    if (err) {
                        res.json({
                            info: "Error during updating loan",
                            success: false,
                            error: err.errmsg
                        });
                    } else {
                        res.json({
                            info: "Loan updated succesfully",
                            success: true
                        });
                        cache.del('/api/loans/*', (err, count) => {
                            if (err) {
                                console.error(err);
                            } else {
                                console.log("Cache for /api/loans cleared");
                            }
                        });
                    }
                });
            } else {
                res.json({
                    info: "Loan not found or user is trying to lend your own loan",
                    success: false,
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
router.delete("/loans/:id", authenticate, admin, (req, res) => {
    if (req.granted) {
        Loan.deleteLoan(req.params.id, (err) => {
            if (err) {
                res.json({
                    info: "Error during deleting loan",
                    success: false,
                    error: err.errmsg
                });
            } else {
                res.json({
                    info: "Loan deleted succesfully",
                    success: true
                });
                cache.del('/api/loans/*', (err, count) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log("Cache for /api/loans cleared");
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