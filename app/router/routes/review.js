var express = require('express'),
    models = require('../../models'),
    Q = require('q'),
    deepExtend = require('deep-extend');

var router = express.Router();

/*
 * Route logic for posting a job review 
 * @param req {Object} 
 *  @field req.body, job post description, 
 *      should have fields that allowed by the schema in schema.jobPosting.js
 *
 * @param res {Object} the response object
 * @param next {Function} callback, used to send errors to the Error Middleware
 *
 */
router.post('/id/:jobPostingId/review/', function(req, res, next) {
    var JobPosting = models.jobPosting(),
        jobPostingId = req.params.jobPostingId,
        jobReviewData = req.body,
        applicantUserId = req.session.applicantUserId, 
        newLen = 0;

    
    if(!jobPostingId) {
        var err = new Error("JobPostId not provided");
        err.status = 400;
        return next(err);
    }

    if(!jobReviewData) {
        var err = new Error("Missing job review data");
        err.status = 400;
        return next(err);
    }

    if(!applicantUserId) {
        var err = new Error("Not Authorized: not Applicant");
        err.status = 403;
        return next(err);
    }

    jobReviewData = {
        'content':   jobReviewData,
        'reviewer':  applicantUserId
     };

    Q.ninvoke(JobPosting, 'findByUrlId', jobPostingId)
        .then(function foundJobPost(post) {
           newLen = post.reviews.push(jobReviewData);
           post.markModified('reviews');
           return Q.ninvoke(post, 'save');
        }) 
        .then(function saveReviewSuccessful(savedPost) {
            return Q.ninvoke(savedPost[0], 'populate', 'reviewer');
        })
         .then(function populateReviewSuccessful(updatedJobPost) {
            res.status(200).json(updatedJobPost.reviews[newLen-1]);
        })
       .catch(function errorCatchAll(err) {
            err.status = 404;
            next(err);
        });
});

/*
 * Route logic for editing a job review 
 * @param req {Object} 
 *  @field req.body, job post description, 
 *      should have fields that allowed by the schema in schema.jobPosting.js
 *
 * @param res {Object} the response object
 * @param next {Function} callback, used to send errors to the Error Middleware
 *
 */
router.post('/id/:jobPostingId/review/id/:jobReviewId', function(req, res, next) {
    var JobPosting = models.jobPosting(),
        jobPostingId = req.params.jobPostingId,
        jobReviewId = req.params.jobReviewId,
        jobReviewData = req.body,
        jobReview = null,
        applicantUserId = req.session.applicantUserId;

    if(!jobPostingId) {
        var err = new Error("JobPostId not provided");
        err.status = 400;
        return next(err);
    }

    if(!jobReviewId) {
        var err = new Error("JobReviewId not provided");
        err.status = 400;
        return next(err);
    }

    if(!jobReviewData) {
        var err = new Error("Missing job review data");
        err.status = 400;
        return next(err);
    }

    if(!applicantUserId) {
        var err = new Error("Not Authorized: not Applicant");
        err.status = 403;
        return next(err);
    }
 
    jobReviewData = {
        'content': jobReviewData
    };
    
    Q.ninvoke(JobPosting, 'findByUrlId', jobPostingId)
        .then(function getAndUpdateJobReview(post) {
            jobReview = post.getReviewByUrlId(jobReviewId);
            deepExtend(jobReview, jobReviewData);
            return Q.ninvoke(post, 'save');
        }) 
        .then(function saveReviewSuccessful(updatedJobReview) {
            return Q.ninvoke(updatedJobReview[0], 'populate', 'reviewer');
        })
        .then(function populateReviewSuccessful(updatedJobPost) {
            res.status(200).json(updatedJobPost.getReviewByUrlId(jobReviewId));
        })
        .catch(function errorCatchAll(err) {
            err.status = 404;
            next(err);
        });
});

exports = module.exports = router;
