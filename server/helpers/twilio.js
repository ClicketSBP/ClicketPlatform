const config = require('../../config/clicket.config'),
    twilioClient = require('twilio')(config.twilio.accountSid, config.twilio.authToken);

const twilio = (() => {
    const sendSms = (to, msg, cb) => {
        twilioClient.messages.create({
            body: msg,
            to: to,
            from: config.twilio.sendingNumber
        }, (err, data) => {
            if (err) {
                console.log("An error occured while sending a SMS: ", err);
                cb(err, null);
            } else {
                console.log("Message sent to: " + to);
                cb(null, data);
            }
        });
    };

    return {
        sendSms: sendSms
    };
})();

module.exports = twilio;