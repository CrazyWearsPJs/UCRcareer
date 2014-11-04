var express = require('express');

module.exports = function(db) {
    var router = new express.Router();
    
    router.post('/applicant', function(req, res, next) {
        if(req.session.applicantUserId) {
            delete req.session.applicantUserId;
            res.status(200).end();
        } else {
            var err = new Error("Already logged out");
            err.status = 409;
            next(err);
        }
    });


    router.post('/employer', function(req, res, next) {
        if(req.session.employerUserId) {
            delete req.session.employerUserId;
            res.status(200).end();
        } else {
            var err = new Error("Already logged out");
            err.status = 409;
            next(err);
        }

    });
    return router;
};
