var express = require('express');

module.exports = function(db) {
    var router = express.Router();
    router.post('/applicant', function(req, res, next) {
        var Applicant = db.model('Applicant'),
            credentials = req.body; 
        
        if(credentials.email && credentials.password) {
            Applicant.findByCredentials(credentials, function(err, applicant) {
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
        var Employer = db.model('Employer'),
            credentials = req.body; 

        if(req.session.employerUserId) {
            res.status(200).end();
        }

        if(credentials.email && credentials.password) {
            Employer.exists(credentials, function(err, employer) {
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
    return router;
};
