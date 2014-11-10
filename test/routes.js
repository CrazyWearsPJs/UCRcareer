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

var applicant = { 
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
 
var employer = {  
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

describe('routes', function (){
   var apiPrefix = '/api/v1'
    , applicantRouteSuffix = '/applicant'
    , employerRouteSuffix = '/employer';
    
    var registerRoutePrefix = apiPrefix + '/register'  
    , loginRoutePrefix = apiPrefix + '/login';
 
    var registerApplicantRoute = registerRoutePrefix + applicantRouteSuffix
    , registerEmployerRoute = registerRoutePrefix + employerRouteSuffix; 
         
    var loginRoute = loginRoutePrefix;

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
        describe('/applicant', function() { 
            afterEach('destory applicant db', function(done) {
                models.applicant().remove({}, function(err) {
                    done();
                });
            });

            it('should register applicant successfully', function(done) {
                request(app)
                    .post(registerRoutePrefix + '/applicant')
                    .send(applicant)
                    .expect(200, done)
            });  

            it('should not allow double registration', function(done) {
                request(app)
                    .post(registerRoutePrefix + '/applicant')
                    .send(applicant)
                    .expect(200)
                    .end(function(err, res) {
                        request(app)
                            .post(registerRoutePrefix + '/applicant')
                            .send(applicant)
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

            afterEach('destory employer db', function(done) {
                models.employer().remove({}, function(err) {
                    done();
                });
            });
            
            it('should register employer successfully', function(done) {
                request(app)
                    .post(registerEmployerRoute)
                    .send(employer)
                    .expect(200, done)
            });  

            it('should not allow double registration', function(done) {
                request(app)
                    .post(registerEmployerRoute)
                    .send(employer)
                    .expect(200)
                    .end(function(err, res) {
                        request(app)
                            .post(registerEmployerRoute)
                            .send(employer)
                            .expect(400, done);
                    });
            });
            
            it('should not register given invalid applicant data', 
                function(done) {
                request(app)
                    .post(registerEmployerRoute)
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
 
    describe('POST api/v1/login', function(){
        var employerCredentials = employer.credentials
            , applicantCredentials = applicant.credentials;

        describe('#applicant', function() {
            before('register applicant', function(done) {
                    request(app)
                        .post(registerApplicantRoute)
                        .send(applicant)
                        .expect(200, done);
                });

                after('destory applicant db', function(done) {
                    models.applicant().remove({}, function(err) {
                        done();
                    });
                });

                it('should allow a registered user to login and send back profile data', function(done) {
                    var profileData = _.extend({}, applicant);
                    delete profileData.credentials;
                    profileData.type = 'applicant';

                    request(app)
                        .post(loginRoute)
                        .send(applicantCredentials)
                        .expect(200)
                        .expect(profileData, done);
                });
                it('should not allow a registered user with an invalid password to login', function(done) {
                    /*
                     * Make deep copy of credentials
                     */

                    var invalidCredentials = _.extend({}, applicantCredentials);
                    
                    invalidCredentials.password += "wrong";

                    request(app)
                        .post(loginRoute)
                        .send(invalidCredentials)
                        .expect(403, done);
                });
                it('should not allow an unregistered user to login', function(done) {
                    var invalidCredentials = _.extend({}, applicantCredentials);
                    invalidCredentials.email = "Not" + invalidCredentials.email;

                    request(app)
                        .post(loginRoute)
                        .send(invalidCredentials)
                        .expect(403, done);
                });
        });

        describe('#employer', function() { 
            before('register employer', function(done) {
                request(app)
                    .post(registerEmployerRoute)
                    .send(employer)
                    .expect(200, done);
                });

                after('destory employer db', function(done) {
                    models.employer().remove({}, function(err) {
                        done();
                    });
                });

                it('should allow a registered user to login and send back profile data', function(done) {
                    var profileData = _.extend({}, employer);
                    delete profileData.credentials;
                    profileData.type = 'employer';

                    request(app)
                        .post(loginRoute)
                        .send(employerCredentials)
                        .expect(200)
                        .expect(profileData, done);
                });

                it('should not allow a registered user with an invalid password to login', function(done) {
                    /*
                     * Make deep copy of credentials
                     */

                    var invalidCredentials = _.extend({}, employerCredentials);
                    
                    invalidCredentials.password += "wrong";

                    request(app)
                        .post(loginRoute)
                        .send(invalidCredentials)
                        .expect(403, done);
                });
                it('should not allow an unregistered user to login', function(done) {
                    var invalidCredentials = _.extend({}, employerCredentials);
                    invalidCredentials.email = "Not" + invalidCredentials.email;

                    request(app)
                        .post(loginRoute)
                        .send(invalidCredentials)
                        .expect(403, done);
                });
        });
    });
});

