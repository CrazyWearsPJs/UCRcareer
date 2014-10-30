/**
 * Module Dependencies
 */

var express  = require('express')
  , mongoose = require('mongoose');

var config   = require('./config')
  , app      = require('./app/models');

/**
 * Setup database 
 */

var dbSettings = config.dbSettings
  , db = mongoose.createConnection(dbSettings.host
                                 , dbSettings.database
                                 , dbSettings.port);
