var express = require('express'),
    models = require('../../models');

var router = express.Router();


function search(keyword, options, res) {
    var JobPosting = models.jobPosting();
    JobPosting.findByKeyword(keyword, function(err, posts) {
        if(err) {
            err.status = 404;
            res.status(404).json(err);
            return;
        } else if(!posts)  {
            var err = new Error("invalid search");
            err.status = 400;
            res.status(400).json(err);
        } else {
            res.status(200).json(posts);
        }
    }, options);
}

/**
 * Job Posting search route. Given a keyword, this
 * function will return all job postings that contain
 * the keyword in its title or description
 */

router.get('/:keyword', function(req, res, next) {
    var keyword    = req.params.keyword
      , Applicant = models.applicant()
      , Employer = models.employer()
      , applicantUserId = req.session.applicantUserId
      , employerUserId = req.session.employerUserId;

     // sanity checking
    if (!keyword) {
        res.status(400).end();
        return;
    }
    if (typeof keyword != 'string') {
        res.status(400).end();
        return;
    }

    if(applicantUserId) {
        Q.ninvoke(Applicant, 'findByApplicantId', applicantUserId)
            .then(function foundApplicant(applicant){
                search(keyword, {
                    limit: 100, 
                    showAllJobs: applicant.isSubscribed()
                }, res);
            });

    } else if (employerUserId){
        Q.ninvoke(Employer, 'findByEmployerId', employerUserId)
            .then(function foundEmployer(employer){
                 search(keyword, {
                    limit: 100, 
                    ownJobs: employer.getPosts()
                }, res);
 
            }); 
    }
    
    search(keyword, {limit: 100}, res);

});

exports = module.exports = router;
