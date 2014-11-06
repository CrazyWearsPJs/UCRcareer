var express = require('express'),
    models = require('../../models');

    var router = express.Router();
    router.post('/applicant', function(req, res, next) {
        var Applicant = models.applicant(),
            credentials = req.body; 
            
        if(credentials.email && credentials.password) {
            Applicant.findByCredentials(credentials, 
            function(err, applicant) {
                if(err) {
                    err.status = 403;
                    next(err);
                } else {
                    req.session.applicantUserId = applicant._Id;
                    res.status(200).end();
                }
            });
        } else {
            var err = new Error("Missing credentials");
            err.name = "error";
            err.status = 400;
            next(err);
        }
    });

    router.post('/employer', function(req, res, next) {
        var Employer = models.employer(),
            credentials = req.body; 

        if(credentials.email && credentials.password) {
            Employer.findByCredentials(credentials, function(err, employer) {
                if(err) {
                    err.status = 403;
                    next(err);
                } else {
                    req.session.employerUserId = employer._Id;
                    res.status(200).end();
                }
            });
        } else {
            var err = new Error("Missing credentials");
            err.name = "error";
            err.status = 400;
            next(err);
        }   
    });
    
module.exports = router;

