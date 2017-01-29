const config = require('../../config/clicket.config'),
    moment = require('moment');

const sessionPrice = (() => {
    const calculatePrice = (started_on, stopped_on, pricePerHour, cb) => {
        let timeDifference = moment(stopped_on).diff(moment(started_on), 'hours', true);
        let parkCosts = timeDifference * pricePerHour;
        let data = {
            time: {
                hoursParked: timeDifference,
                minutesParked: timeDifference / 60
            },
            price: {
                'parkCosts': parkCosts,
                'transactionCosts': config.prices.costsPerTransaction,
                'total': (parkCosts + config.prices.costsPerTransaction)
            }
        }

        cb(data);
    };

    return {
        calculatePrice: calculatePrice
    };
})();

module.exports = sessionPrice;