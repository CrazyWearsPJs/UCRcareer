var express = require('express'),
    models = require('../../models');

    var router = express.Router();

    router.post('/applicant', function(req, res, next) {
        var Applicant = models.applicant(),
            newApplicant = null,
            applicantData = req.body;
       
        if(applicantData && applicantData.credentials) {
            newApplicant = new Applicant(applicantData);
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

    router.post('/employer', function(req, res, next) {
        var Employer = models.employer(),
            newEmployer = null,
            employerData = req.body;
       
        if(employerData && employerData.credentials) {
            newEmployer = new Employer(employerData);
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

module.exports = router;
