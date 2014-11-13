var express = require('express')
    , Q = require('q')
    , models = require('../../models');

    var router = express.Router();
    router.post('/', function(req, res, next) {
        var Applicant = models.applicant()
            , Employer = models.employer()
            , credentials = req.body; 
        
        /**
         * Using Q-style promises to avoid callback hell
         * Wrapping node-style callbacks to use promises
         * 
         * see: https://github.com/kriskowal/q#adapting-node
         */

        if(credentials.email && credentials.password) {
            Q.ninvoke(Applicant, 'findByCredentials', credentials)
                .then(function foundApplicant(applicant){
                    var jsonResponse = applicant.getProfileData();
                    jsonResponse.type = 'applicant';
                    
                    req.session.applicantUserId = applicant._id;
                    res.status(200).json(jsonResponse);
                })
                .fail(function tryEmployerLogin(){
                    return Q.ninvoke(Employer, 'findByCredentials', credentials)
                    .then(function foundEmployer(employer) {
                        var jsonResponse = employer.getProfileData();
                        jsonResponse.type = 'employer';
                        req.session.employerUserId = employer._id;

                        res.status(200).json(jsonResponse);  
                    });      
                })
                .catch(function errorCatchAll(err) {
                    err.status = 403;
                    next(err);
                });
        } else {
            var err = new Error("Missing credentials");
            err.name = "error";
            err.status = 400;
            next(err);
        }
    });

module.exports = router;

