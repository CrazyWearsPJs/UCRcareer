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
router.post('/', function(req, res, next) {
    var JobPosting = models.jobPosting(),
        newJobPosting = null,
        jobPostingData = req.body;

    if(!req.session.employerUserId) {
        var err = new Error("Not Authorized: not Employer");
        err.name = "ForbiddenError";
        err.status = 403;
        next(err);
    }
    
    if(jobPostingData) {
        newJobPosting = new JobPosting(jobPostingData);
        newJobPosting.save(function(err, newJobPostingUpdated) {
            if(err) {
                err.status = 400;
                next(err);
            } else {
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

/**
 * Job Posting search route. Given a keyword, this
 * function will return all job postings that contain
 * the keyword in its title or description
 */

router.post('/search', function(req, res, next) {
    var JobPosting = models.jobPosting()
      , keyword    = req.body.keyword;

    // sanity checking
    if (!keyword) {
        res.status(400).end();
        return;
    }
    if (typeof keyword != 'string') {
        res.status(400).end();
        return;
    }

    JobPosting.findByKeyword(keyword, function(err, posts){
        if (err) {
            res.send(400).end();
            return;
        }
        res.send(posts);
    });
});

exports = module.exports = router;
