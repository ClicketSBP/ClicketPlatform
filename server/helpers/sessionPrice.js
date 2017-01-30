const config = require('../../config/clicket.config'),
    moment = require('moment');

const sessionPrice = (() => {
    const calculatePrice = (ses, cb) => {
        let data = {
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

        if (!ses.active) {
            let timeDifference = moment(ses.stopped_on).diff(moment(ses.started_on), 'hours', true);
            let parkCosts = timeDifference * ses.zone_id.price;
            data = {
                time: {
                    hoursParked: timeDifference,
                    minutesParked: timeDifference * 60
                },
                price: {
                    'parkCosts': parkCosts,
                    'transactionCosts': config.prices.costsPerTransaction,
                    'total': parkCosts + config.prices.costsPerTransaction
                }
            };
        }

        cb(data);
    };

    return {
        calculatePrice: calculatePrice
    };
})();

module.exports = sessionPrice;