var express = require('express');

module.exports = function(db) {
    var router = express.Router();

    router.post('/applicant', function(req, res, next) {
        var Applicant = db.model('Applicant'),
            newApplicant = null,
            applicantData = req.body;
       
       console.log(applicantData);
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

    });

    return router;
};
