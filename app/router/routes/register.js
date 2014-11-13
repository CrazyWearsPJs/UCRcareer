var express = require('express'),
    models = require('../../models');

    var router = express.Router();

    /*
     * Route logic for registering an applicant
     * @param req {Object} 
     *  @field req.body, profile data for an applicant, 
     *      should have fields that allowed by the schema in schema.applicant.js
     *
     * @param res {Object} the response object
     * @param next {Function} callback, used to send errors to the Error Middleware
     *
     */
    router.post('/applicant', function(req, res, next) {
        var Applicant = models.applicant(),
            newApplicant = null,
            applicantData = req.body;
        if(applicantData && applicantData.credentials) {
            newApplicant = new Applicant(applicantData);
            newApplicant.save(function(err, newApplicantUpdated) {
                if(err) {
                    err.status = 400;
                    console.log(err);
                    next(err);
                } else {
                    req.session.applicantUserId = newApplicantUpdated._id;
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
   
   /*
    * Route logic for registering an applicant
    * @param req {Object} 
    *  @field req.body, profile data for an employer, 
    *      should have fields that allowed by the schema in schema.employer.js
    *
    * @param res {Object} the response object
    * @param next {Function} callback, used to send errors to the Error Middleware
    *
    */
    router.post('/employer', function(req, res, next) {
        var Employer = models.employer(),
            newEmployer = null,
            employerData = req.body;
       
        if(employerData && employerData.credentials) {
            newEmployer = new Employer(employerData);
            newEmployer.save(function(err, newEmployerUpdated) {
                if(err) {
                    err.status = 400;
                    console.log(err);
                    next(err);
                } else {
                    req.session.employerUserId = newEmployerUpdated._id;
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
