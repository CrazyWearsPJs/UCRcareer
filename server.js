/**
 * Module Dependencies
 */

var express  = require('express')
  , mongoose = require('mongoose');

var config   = require('./config') 
    app      = require('./app');
    models   = require('./app/models');

var applicantSchema = require('./app/models/schema.applicant')
  , employerSchema  = require('./app/models/schema.employer');

/**
 * Setup database 
 */

//var db = mongoose.createConnection(config.dbSettings);
var db = mongoose.createConnection('mongodb://10.0.2.15:8081/UCRcareer');

models.register(db);

var Applicant = db.model('Applicant', applicantSchema);
var Employer  = db.model('Employer', employerSchema);

var a1 = new Applicant({
   login: {
	password: "password"
      , uName: "best@email.com"
   }
  , website: "bestwebsite.com"
  , linkedIn: "www.linkedin.com/boss"
  , facebook: "www.facebook.com/teehee"
});

a1.save(function(err,a1) {
    if(err) return console.error(err);
    console.log("I was saved!\n");
});
