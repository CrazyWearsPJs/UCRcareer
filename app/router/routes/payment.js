var express = require('express'),
    models = require('../../models'),
    ipn = require('paypal-ipn');

var router = express.Router();

router.post('/', function(req, res, next) {
    
    req.body = req.body || {};
    res.send(200, 'OK');
    res.end;

    var params = req.body;
    //ipn.verify(params, function callback(err, msg) { // Use this when not testing anymore
    ipn.verify(params, {'allow_sandbox': true}, function callback(err, msg) {
        if(err) {
        } else {
            if(params.payment_status == 'Completed') {
                /* Now act on it. */
                var Applicant = models.applicant(),
                    customerEmail = params.option_name1,
                    itemName = params.item_name;
                
                var daysAdd = 0;
                if(itemName === "30 days of Premium Access to HuntEdu") {
                    daysAdd = 30;
                } else if (itemName === "90 days of Premium Access to HuntEdu") {
                    daysAdd = 90;
                }
    
                Applicant.findByEmail(customerEmail, function(err, applicant) {
                    if(err) {
                        err.status = 404;
                        next(err)
                    } else if (!applicant) {
                        var err = new Error("Applicant not found");
                        err.status = 404;
                        next(err)
                    } else {
                        applicant.addSubscriptionDays(daysAdd, function (err, app, numberAffected) {
                            if(err) {
                            }
                            if(!numberAffected) {
                            }
                        });
                    }
                });
            }
        }
    });
});

exports = module.exports = router;
