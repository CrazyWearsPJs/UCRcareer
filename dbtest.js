/**
 * Module dependencies
 */
var mongoose = require('mongoose')
  , server   = require('./server')
  , app      = require('./app')
  , models   = require('./app/models');

models.register(server.db);

var applicant = new Applicant({
    password: "password"
  , uName: "best@email.com"
  , website: "bestwebsite.com"
  , linkedIn: "www.linkedin.com/boss"
  , facebook: "www.facebook.com/teehee"
});

console.log(applicant.password);

