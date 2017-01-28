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