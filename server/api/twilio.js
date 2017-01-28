const express = require('express'),
    moment = require('moment'),
    jwt = require('jwt-simple'),
    authenticate = require('../middleware/authenticate'),
    admin = require('../middleware/admin'),
    loadUser = require('../middleware/loadUser'),
    bodyValidator = require('../helpers/bodyValidator'),
    twilio = require('../helpers/twilio');

let router = express.Router();

/* Send message */
router.post("/twilio/send", (req, res) => {
    if (Object.keys(req.body).length !== 2 || bodyValidator(req.body.to, req.body.msg)) {
        res.json({
            info: "Please supply all required fields",
            success: false
        });
    } else {
        twilio.sendSms(req.body.to, req.body.msg, (err, data) => {
            if (err) {
                res.json({
                    info: "Message not sent",
                    success: false,
                    error: err
                });
            } else {
                res.json({
                    info: "Message sent to: " + req.body.to,
                    success: true,
                    data: data
                });
            }
        });
    }
});


module.exports = router;