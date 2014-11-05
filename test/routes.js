/**
 * Module dependencies
 */

var express = require('express')
    , bodyParser = require('body-parser')
    , session = require('express-session');
    

var expect   = require('chai').expect
  , request  = require('supertest') 
  , mongoose = require('mongoose')
  , _        = require('underscore');

var config     = require('../app/config') 
  , models     = require('../app/models')
  , router     = require('../app/router');

var dbTestSettings = config.dbTestSettings
  , db             = undefined;

var app = undefined;

/**
 * Begin tests
 */

describe('routes', function (){
    
    before('Setup app and create a db connection', function(done) {
        app = express();

        db = mongoose.createConnection(dbTestSettings.host
                                     , dbTestSettings.database
                                     , 8081); 
   
        app.use(session({
            'name': 'ucrCareer.api-token'
            , 'resave': true
            , 'secret': 'test'
            , 'saveUninitialized' : true
        }));

        app.use(bodyParser.json());
 
        router(app);

        //Wait till db is connected
        db.on('connected', function(){
            models.register(db);
            done();
        });
       
    });
    
    after('Destroy the db connection', function() {
        db.close();
        db = undefined;
    });

    describe('POST api/v1/register', function (){
        var registerRoutePrefix = '/api/v1/register';
        describe('/applicant', function() {
            
            var input = {
                    credentials: {
                        password: "password1"
                      , email:    "jdoe001@ucr.edu"
                    }
                  , contact: {
                        phoneNum: "9099999999"
                    }
                  , location: {
                        city:     "Riverside"
                      , state:    "CA"
                      , zip:      "92501"
                      , address1: "1111 Linden St"
                      , country:  "USA"
                    }
                  , spec: {
                        degree: "Computer Science"
                    }
                  , personal: {
                        fName: "John"
                      , lName: "Doe"
                    }
            };
 
            afterEach('destory applicant db', function(done) {
                models.applicant().remove({}, function(err) {
                    done();
                });
            });

            it('should register applicant successfully', function(done) {
                request(app)
                    .post(registerRoutePrefix + '/applicant')
                    .send(input)
                    .expect(200, done)
            });  

            it('should not allow double registration', function(done) {
                request(app)
                    .post(registerRoutePrefix + '/applicant')
                    .send(input)
                    .expect(200)
                    .end(function(err, res) {
                        request(app)
                            .post(registerRoutePrefix + '/applicant')
                            .send(input)
                            .expect(400, done);
                    });
            });
            
            it('should not register given invalid applicant data', 
                function(done) {
                request(app)
                    .post(registerRoutePrefix + '/applicant')
                    .send({
                        credentials: {
                            email: 'jondoe64@aol.com',
                            password: '1234'
                        }
                    })
                    .expect(400, done);
            });

        });
        describe('/employer', function() {
            var input = {  
                  companyName: 'Google Inc'
                  , credentials: {
                        password: "password1"
                      , email:    "jdoe001@ucr.edu"
                    }
                  , contact: {
                        phoneNum: "9099999999"
                    }
                  , location: {
                        city:     "Riverside"
                      , state:    "CA"
                      , zip:      "92501"
                      , address1: "1111 Linden St"
                      , country:  "USA"
                    }
                  , personal: {
                        fName: "John"
                      , lName: "Doe"
                    }
            };

            afterEach('destory employer db', function(done) {
                models.employer().remove({}, function(err) {
                    done();
                });
            });
            
            it('should register employer successfully', function(done) {
                request(app)
                    .post(registerRoutePrefix + '/employer')
                    .send(input)
                    .expect(200, done)
            });  

            it('should not allow double registration', function(done) {
                request(app)
                    .post(registerRoutePrefix + '/employer')
                    .send(input)
                    .expect(200)
                    .end(function(err, res) {
                        request(app)
                            .post(registerRoutePrefix + '/employer')
                            .send(input)
                            .expect(400, done);
                    });
            });
            
            it('should not register given invalid applicant data', 
                function(done) {
                request(app)
                    .post(registerRoutePrefix + '/employer')
                    .send({
                        credentials: {
                            email: 'jondoe64@aol.com',
                            password: '1234'
                        }
                    })
                    .expect(400, done);
            });
        });
    }); 
});

