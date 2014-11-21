/**
 * Module Dependancies
 */

var express = require('express')
  , models  = require('../../models');

var router    = new express.Router()
  , Applicant = models.applicant(); 

/**
 * Returns users resume if they are authenticated
 */

router.get('/', function(req, res, next){
    var applicantUserId = req.session.applicantUserId;
    if (!applicantUserId)
        return res.send(400, 'Forbidden');

    // Find applicants resume
    Applicant.findOne({_id : applicantUserId}, function(err, applicant){
        if (!applicant)
            return res.send(400, 'No Resume was uploaded');
        res.sendFile(applicant.spec.resume);
    });
});

/**
 * Export router
 */

exports = module.exports = router;
