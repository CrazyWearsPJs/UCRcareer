var express = require('express'),
    models = require('../../models'),
    Q = require('q'),
    deepExtend = require('deep-extend');

    var router = new express.Router();
    
    router.post('/applicant', function(req, res, next) {
        var Applicant = models.applicant(), 
            applicantUserId = req.session.applicantUserId,
            updatedProfileInfo = req.body,
            email = updatedProfileInfo.email;

        if(updatedProfileInfo.credentials) {
            var err = new Error("Change of Credentials if forbidden");
            err.status = 400;
            next(err);
        }
        
        if(!email) {
            var err = new Error("Resource " + req.baseUrl +" doesn't exist");
            err.status = 404;
            next(err);
        } else {
            delete updatedProfileInfo.email;
        }

        if(!applicantUserId) {
            var err = new Error("Applicant not authorized");
            err.status = 401;
            next(err);
        }
        
        Q.ninvoke(Applicant, 'findById', applicantUserId)
            .then(function foundApplicant(applicant) {
                if(applicant.credentials.email !== email) {
                    var err = new Error("Applicant email " + applicant.credentials.email + " doesn't match given email" + email);
                    err.status = 403;
                    throw err;
                } else {
                    deepExtend(applicant, updatedProfileInfo);
                    //need to do this, as mongo doesn't index arrays
                    if(updatedProfileInfo.interests && updatedProfileInfo.interests.length > 0) {
                        applicant.markModified('interests');
                    }
                    return Q.ninvoke(applicant, 'save')
                        .then(function(){
                           var jsonResponse = applicant.getProfileData();
                           res.status(200).json(jsonResponse); 
                        })
                        .fail(function(err){
                           err.status = 400;
                        });
                }
            })
            .fail(function applicantNotFound(err) {
                err.status = 404;
            })
            .catch(function applicantNotFoundOrValidEmail(err) {
               next(err); 
            });
    });

    router.post('/employer', function(req, res, next) {
        var Employer = models.employer(), 
            employerUserId = req.session.employerUserId,
            updatedProfileInfo = req.body,
            email = updatedProfileInfo.email;
        
        if(updatedProfileInfo.credentials) {
            var err = new Error("Change of Credentials if forbidden");
            err.status = 400;
            next(err);
        }

        if(!email) {
            var err = new Error("Resource " + req.baseUrl +" doesn't exist");
            err.status = 404;
            next(err);
        } else {
            delete updatedProfileInfo.email;
        }

        if(!employerUserId) {
            var err = new Error("employer not authorized");
            err.status = 401;
            next(err);
        }

        Q.ninvoke(Employer, 'findById', employerUserId)
            .then(function foundEmployer(employer) {
                if(employer.credentials.email !== email) {
                    var err = new Error("employer email " + employer.credentials.email + " doesn't match given email" + email);
                    err.status = 403;
                    throw err;
                } else {
                    deepExtend(employer, updatedProfileInfo);

                    
                    return Q.ninvoke(employer, 'save')
                        .then(function(){
                           var jsonResponse = employer.getProfileData();
                           res.status(200).json(jsonResponse); 
                        })
                        .fail(function(err){
                            err.status = 400;
                        });
                }
            })
            .fail(function employerNotFound(err) {
                err.status = 404;
            })
            .catch(function employerNotFoundOrValidEmail(err) {
               next(err); 
            });

    });
module.exports = router;
