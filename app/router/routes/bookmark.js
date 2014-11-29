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
        res.status(403).end();
        return;
    }

    var postId = req.body.id;
    // Response must have a post id
    if (!postId){
        res.status(404).end();
        return;
    }

    Applicant.findById(applicantId, function(err, applicant){
        if (err) {
            return next(err);
        }
        if (!applicant){
            var err = new Error("DB should contain applicant id");
            return next(err);
        }

        var decodedId = JobPosting.decodeUrlId(postId);
        
        // Save bookmark
        applicant.addBookmark(decodedId, function(err){
            // Database err, but we should make it seem
            // like its the users fault :P
            if(err){
                res.status(404).end();
            }
            res.status(200).end();
        });
    });
});


/**
 * Exports
 */

exports = module.exports = router;