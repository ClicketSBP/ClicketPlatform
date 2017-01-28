const express = require('express'),
    moment = require('moment'),
    jwt = require('jwt-simple'),
    authenticate = require('../middleware/authenticate'),
    admin = require('../middleware/admin'),
    loadUser = require('../middleware/loadUser'),
    bodyValidator = require('../helpers/bodyValidator'),
    User = require('../models/User');

let router = express.Router();

/* Read (all users) */
router.get("/users/all", authenticate, admin, (req, res) => {
    if (req.granted) {
        User.getUsers((err, users) => {
            if (err) {
                res.json({
                    info: "Error during reading users",
                    success: false,
                    error: err.errmsg
                });
            } else if (users) {
                res.json({
                    info: "Users found successfully",
                    success: true,
                    data: users
                });
            } else {
                res.json({
                    info: "Users not found",
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

/* Read (one user) */
router.get("/users", authenticate, (req, res) => {
    if (req.granted) {
        User.getUserByEmail(req.jwtUser.email, (err, user) => {
            if (err) {
                res.json({
                    info: "Error during reading user",
                    success: false,
                    error: err.errmsg
                });
            } else if (user) {
                res.json({
                    info: "User found successfully",
                    success: true,
                    data: user
                });
            } else {
                res.json({
                    info: "User not found",
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

router.get("/users/id/:id", authenticate, admin, (req, res) => {
    if (req.granted) {
        User.getUserById(req.params.id, (err, user) => {
            if (err) {
                res.json({
                    info: "Error during reading user",
                    success: false,
                    error: err.errmsg
                });
            } else if (user) {
                res.json({
                    info: "User found successfully",
                    success: true,
                    data: user
                });
            } else {
                res.json({
                    info: "User not found",
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

router.get("/users/email/:email", authenticate, admin, (req, res) => {
    if (req.granted) {
        User.getUserByEmail(req.params.email, (err, user) => {
            if (err) {
                res.json({
                    info: "Error during reading user",
                    success: false,
                    error: err.errmsg
                });
            } else if (user) {
                res.json({
                    info: "User found successfully",
                    success: true,
                    data: user
                });
            } else {
                res.json({
                    info: "User not found",
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

router.get("/users/username/:username", authenticate, (req, res) => {
    if (req.granted) {
        User.getUserByUsername(req.params.username, (err, user) => {
            if (err) {
                res.json({
                    info: "Error during reading user",
                    success: false,
                    error: err.errmsg
                });
            } else if (user) {
                res.json({
                    info: "User found successfully",
                    success: true,
                    data: user
                });
            } else {
                res.json({
                    info: "User not found",
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
router.put("/users", authenticate, (req, res) => {
    if (req.granted) {
        if (Object.keys(req.body).length !== 6 || bodyValidator(req.body.email, req.body.firstname, req.body.name, req.body.phone, req.body.username, req.body.invoice_amount)) {
            res.json({
                info: "Please supply all required fields",
                success: false
            });
        } else {
            User.getUserByEmail(req.jwtUser.email, (err, user) => {
                if (err) {
                    res.json({
                        info: "Error during reading user",
                        success: false,
                        error: err.errmsg
                    });
                } else if (user) {
                    User.updateUser(user, req.body, (err) => {
                        if (err) {
                            res.json({
                                info: "Error during updating user: " + err,
                                success: false,
                                error: err.errmsg
                            });
                        } else {
                            res.json({
                                info: "User updated successfully",
                                success: true
                            });
                        }
                    });
                } else {
                    res.json({
                        info: "User not found",
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

router.put("/users/:id", authenticate, admin, (req, res) => {
    if (req.granted) {
        if (Object.keys(req.body).length !== 6 || bodyValidator(req.body.email, req.body.firstname, req.body.name, req.body.phone, req.body.username, req.body.invoice_amount)) {
            res.json({
                info: "Please supply all required fields",
                success: false
            });
        } else {
            User.getUserById(req.params.id, (err, user) => {
                if (err) {
                    res.json({
                        info: "Error during reading user",
                        success: false,
                        error: err.errmsg
                    });
                } else if (user) {
                    User.updateUser(user, req.body, (err) => {
                        if (err) {
                            res.json({
                                info: "Error during updating user",
                                success: false,
                                error: err.errmsg
                            });
                        } else {
                            res.json({
                                info: "User updated successfully",
                                success: true
                            });
                        }
                    });
                } else {
                    res.json({
                        info: "User not found",
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

/* Update email */
router.post("/users/update/email", authenticate, (req, res) => {
    if (req.granted) {
        if (Object.keys(req.body).length !== 1 || bodyValidator(req.body.email)) {
            res.json({
                info: "Please supply an email",
                success: false
            });
        } else {
            User.getUserByEmail(req.jwtUser.email, (err, user) => {
                if (err) {
                    res.json({
                        info: "Error during reading user",
                        success: false,
                        error: err.errmsg
                    });
                } else if (user) {
                    User.updateUser(user, req.body, (err) => {
                        if (err) {
                            res.json({
                                info: "Error during updating user",
                                success: false,
                                error: err.errmsg
                            });
                        } else {
                            res.json({
                                info: "User updated successfully",
                                success: true
                            });
                        }
                    });
                } else {
                    res.json({
                        info: "User not found",
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

/* Update password */
router.post("/users/update/password", authenticate, (req, res) => {
    if (req.granted) {
        if (Object.keys(req.body).length !== 2 || bodyValidator(req.body.old_password, req.body.new_password)) {
            res.json({
                info: "Please supply a password",
                success: false
            });
        } else {
            User.getUserByEmailForLogin(req.jwtUser.email, (err, user) => {
                if (err) {
                    res.json({
                        info: "Error during reading user",
                        success: false,
                        error: err.errmsg
                    });
                } else if (user) {
                    user.comparePassword(req.body.old_password, user.password, (err, isMatch) => {
                        if (err || !isMatch) {
                            res.json({
                                info: "Error during updating password, wrong old password",
                                success: false
                            });
                        } else {
                            req.body.password = req.body.new_password;
                            User.updateCrucial(user, req.body, (err) => {
                                if (err) {
                                    res.json({
                                        info: "Error during updating password",
                                        success: false,
                                        error: err.errmsg
                                    });
                                } else {
                                    res.json({
                                        info: "Password updated successfully",
                                        success: true
                                    });
                                }
                            });
                        }
                    });
                } else {
                    res.json({
                        info: "User not found",
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

/* Update invoice amount */
router.put("/users/update/invoice_amount", authenticate, (req, res) => {
    if (req.granted) {
        if (Object.keys(req.body).length !== 1 || bodyValidator(req.body.invoice_amount)) {
            res.json({
                info: "Please supply all required fields",
                success: false
            });
        } else {
            User.getUserByEmail(req.jwtUser.email, (err, user) => {
                if (err) {
                    res.json({
                        info: "Error during reading user",
                        success: false,
                        error: err.errmsg
                    });
                } else if (user) {
                    user.invoice_amount += req.body.invoice_amount;
                    User.updateUser(user, req.body, (err) => {
                        if (err) {
                            res.json({
                                info: "Error while updating invoice amount" + err,
                                success: false,
                                error: err.errmsg
                            });
                        } else {
                            res.json({
                                info: "Added successfully " + req.body.invoice_amount + "euro to the account.",
                                success: true
                            });
                        }
                    });
                } else {
                    res.json({
                        info: "User not found",
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
router.delete("/users", authenticate, loadUser, (req, res) => {
    if (req.granted) {
        User.deleteUser(req.user._id, (err) => {
            if (err) {
                res.json({
                    info: "Error during deleting user",
                    success: false,
                    error: err.errmsg
                });
            } else {
                res.json({
                    info: "User deleted succesfully",
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

router.delete("/users/:id", authenticate, admin, (req, res) => {
    if (req.granted) {
        User.deleteUser(req.params.id, (err) => {
            if (err) {
                res.json({
                    info: "Error during deleting user",
                    success: false,
                    error: err.errmsg
                });
            } else {
                res.json({
                    info: "User deleted succesfully",
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