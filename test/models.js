/**
 * Module dependencies
 */

var expect   = require('chai').expect
  , mongoose = require('mongoose')
  , _        = require('underscore');

var config     = require('../app/config') 
  , models     = require('../app/models');

var dbTestSettings = config.dbTestSettings
  , db             = undefined;


/**
 * Begin tests
 */

describe('models', function (){
    
    beforeEach('Create a db connection', function(done) {
        db = mongoose.createConnection(dbTestSettings.host
                                     , dbTestSettings.database
                                     , dbTestSettings.port);
        done();
    });
    
    afterEach('Destroy the db connection', function(done) {
        db.close();
        db = undefined;
        done();
    });

    describe('#register', function (){
        it('should expose model constructors', function (){
            models.register(db); 
            
            // List of the models that should be registered
            var Models = [ 'Applicant', 'Employer', 'JobPosting' ];
            
            // Build a list of keys in db.models. Our models
            // should be in that list
            var dbModels = _.keys(db.models)
            
            // Check our models match
            var diff = _.difference(Models, dbModels);
            expect(diff).to.be.empty;
        });
    });

    describe('#applicant', function (){
        it('should return a applicant model c\'tor', function (){
            var Applicant = models.applicant()
              , johnDoe   = new Applicant();
        });
    });

    describe('#employer', function (){
        it('should return a employer model c\'tor', function (){
            var Employer = models.employer()
              , johnDoe  = new Employer();
        });
    });

    describe('#jobPosting', function (){
        it('should return a jobPosting model c\'tor', function (){
            var JobPosting = models.jobPosting()
              , post       = new JobPosting();
        });
    });
});

