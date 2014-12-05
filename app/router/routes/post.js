var express = require('express'),
    models = require('../../models'),
    Q = require('q'),
    deepExtend = require('deep-extend'),
    instantUpdate = require('../../instantUpdate');

var router = express.Router();

/*
 * Route logic for retriving employer's own jobs 
 * @param req {Object} 
 *
 * @param res {Object} the response object
 * @param next {Function} callback, used to send errors to the Error Middleware
 *
 */
router.get('/', function(req, res, next) {
    var JobPosting = models.jobPosting(),
        Employer = models.employer(),
        employerUserId = req.session.employerUserId;

    if(!employerUserId) {
        var err = new Error("Not Authorized: not Employer");
        err.status = 403;
        return next(err);
    }
    
    Q.ninvoke(Employer, 'findByEmployerId', employerUserId)
        .then(function foundEmployer(employer) {
            if(!employer) {
                var err = new Error("Employer doesn't exist");
                err.status = 403;
                next(err);
            } else {
                res.status(200).json(employer.posts);
            }
        }, function employerNotFound(err){
            err.status = 403;
            next(err);
        });
});


/*
 * Route logic for posting a job 
 * @param req {Object} 
 *  @field req.body {Object}, job post description, 
 *      should have fields that allowed by the schema in schema.jobPosting.js
 *
 * @param res {Object} the response object
 * @param next {Function} callback, used to send errors to the Error Middleware
 *
 */
router.post('/', function(req, res, next) {
    var JobPosting = models.jobPosting(),
        newJobPosting = null,
        jobPostingData = req.body,
        Employer = models.employer(),
        employerUserId = req.session.employerUserId, 
        employer = null;
    
    if(!employerUserId) {
        var err = new Error("Not Authorized: not Employer");
        err.status = 403;
        return next(err);
    }
    
    if(!jobPostingData) {
        var err = new Error('Missing job post info');            
        err.status = 400;
        return next(err);
    }

    Q.ninvoke(Employer, 'findById', employerUserId)
        .then(function foundEmployer(_employer) {
            employer = _employer;
            if(!employer) {
                var err = new Error("Employer doesn't exist");
                err.status = 404;
                next(err);
            } else {
                newJobPosting = new JobPosting(jobPostingData);
                return Q.ninvoke(newJobPosting, 'save');
            }
        }, function employerNotFound(err){
            err.status = 404;
            next(err);
        })
        .then(function jobPostSaveSuccessful() {
            return Q.ninvoke(employer, 'addPost', newJobPosting._id);
        }, function jobPostSaveFailed(err) {
            err.status = 400;
            next(err);
        })
        .then(function jobCreationSuccessful(){
            res.status(200).json(newJobPosting);
        })
        .catch(function catchAll(err) {
            next(err);  
        });
});

/*
 * Route logic for editing an existing job 
 * @param req {Object} 
 *  @field req.body {Object}, job post description, 
 *      should have fields that allowed by the schema in schema.jobPosting.js
 *  @field req.params.id, base64 version of post's ObjectId
 *
 * @param res {Object} the response object
 * @param next {Function} callback, used to send errors to the Error Middleware
 *
 */

router.post('/id/:id', function(req, res, next) {
    var JobPosting = models.jobPosting(),
        Notification = models.notification(),
        Applicant = models.applicant(),
        jobPostingData = req.body,
        base64Id = req.params.id,
        Employer = models.employer(),
        employerUserId = req.session.employerUserId, 
        employer = null;
    
    if(!employerUserId) {
        var err = new Error("Not Authorized: not Employer");
        err.status = 403;
        return next(err);
    }
    
    if(!base64Id) {
        var err = new Error("Missing id");
        err.status = 403;
        return next(err);
    } 
    if(!jobPostingData) {
        var err = new Error('Missing job post info');            
        err.status = 400;
        return next(err);
    }
    
    Q.ninvoke(Employer, 'findById', employerUserId)
        .then(function foundEmployer(_employer) {
            employer = _employer;
            if(!employer) {
                var err = new Error("Employer doesn't exist");
                err.status = 404;
                next(err);
            } else {
                return Q.ninvoke(JobPosting, 'findByUrlId', base64Id);
            }
        }, function jobPostingNotFound(err){
            err.status = 404;
            next(err);
        })
        .then(function foundJobPostSuccessful(post) {
            if(!post) {
                var err = new Error("Post cannot be found");
                err.status = 404;
                next(err);
            } else if (!employer.createdPost(post._id)) {
                var err = new Error("Employer didn't create this post");
                err.status = 403;
                next(err);
            } else {
                deepExtend(post, jobPostingData);
                if(jobPostingData.hasOwnProperty("tags")) {
                    post.markModified("tags");
                }
                return Q.ninvoke(post, 'save');
            }
        }, function jobPostSaveFailed(err) {
            err.status = 400;
            next(err);
        })
        .then(function jobPostSaveSuccessful(updatedPost){
            // Send notification to all applicants who had this
            // jobpost bookmarked
            Applicant.find({'bookmarkedPosts':updatedPost[0]._id}, function(err, applicants){
                if (err || applicants.length == 0){
                    return res.status(200).json(updatedPost[0]);
                }
                Notification.createJobUpdated(updatedPost[0]._id, applicants, function(err, message){
                    for(var i = 0; i < applicants.length; ++i){
                        instantUpdate.sendNotification(applicants[i]._id, message);
                    }
                    res.status(200).json(updatedPost[0]);  
                });
            });
        })        
        .catch(function catchAll(err) {
            next(err);  
        });

});

/*
 *
 * Route logic for retiving an existing job 
 * @param req {Object} 
 *  @field req.params.id {String}, base64 version of post's ObjectId
 *
 * @param res {Object} the response object
 * @param next {Function} callback, used to send errors to the Error Middleware
 *
 */
router.get('/id/:id', function(req, res, next) {
    var JobPosting = models.jobPosting(), 
        base64Id = req.params.id;

    if(base64Id) { 
        JobPosting.findByUrlId(base64Id, function(err, jobPosting) {
            if(err || !jobPosting) {
                res.status(404).end();
            } else {
                res.status(200).json(jobPosting); 
            }
        }); 
    } else {
        var err = new Error("Missing id");
        err.status = 403;
        next(err);
    } 
});

exports = module.exports = router;
