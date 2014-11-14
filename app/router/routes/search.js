var express = require('express'),
    models = require('../../models');

var router = express.Router();

/**
 * Job Posting search route. Given a keyword, this
 * function will return all job postings that contain
 * the keyword in its title or description
 */

router.get('/:keyword', function(req, res, next) {
    var JobPosting = models.jobPosting()
      , keyword    = req.params.keyword;

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
