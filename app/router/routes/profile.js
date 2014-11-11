var express = require('express'),
    models = require('../../models'),
    Q = require('q');

    var router = new express.Router();
    
    router.post('/applicant/:email/profile', function(req, res, next) {
        var email = req.params.email,
            Applicant = models.applicant(), 
            applicantUserId = req.session.applicantUserId;
        
        if(!email) {
            var err = new Error("Resource " + req.baseUrl +" doesn't exist");
            err.name = "NotFoundError";
            err.status = 404;
            next(err);
        } 

        if(!applicantUserId) {
            var err = new Error("Applicant not authorized");
            err.name = "UnauthorizedError";
            err.status = 401;
            next(err);
        }
        
        Q.ninvoke(Applicant, 'findById', applicantUserId)
            .success(function foundApplicant(applicant)) {
                if(applicant.credentials.email !== email) {
                    var err = new Error("Applicant email " + applicant.credentials.email + " doesn't match given email" + email);
                    err.name = "ForbiddenError";
                    err.status = 403;
                    throw err;
                } else {
                    //updates TODO
                    return Q.ninvoke(applicant, 'save')
                        .success(function(){
                           res.status(200).end(); 
                        });
                        .fail(function(err){
                           err.status = 400;
                        });
                }
            })
            .fail(function applicantNotFound(function(err)) {
                err.status = 404;
            }
            .catch(function applicantNotFoundOrValidEmail(function(err){
               next(err); 
            });
    });

    router.post('/employer', function(req, res, next) {
        var email = req.params.email,
            Employer = models.employer(), 
            employerUserId = req.session.employerUserId;
        
        if(!email) {
            var err = new Error("Resource " + req.baseUrl +" doesn't exist");
            err.name = "NotFoundError";
            err.status = 404;
            next(err);
        } 

        if(!employerUserId) {
            var err = new Error("employer not authorized");
            err.name = "UnauthorizedError";
            err.status = 401;
            next(err);
        }
        
        Q.ninvoke(Employer, 'findById', employerUserId)
            .success(function foundEmployer(employer)) {
                if(employer.credentials.email !== email) {
                    var err = new Error("employer email " + employer.credentials.email + " doesn't match given email" + email);
                    err.name = "ForbiddenError";
                    err.status = 403;
                    throw err;
                } else {
                    //updates TODO
                    return Q.ninvoke(employer, 'save')
                        .success(function(){
                           res.status(200).end(); 
                        });
                        .fail(function(err){
                           err.status = 400;
                        });
                }
            })
            .fail(function employerNotFound(function(err)) {
                err.status = 404;
            }
            .catch(function employerNotFoundOrValidEmail(function(err){
               next(err); 
            });

    });
module.exports = router;
