/**
 * Module Dependancies
 */

var express    = require('express')
  , multiparty = require('multiparty')
  , fs         = require('fs')
  , path       = require('path');

var models  = require('../../models')
  , config  = require('../../config')
  , router  = new express.Router();

var serverSettings = config.serverSettings;

/**
 * Route for uploading a resume. Sender must
 * already be logged in in order to upload!
 */

router.post('/', function(req, res){
    var Applicant = models.applicant()
      , applicantUserId = req.session.applicantUserId;
    
    if (!applicantUserId)
        return req.send(400, 'Must be logged in first');
    
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
        if(err) 
            return req.send(400, 'Error uploading file');
        // Path to temporary file we fetched
        var filePath = files.file[0].path;
        // Move temporary file to something more
        // permanent
        var saveFilePath = path.join(serverSettings.resumePath, applicantUserId + '.pdf');
        
        fs.rename(filePath, saveFilePath, function(err){
            // We shouldn't have trouble moving a file
            if (err) return req.send(400, 'Error saving file');
            // Save the path to the resume to the applicant
            Applicant
                .where ({ _id: applicantUserId})
                .update({$set: {'spec.resume': saveFilePath}}, {}, function(){
                    res.sendStatus(200).end();
                });
        });
    });
});


/**
 * Export router
 */

exports = module.exports = router;
