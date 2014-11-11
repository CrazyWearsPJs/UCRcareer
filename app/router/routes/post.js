var express = require('express'),
    models = require('../../models');

    var router = express.Router();

    /*
     * Route logic for posting a job 
     * @param req {Object} 
     *  @field req.body, job post description, 
     *      should have fields that allowed by the schema in schema.jobPosting.js
     *
     * @param res {Object} the response object
     * @param next {Function} callback, used to send errors to the Error Middleware
     *
     */
    router.post('/post', function(req, res, next) {
        var JobPosting = models.jobPosting(),
            newJobPosting = null,
            jobPostingData = req.body;
        if(jobPostingData) {
            newJobPosting = new JobPosting(jobPostingData);
            newJobPosting.save(function(err, newJobPostingUpdated) {
                if(err) {
                    err.status = 400;
                    next(err);
                } else {
                    //req.session.applicantUserId = newApplicantUpdated._id;
                    // TODO set unique identifier for job posts
                    res.status(200).end();
                }
            });
        } else {
            var err = new Error('Missing job post info');            
            err.name = 'error';
            err.status = 400;
            next(err);
        }
    });

module.exports = router;
