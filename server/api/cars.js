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

/* Get car by id - ADMIN ONLY */
router.get("/car/id/:id", authenticate, admin, (req, res) => {
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

/* Create car */
router.post("/car", authenticate, loadUser, (req, res) => {
    if (req.granted) {
        if (Object.keys(req.body).length !== 3 || bodyValidator(req.body.license_plate, req.body.name, req.body.default_car)) {
            res.json({
                info: "Please supply all required fields",
                success: false
            });
        } else {
            req.body.user_id = req.user._id;

            //req.body.default_car = parseBoolean(req.body.default_car);
            if (req.body.default_car === 'true' || req.body.default_car === '1') {
                Car.setAllCarsDefault(req.user._id, false, (err, cars) => {
                    if (err) {
                        res.json({
                            info: "Error during resetting default cars",
                            success: false,
                            error: err.errmsg
                        });
                    }
                });
            }
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
    } else {
        res.status(403);
        res.json({
            info: "Unauthorized",
            success: false
        });
    }
});

/* Get default car by user car */
router.get("/car/default", authenticate, loadUser, (req, res) => {
    if (req.granted) {
        Car.getDefaultCarByUserId(req.user._id, (err, car) => {
            if (err) {
                res.json({
                    info: "Error during reading car",
                    success: false,
                    error: err.errmsg
                });
            } else if (car) {
                res.json({
                    info: "Default car found",
                    success: true,
                    data: car
                });
            } else {
                res.json({
                    info: "No default car found",
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
router.put("/car", authenticate, loadUser, (req, res) => {
    if (req.granted) {
        if (Object.keys(req.body).length !== 4 || bodyValidator(req.body.id, req.body.license_plate, req.body.name, req.body.default_car)) {
            res.json({
                info: "Please supply all required fields",
                success: false
            });
        } else {
            Car.getCarById(req.body.id, (err, car) => {
                if (err) {
                    res.json({
                        info: "Error during reading car",
                        success: false,
                        error: err.errmsg
                    });
                } else if (car) {
                    if (car.user_id == req.user._id) {
                        req.body.user_id = req.user._id;

                        //req.body.default_car = parseBoolean(req.body.default_car);
                        if (req.body.default_car === 'true' || req.body.default_car === '1') {
                            Car.setAllCarsDefault(req.user._id, false, (err, cars) => {
                                if (err) {
                                    res.json({
                                        info: "Error during resetting default cars",
                                        success: false,
                                        error: err.errmsg
                                    });
                                }
                            });
                        }

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
                        res.status(403);
                        res.json({
                            info: "Unauthorized to update car",
                            success: false
                        });
                    }
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

/* Update car - AMDIN ONLY */
router.put("/car/:id", authenticate, admin, (req, res) => {
    if (req.granted) {
        if (Object.keys(req.body).length !== 4 || bodyValidator(req.body.license_plate, req.body.name, req.body.default_car, req.body.user_id)) {
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

/* Delete */
router.delete("/car/:id", authenticate, loadUser, (req, res) => {
    if (req.granted) {
        if (Object.keys(req.params).length !== 1 || bodyValidator(req.params.id)) {
            res.json({
                info: "Please supply a car id",
                success: false
            });
        } else {
            Car.getCarById(req.params.id, (err, car) => {
                if (err) {
                    res.json({
                        info: "Car not found",
                        success: false
                    });
                } else {
                    if (car.user_id == req.user._id) {
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
                            info: "Unauthorized to delete this car",
                            success: false
                        });
                    }
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

module.exports = router;