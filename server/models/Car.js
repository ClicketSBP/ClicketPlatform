const mongoose = require('mongoose'),
    _ = require('lodash'),
    carSchema = require('../schemas/Car');

let Car = mongoose.model('Car', carSchema, 'Cars');

/* Create */
Car.addCar = (body, cb) => {
    let car = new Car(body);
    car.save((err, docs) => {
        if (err) {
            cb(err);
        } else {
            cb(null);
        }
    });
};

/* Read (all cars) */
Car.getCars = (cb) => {
    Car.find({})
        .sort({
            default_car: -1,
            name: 1
        })
        .exec((err, docs) => {
            if (err) {
                cb(err, null);
            } else {
                cb(null, docs);
            }
        });
};

/* Read (get all cars by user id) */
Car.getCarsByUserId = (userid, cb) => {
    Car.find({
            user_id: userid
        })
        .sort({
            default_car: -1,
            name: 1
        })
        .exec((err, docs) => {
            if (err) {
                cb(err, null);
            } else {
                cb(null, docs);
            }
        });
};

/* Read (get default car by user id) */
Car.getDefaultCarByUserId = (userid, cb) => {
    Car.findOne({
            user_id: userid,
            default_car: true
        })
        .sort({
            default_car: -1,
            name: 1
        })
        .exec((err, docs) => {
            if (err) {
                cb(err, null);
            } else {
                cb(null, docs);
            }
        });
};

/* Read (one car) */
Car.getCarById = (id, cb) => {
    Car.findById(id)
        .exec((err, docs) => {
            if (err) {
                cb(err, null);
            } else {
                cb(null, docs);
            }
        });
};

/* Update */
Car.updateCar = (car, body, cb) => {
    _.merge(car, body);
    car.save((err) => {
        if (err) {
            cb(err);
        } else {
            cb(null);
        }
    });
};

/* Update car default */
Car.updateCarDefault = (car, default_car, cb) => {
    //_.merge(car, body);
    car.default_car = default_car;
    car.save((err) => {
        if (err) {
            cb(err);
        } else {
            cb(null);
        }
    });
};

Car.setAllCarsDefault = (user_id, default_cars, cb) => {
    Car.getCarsByUserId(user_id, (err, cars) => {
        if (err) {
            cb(err, null);
        } else {
            cars.forEach((car) => {
                Car.updateCarDefault(car, default_cars, (err) => {
                    cb(err, null);
                });
            });
            cb(null, cars);
        }
    });
};

/* Delete */
Car.deleteCar = (id, cb) => {
    Car.findById(id, (err, docs) => {
        if (err || !docs) {
            cb(err);
        } else {
            docs.remove(cb);
        }
    });
};

module.exports = Car;