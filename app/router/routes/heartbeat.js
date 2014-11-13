var express = require('express')
    , Q = require('q')
    , models = require('../../models');

    var router = express.Router();
    router.post('/', function(req, res, next) {
        var Applicant = models.applicant()
            , Employer = models.employer()
            , applicantUserId = req.session.applicantUserId
            , employerUserId = req.session.employerUserId;

        
        /**
         * Using Q-style promises to avoid callback hell
         * Wrapping node-style callbacks to use promises
         * 
         * see: https://github.com/kriskowal/q#adapting-node
         */

        if(applicantUserId) {
            Q.ninvoke(Applicant, 'findById', applicantUserId)
                .then(function foundApplicant(applicant){
                    var jsonResponse = applicant.getProfileData();
                    jsonResponse.email = applicant.getEmail();
                    jsonResponse.type = 'applicant';
                    res.status(200).json(jsonResponse);
                })
                .fail(function expiredApplicantSessionKey(){
                    var err = new Error("Expired Applicant Session key");
                    err.name = "ExpiredSessionKey";
                    err.status = 204;
                    delete req.session.applicantUserId;
                    res.status(err.status).json(err);
                });

        } else if (employerUserId){
            Q.ninvoke(Employer, 'findById', employerUserId)
                .then(function foundEmployer(employer){
                    var jsonResponse = employer.getProfileData();
                    jsonResponse.email = employer.getEmail();
                    jsonResponse.type = 'employer';
                    res.status(200).json(jsonResponse);
                })
                .fail(function expiredEmployerSessionKey(){
                    var err = new Error("Expired Employer Session key");
                    err.name = "ExpiredSessionKey";
                    err.status = 204;
                    delete req.session.employerUserId;
                    res.json(err);
                }); 
        } else {
            var err = new Error("No Session Stored");
            err.name = "NoSessionKey";
            err.status = 204;
            res.status(err.status).json(err);
        }
    });

module.exports = router;

