/**
 * Module dependancies
 */

var express = require('express')
  , models = require('../../models');

var router     = express.Router() 
  , Applicant  = models.applicant()
  , JobPosting = models.jobPosting();


/**
 * Add job posting id to applicants bookmarks
 * @req id {String} encoded job posting id
 */

router.post('/add', function(req, res, next){
    var applicantId = req.session.applicantUserId;

    // User can't save bookmark if they arn't logged in
    if (!applicantId){
        var Err = new Error();
        Err.status = 403;
        return next(Err);
    }

    var postId = req.body.id;
    // Response must have a post id
    if (!postId){
        var Err = new Error();
        Err.status = 400;
        return next(Err);
    }

    Applicant.findById(applicantId, function(err, applicant){
        if (err) {
            return next(err);
        }
        if (!applicant){
            var Err = new Error();
            Err.status = 400;
            return next(err);
        }

        var decodedId = JobPosting.decodeUrlId(postId);
        
        // Save bookmark
        applicant.addBookmark(decodedId, function(err){
            // Database err, but we should make it seem
            // like its the users fault :P
            if(err){
                return next(err);
            }
            res.status(200).end();
        });
    });
});

/**
 * Remove a job posting id from an applicants bookmarks
 * @req id {String} encoded job posting id
 */

router.post('/remove', function(req, res, next){
    var applicantId = req.session.applicantUserId;

    // User can't remove a bookmark if they arn't logged in
    if (!applicantId){
        var Err = new Error();
        Err.status = 403;
        return next(Err);
    }

    var postId = req.body.id;
    // Response must have a post id
    if (!postId){
        var Err = new Error();
        Err.status = 400;
        return next(Err);
    }

    Applicant.findById(applicantId, function(err, applicant){
        if (err) {
            return next(err);
        }
        if (!applicant){
            var Err = new Error();
            Err.status = 400;
            return next(err);
        } 
        
        var decodedId = JobPosting.decodeUrlId(postId);

        // Save bookmark
        applicant.removeBookmark(decodedId, function(err){
            // Database err, but we should make it seem
            // like its the users fault :P
            if(err){
                return next(err);
            }
            res.status(200).end();
        });
    });
});

/**
 * Exports
 */

exports = module.exports = router;