const express = require('express'),
    moment = require('moment'),
    jwt = require('jwt-simple'),
    authenticate = require('../middleware/authenticate'),
    admin = require('../middleware/admin'),
    loadUser = require('../middleware/loadUser'),
    bodyValidator = require('../helpers/bodyValidator'),
    Car = require('../models/Car');

let router = express.Router();

/* Get all cars by user_id via token */
router.get("/cars/all", authenticate, loadUser, (req, res) => {
    if (req.granted) {
        Car.getCarsByUserId(req.user._id, (err, car) => {
            if (err) {
                res.json({
                    info: "Error during retrieving cars",
                    success: false,
                    error: err.errmsg
                });
            } else if (car) {
                res.json({
                    info: "Cars successfully retrieved",
                    success: true,
                    data: car
                });
            } else {
                res.json({
                    info: "Cars not found",
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

router.get("/cars/id/:id", authenticate, admin, (req, res) => {
    if (req.granted) {
        Car.getCarById(req.params.id, (err, car) => {
            if (err) {
                res.json({
                    info: "Error during reading car",
                    success: false,
                    error: err.errmsg
                });
            } else if (car) {
                res.json({
                    info: "Car found successfully",
                    success: true,
                    data: car
                });
            } else {
                res.json({
                    info: "Car not found",
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

router.get("/cars/email/:email", authenticate, admin, (req, res) => {
    if (req.granted) {
        Car.getCarByEmail(req.params.email, (err, car) => {
            if (err) {
                res.json({
                    info: "Error during reading car",
                    success: false,
                    error: err.errmsg
                });
            } else if (car) {
                res.json({
                    info: "Car found successfully",
                    success: true,
                    data: car
                });
            } else {
                res.json({
                    info: "Car not found",
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

router.get("/cars/carname/:carname", authenticate, (req, res) => {
    if (req.granted) {
        Car.getCarByCarname(req.params.carname, (err, car) => {
            if (err) {
                res.json({
                    info: "Error during reading car",
                    success: false,
                    error: err.errmsg
                });
            } else if (car) {
                res.json({
                    info: "Car found successfully",
                    success: true,
                    data: car
                });
            } else {
                res.json({
                    info: "Car not found",
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

router.post("/car", (req, res) => {
    if (Object.keys(req.body).length !== 4 || bodyValidator(req.body.license_plate, req.body.name, req.body.default_car, req.body.user_id)) {
        res.json({
            info: "Please supply all required fields",
            success: false
        });
    } else {
        Car.addCar(req.body, (err, car) => {
            if (err) {
                res.json({
                    info: "Error during creating car: license plate could be already in use or there might be some validation errors",
                    success: false,
                    error: err.errmsg
                });
            } else {
                res.json({
                    info: "Car created successfully",
                    success: true
                });
            }
        });
    }
});

/* Update */
router.put("/cars", authenticate, (req, res) => {
    if (req.granted) {
        if (Object.keys(req.body).length !== 10 || bodyValidator(req.body.email, req.body.firstname, req.body.name, req.body.password, req.body.phone, req.body.carname, req.body.invoice_amount)) {
            res.json({
                info: "Please supply all required fields",
                success: false
            });
        } else {
            Car.getCarByEmail(req.jwtUser.email, (err, car) => {
                if (err) {
                    res.json({
                        info: "Error during reading car",
                        success: false,
                        error: err.errmsg
                    });
                } else if (car) {
                    Car.updateCar(car, req.body, (err) => {
                        if (err) {
                            res.json({
                                info: "Error during updating car" + err,
                                success: false,
                                error: err.errmsg
                            });
                        } else {
                            res.json({
                                info: "Car updated successfully",
                                success: true
                            });
                        }
                    });
                } else {
                    res.json({
                        info: "Car not found",
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

router.put("/cars/:id", authenticate, admin, (req, res) => {
    if (req.granted) {
        if (Object.keys(req.body).length !== 10 || bodyValidator(req.body.email, req.body.firstname, req.body.name, req.body.password, req.body.phone, req.body.carname, req.body.invoice_amount)) {
            res.json({
                info: "Please supply all required fields",
                success: false
            });
        } else {
            Car.getCarById(req.params.id, (err, car) => {
                if (err) {
                    res.json({
                        info: "Error during reading car",
                        success: false,
                        error: err.errmsg
                    });
                } else if (car) {
                    Car.updateCar(car, req.body, (err) => {
                        if (err) {
                            res.json({
                                info: "Error during updating car",
                                success: false,
                                error: err.errmsg
                            });
                        } else {
                            res.json({
                                info: "Car updated successfully",
                                success: true
                            });
                        }
                    });
                } else {
                    res.json({
                        info: "Car not found",
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

/* Update carname */
router.post("/cars/update/carname", authenticate, (req, res) => {
    if (req.granted) {
        if (Object.keys(req.body).length !== 1 || bodyValidator(req.body.carname)) {
            res.json({
                info: "Please supply a carname",
                success: false
            });
        } else {
            Car.getCarByEmail(req.jwtUser.email, (err, car) => {
                if (err) {
                    res.json({
                        info: "Error during reading car",
                        success: false,
                        error: err.errmsg
                    });
                } else if (car) {
                    Car.updateCrucial(car, req.body, (err) => {
                        if (err) {
                            res.json({
                                info: "Error during updating carname",
                                success: false,
                                error: err.errmsg
                            });
                        } else {
                            res.json({
                                info: "Carname updated successfully",
                                success: true
                            });
                        }
                    });
                } else {
                    res.json({
                        info: "Car not found",
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
router.post("/cars/update/email", authenticate, (req, res) => {
    if (req.granted) {
        if (Object.keys(req.body).length !== 1 || bodyValidator(req.body.email)) {
            res.json({
                info: "Please supply an email",
                success: false
            });
        } else {
            Car.getCarByEmail(req.jwtUser.email, (err, car) => {
                if (err) {
                    res.json({
                        info: "Error during reading car",
                        success: false,
                        error: err.errmsg
                    });
                } else if (car) {
                    Car.updateCar(car, req.body, (err) => {
                        if (err) {
                            res.json({
                                info: "Error during updating car",
                                success: false,
                                error: err.errmsg
                            });
                        } else {
                            res.json({
                                info: "Car updated successfully",
                                success: true
                            });
                        }
                    });
                } else {
                    res.json({
                        info: "Car not found",
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
router.post("/cars/update/password", authenticate, (req, res) => {
    if (req.granted) {
        if (Object.keys(req.body).length !== 2 || bodyValidator(req.body.old_password, req.body.new_password)) {
            res.json({
                info: "Please supply a password",
                success: false
            });
        } else {
            Car.getCarByEmailForLogin(req.jwtUser.email, (err, car) => {
                if (err) {
                    res.json({
                        info: "Error during reading car",
                        success: false,
                        error: err.errmsg
                    });
                } else if (car) {
                    car.comparePassword(req.body.old_password, car.password, (err, isMatch) => {
                        if (err || !isMatch) {
                            res.json({
                                info: "Error during updating password, wrong old password",
                                success: false
                            });
                        } else {
                            req.body.password = req.body.new_password;
                            Car.updateCrucial(car, req.body, (err) => {
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
                        info: "Car not found",
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
router.put("/cars/update/invoice_amount", authenticate, (req, res) => {
    if (req.granted) {
        if (Object.keys(req.body).length !== 1 || bodyValidator(req.body.invoice_amount)) {
            res.json({
                info: "Please supply all required fields",
                success: false
            });
        } else {
            Car.getCarByEmail(req.jwtUser.email, (err, car) => {
                if (err) {
                    res.json({
                        info: "Error during reading car",
                        success: false,
                        error: err.errmsg
                    });
                } else if (car) {
                    car.invoice_amount += req.body.invoice_amount;
                    Car.updateCar(car, req.body, (err) => {
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
                        info: "Car not found",
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
router.delete("/cars", authenticate, loadUser, (req, res) => {
    if (req.granted) {
        Car.deleteCar(req.car._id, (err) => {
            if (err) {
                res.json({
                    info: "Error during deleting car",
                    success: false,
                    error: err.errmsg
                });
            } else {
                res.json({
                    info: "Car deleted succesfully",
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

router.delete("/cars/:id", authenticate, admin, (req, res) => {
    if (req.granted) {
        Car.deleteCar(req.params.id, (err) => {
            if (err) {
                res.json({
                    info: "Error during deleting car",
                    success: false,
                    error: err.errmsg
                });
            } else {
                res.json({
                    info: "Car deleted succesfully",
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