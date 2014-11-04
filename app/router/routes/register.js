var express = require('express');

module.exports = function(db) {
    var router = express.Router();

    router.post('/applicant', function(req, res, next) {
        var Applicant = db.model('Applicant'),
            newApplicant = null,
            applicantData = req.body;
       
        if(applicantData && applicantData.credentials) {
            newApplicant = new Applicant(req.body);
            newApplicant.save(function(err, newApplicantUpdated) {
                if(err) {
                    err.status = 400;
                    next(err);
                } else {
                    req.session.applicantUserId = newApplicantUpdated._Id;
                    res.status(200).end();
                }
            });
        } else {
            var err = new Error('Missing applicant credentials');            
            err.name = 'error';
            err.status = 400;
            next(err);
        }
    });

    router.post('/employer', function(req, res) {
        var Employer = db.model('Employer'),
            newEmployer = null,
            employerData = req.body;
       
        if(employerData && employerData.credentials) {
            newEmployer = new Applicant(req.body);
            newEmployer.save(function(err, newEmployerUpdated) {
                if(err) {
                    err.status = 400;
                    next(err);
                } else {
                    req.session.employerUserId = newEmployerUpdated._Id;
                    res.status(200).end();
                }
            });
        } else {
            var err = new Error('Missing employer credentials');            
            err.name = 'error';
            err.status = 400;
            next(err);
        }
    });

    return router;
};
