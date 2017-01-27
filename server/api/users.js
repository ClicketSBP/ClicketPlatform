const express = require('express'),
    moment = require('moment'),
    jwt = require('jwt-simple'),
    authenticate = require('../middleware/authenticate'),
    admin = require('../middleware/admin'),
    formParser = require('../middleware/formParser'),
    imageSaver = require('../middleware/imageSaver'),
    loadUser = require('../middleware/loadUser'),
    bodyValidator = require('../helpers/bodyValidator'),
    cache = require('../helpers/caching'),
    User = require('../models/Users'),
    Address = require('../models/Addresses');

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
router.put("/users", authenticate, formParser, imageSaver, (req, res) => {
    if (req.granted) {
        if (Object.keys(req.body).length !== 10 || bodyValidator(req.body.address, req.body.avatar, req.body.city, req.body.country, req.body.date_of_birth, req.body.national_registry_number, req.body.number, req.body.phone, req.body.postal, req.body.street)) {
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
                    Address.addOrUpdateAddress(req.body.address, req.body, (err, id) => {
                        if (err || !id) {
                            res.json({
                                info: "Error during creating/updating address",
                                success: false,
                                error: err.errmsg
                            });
                        } else {
                            req.body.address = id;
                            User.updateUser(user, req.body, (err) => {
                                if (err) {
                                    res.json({
                                        info: "Error during updating user" + err,
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

router.put("/users/:id", authenticate, admin, formParser, imageSaver, (req, res) => {
    if (req.granted) {
        if (Object.keys(req.body).length !== 10 || bodyValidator(req.body.address, req.body.avatar, req.body.city, req.body.country, req.body.date_of_birth, req.body.national_registry_number, req.body.number, req.body.phone, req.body.postal, req.body.street)) {
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
                    Address.addOrUpdateAddress(req.body.address, req.body, (err, id) => {
                        if (err || !id) {
                            res.json({
                                info: "Error during creating/updating address",
                                success: false,
                                error: err.errmsg
                            });
                        } else {
                            req.body.address = id;
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

/* Update username */
router.post("/users/update/username", authenticate, (req, res) => {
    if (req.granted) {
        if (Object.keys(req.body).length !== 1 || bodyValidator(req.body.username)) {
            res.json({
                info: "Please supply a username",
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
                    User.updateCrucial(user, req.body, (err) => {
                        if (err) {
                            res.json({
                                info: "Error during updating username",
                                success: false,
                                error: err.errmsg
                            });
                        } else {
                            res.json({
                                info: "Username updated successfully",
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
                    User.updateCrucial(user, req.body, (err) => {
                        if (err) {
                            res.json({
                                info: "Error during updating email",
                                success: false,
                                error: err.errmsg
                            });
                        } else {
                            res.json({
                                info: "Email updated successfully",
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