/**
 * Module Dependencies
 */

var express  = require('express')
  , mongoose = require('mongoose');

var config = require('./config') 
    app    = require('./app');

/**
 * Setup database 
 */

var db = mongoose.createConnection(config.dbSettings);
