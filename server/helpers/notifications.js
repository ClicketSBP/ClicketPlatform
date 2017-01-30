const config = require('../../config/clicket.config'),
    twilio = require('./twilio'),
    utility = require('./utility'),
    moment = require('moment');

const notifications = (() => {

    /* Session starts -> notify provder */
    const notifyStartProvider = (session, cb) => {
        let providerSyntax = config.notifications.syntaxes.provider.start;
        let placeholders = {
            "%ZONE%": session.zone_id.name,
            "%LICENSE_PLATE%": session.car_id.license_plate
        };

        utility.replaceAll(placeholders, providerSyntax, (res) => {
            twilio.sendSms(config.zoneProviders.devEnv, res, (err, data) => {
                if (err) {
                    cb(err, null);
                } else {
                    cb(null, data);
                }
            });
        });
    };

    /* Session stops -> notify provder */
    const notifyStopProvider = (session, cb) => {
        let providerSyntax = config.notifications.syntaxes.provider.stop;
        let placeholders = {
            "%ZONE%": session.zone_id.name,
            "%LICENSE_PLATE%": session.car_id.license_plate
        };

        utility.replaceAll(placeholders, providerSyntax, (res) => {
            twilio.sendSms(config.zoneProviders.devEnv, res, (err, data) => {
                if (err) {
                    cb(err, null);
                } else {
                    cb(null, data);
                }
            });
        });
    };

    /* Session starts -> notify customer */
    const notifyStartCustomer = (session, cb) => {
        setTimeout(() => {
            let customerResponse = config.notifications.responses.customer.start;
            let placeholders = {
                "%CUSTOMER_NAME%": session.user_id.firstname,
                "%ZONE%": session.zone_id.name,
                "%STARTED_ON%": moment(session.started_on).format("DD/MM/YY HH:mm:ss"),
                "%LICENSE_PLATE%": session.car_id.license_plate,
                "%PRICE_PER_HOUR%": session.zone_id.price
            };

            utility.replaceAll(placeholders, customerResponse, (res) => {
                twilio.sendSms(session.user_id.phone, res, (err, data) => {
                    if (err) {
                        cb(err, null);
                    } else {
                        cb(null, data);
                    }
                });
            });
        }, config.customerInterval);
    };

    /* Session stops -> notify customer */
    const notifyStopCustomer = (session, pricing, cb) => {
        setTimeout(() => {
            let customerResponse = config.notifications.responses.customer.stop;
            let placeholders = {
                "%CUSTOMER_NAME%": session.user_id.firstname,
                "%ZONE%": session.zone_id.name,
                "%STOPPED_ON%": moment(session.stopped_on).format("DD/MM/YY HH:mm:ss"),
                "%PRICE%": parseFloat(pricing.price.total).toFixed(2),
                "%INVOICE_AMOUNT%": parseFloat(session.user_id.invoice_amount).toFixed(2),
                "%TOTAL_MINUTES%": (pricing.time.minutesParked).toFixed(0)
            };

            utility.replaceAll(placeholders, customerResponse, (res) => {
                twilio.sendSms(session.user_id.phone, res, (err, data) => {
                    if (err) {
                        cb(err, null);
                    } else {
                        cb(null, data);
                    }
                });
            });
        }, config.customerInterval);
    };

    /* Session notify on zone not found */
    const notifyZoneNotFound = (user, cb) => {
        let customerResponse = config.notifications.responses.customer.zone_not_found;
        let placeholders = {
            "%CUSTOMER_NAME%": user.firstname
        };

        utility.replaceAll(placeholders, customerResponse, (res) => {
            twilio.sendSms(user.phone, res, (err, data) => {
                if (err) {
                    cb(err, null);
                } else {
                    cb(null, data);
                }
            });
        });
    };

    return {
        notifyStartProvider: notifyStartProvider,
        notifyStopProvider: notifyStopProvider,
        notifyStartCustomer: notifyStartCustomer,
        notifyStopCustomer: notifyStopCustomer,
        notifyZoneNotFound: notifyZoneNotFound
    };
})();

module.exports = notifications;