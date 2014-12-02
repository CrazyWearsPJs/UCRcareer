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

var dbSettings = config.dbSettings
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
      , interests: []
      , bookmarkedPosts: []
      , postNotifications: []
};
 
var employer = {  
      companyName: 'Google Inc'
      , credentials: {
            password: "password1"
          , email:    "jdoe002@ucr.edu"
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
      , posts: []
};

var jobPost = {
      specifics: {
          jobTitle: "Software Engineer"
        , companyName: 'Google Inc'
        , description: "Develop software"
        , requirements: "Programming experience"
        , salary: "$80,000"
        , application: "application link"
        , department: "Computers"
        , jobType: "IT developer"
      }
    , location: {
          city: "Riverside"
        , state: "California"
      }
    , date: {
          postedOn: "April 1, 2014"
        , endsOn: "October 31, 2014"
      }
};

function deepClone(a) {
       return JSON.parse(JSON.stringify(a));
}

describe('routes', function (){
   var apiPrefix = '/api/v1'
    , applicantRouteSuffix = '/applicant'
    , employerRouteSuffix = '/employer';
    
    
    var registerRoutePrefix = '/register'  
    , loginRoutePrefix = '/login'
    , updateProfilePrefix = '/profile'
    , jobPostingRoutePrefix = '/post'
    , jobReviewRouteSuffix = '/review'
    , idParam = '/id';


    var registerApplicantRoute = registerRoutePrefix + applicantRouteSuffix
    , registerEmployerRoute = registerRoutePrefix + employerRouteSuffix; 
         
    var loginRoute = loginRoutePrefix;

    var updateApplicantProfileRoute = updateProfilePrefix + applicantRouteSuffix,
        updateEmployerProfileRoute = updateProfilePrefix + employerRouteSuffix;

    before('Setup app and create a db connection', function(done) {
        app = express();

        db = mongoose.createConnection(dbSettings.host
                                     , dbSettings.database
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

    describe('POST /register', function (){
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
 
    describe('POST /login', function(){
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
                    var profileData = deepClone(applicant);
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

                    var invalidCredentials = deepClone(applicantCredentials);
                    
                    invalidCredentials.password += "wrong";

                    request(app)
                        .post(loginRoute)
                        .send(invalidCredentials)
                        .expect(403, done);
                });
                it('should not allow an unregistered user to login', function(done) {
                    var invalidCredentials = deepClone(applicantCredentials);
                    invalidCredentials.email = "Not" + invalidCredentials.email;

                    request(app)
                        .post(loginRoute)
                        .send(invalidCredentials)
                        .expect(403, done);
                });
        });

        describe('#employer', function() { 
            before( 'register employer', function(done) {
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
                    var profileData = deepClone(employer);
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

                    var invalidCredentials = deepClone(employerCredentials);
                    
                    invalidCredentials.password += "wrong";

                    request(app)
                        .post(loginRoute)
                        .send(invalidCredentials)
                        .expect(403, done);
                });
                it('should not allow an unregistered user to login', function(done) {
                    var invalidCredentials = deepClone(employerCredentials);
                    invalidCredentials.email = "Not" + invalidCredentials.email;

                    request(app)
                        .post(loginRoute)
                        .send(invalidCredentials)
                        .expect(403, done);
                });
        });
    });

    describe('POST /profile', function() {
        describe('/applicant', function(e) {
             var updatedInfo = {
                spec: {
                    degree: "Computer Engineering"
                },
                email: applicant.credentials.email
             }
             , agent = null;

             beforeEach('register applicant', function(done) {
                    agent = request.agent(app);
                    agent
                        .post(registerApplicantRoute)
                        .send(applicant)
                        .expect(200, done);
             });

             afterEach('destory applicant db', function(done) {
                agent = null;
                models.applicant().remove({}, function(err) {
                    done();
                });
             });
             
             it('should update profile info given valid fields', function(done){
                agent
                    .post(updateApplicantProfileRoute)
                    .send(updatedInfo)
                    .expect(200)
                    .end(function(err, res) {
                        var cloneApplicant = deepClone(applicant);
                        cloneApplicant.spec.degree = updatedInfo.spec.degree;
                        delete cloneApplicant.credentials;
                        models.applicant().findByEmail(applicant.credentials.email, function(err, _applicant){
                            expect(_applicant.getProfileData()).to.be.deep.equal(cloneApplicant);
                            done();
                        });                       
                    });
             });

            it('should not allow credentials to be changed', function(done) {
                agent
                    .post(updateApplicantProfileRoute)
                    .send({
                        email: applicant.credentials.email,
                        credentials: {
                            email: "alex@alex.com",
                            password: "abc12345678"
                        }
                    })
                    .expect(400, done);
             });

        });
        describe('/employer', function() {
             var updatedInfo = {
                companyName: "Amazon",
                email: employer.credentials.email
             }
             , agent = null;

             beforeEach('register employer', function(done) {
                    agent = request.agent(app);
                    agent
                        .post(registerEmployerRoute)
                        .send(employer)
                        .expect(200, done);
             });

             afterEach('destory employer db', function(done) {
                agent = null;
                models.employer().remove({}, function(err) {
                    done();
                });
             });
             
             it('should update profile info given valid fields', function(done){
                agent
                    .post(updateEmployerProfileRoute)
                    .send(updatedInfo)
                    .expect(200)
                    .end(function(err, res) {
                        var cloneEmployer = deepClone(employer);
                        cloneEmployer.companyName = updatedInfo.companyName;
                        delete cloneEmployer.credentials;
                        models.employer().findByEmail(employer.credentials.email, function(err, _employer){
                            expect(_employer.getProfileData()).to.be.deep.equal(cloneEmployer);
                            done();
                        });                       
                    });
             });

             it('should not allow credentials to be changed', function(done) {
                agent
                    .post(updateEmployerProfileRoute)
                    .send({
                        email: employer.credentials.email,
                        credentials: {
                            email: "alex@alex.com",
                            password: "abc12345678"
                        }
                    })
                    .expect(400, done);
             });
        });
    });
    
    describe('POST /post', function (){
        var agent = null;

        after('destroy applicant/employer/post db', function(done) {
            models.jobPosting().remove({}, function(err) {
                models.employer().remove({}, function(err){
                    models.applicant().remove({}, done);
                });
            }); 
        });

        afterEach('reset cookie agent', function() {
            agent = null;
        });
        
        before('register applicant', function(done) {
                request(app)
                    .post(registerApplicantRoute)
                    .send(applicant)
                    .expect(200, done);
        });
        
        before('register employer', function(done) {
                request(app)
                    .post(registerEmployerRoute)
                    .send(employer)
                    .expect(200, done);
        });

        beforeEach('register new cookie agent', function() {
            agent = request.agent(app);
        });

        it('should post job successfully as employer', function(done) {
            agent
                .post(loginRoute)
                .send(employer.credentials)
                .end(function(err, res) {
                    agent
                        .post(jobPostingRoutePrefix)
                        .send(jobPost)
                        .expect(200, done);
                });
        });  

        it('should not save given invalid posting data', function(done) {
            agent
                .post(loginRoute)
                .send(employer.credentials)
                .end(function(err, res) {
                    agent
                        .post(jobPostingRoutePrefix)
                        .send({
                            city: 'Riverside'
                         , state: 'California'    
                        })
                        .expect(400, done);
                });
        });

        it('should not save if not logged in as an applicant', function(done) {
           agent
                .post(loginRoute)
                .send(applicant.credentials)
                .end(function(err, res) {
                    agent
                        .post(jobPostingRoutePrefix)
                        .send(jobPost)
                        .expect(403, done);
                });
        });

       });
 
    describe('POST /post/id/:id', function (){
        var agent = null, 
            employer2 =  deepClone(employer);
        
        employer2.credentials.email = "eviluser001@gmail.com";

        after('destroy applicant/employer/post db', function(done) {
            models.jobPosting().remove({}, function(err) {
                models.employer().remove({}, function(err){
                    models.applicant().remove({}, done);
                });
            }); 
        });

        afterEach('reset cookie agent', function() {
            agent = null;
        });
        
        before('register employer', function(done) {
                request(app)
                    .post(registerEmployerRoute)
                    .send(employer)
                    .expect(200, done);
        });

        before('register another employer', function(done) {
                request(app)
                    .post(registerEmployerRoute)
                    .send(employer2)
                    .expect(200, done);
        });

        beforeEach('register new cookie agent', function() {
            agent = request.agent(app);
        });
        
        before('add job post', function(done) {
            agent = request.agent(app);
            agent
                .post(loginRoute)
                .send(employer.credentials)
                .end(function(err, res) {
                    agent
                        .post(jobPostingRoutePrefix)
                        .send(jobPost)
                        .expect(200, done);
                });
        });  

        it('should edit job successfully as employer (owner)', function(done) {
            agent
                .post(loginRoute)
                .send(employer.credentials)
                .end(function(err, res) {
                    agent
                        .post(jobPostingRoutePrefix)
                        .send(jobPost)
                        .expect(200, done);
                });
        });  

        it('should not edit job if not original creator of post', function(done) {
            agent
                .post(loginRoute)
                .send(employer2.credentials)
                .end(function(err, res) {
                    models.jobPosting().findOne(jobPost, function(err, post) {

                        var urlId = post.meta.id,
                        jobPostEditRoute = jobPostingRoutePrefix + idParam + "/" +  urlId;
                        agent
                            .post(jobPostEditRoute) 
                            .send({'location': {
                                city: 'Riverside'
                             , state: 'California'
                            }})
                            .expect(403, done);
                    });
                });
        });

        it('should not save if not logged in as an applicant', function(done) {
           agent
                .post(loginRoute)
                .send(applicant.credentials)
                .end(function(err, res) {
                    agent
                        .post(jobPostingRoutePrefix)
                        .send(jobPost)
                        .expect(403, done);
                });
        });

       });
   
     describe('GET /post', function() {
        var agent = null;        
        
        after('destroy applicant/employer/post db', function(done) {
            models.jobPosting().remove({}, function(err) {
                models.employer().remove({}, function(err){
                    models.applicant().remove({}, done);
                });
            }); 
        });

        afterEach('reset cookie agent', function() {
            agent = null;
        });
        
        before('register employer', function(done) {
                request(app)
                    .post(registerEmployerRoute)
                    .send(employer)
                    .expect(200, done);
        });

        beforeEach('register new cookie agent', function() {
            agent = request.agent(app);
        });
        
        before('add two job posts', function(done) {
            agent = request.agent(app);
            agent
                .post(loginRoute)
                .send(employer.credentials)
                .end(function(err, res) {
                    agent
                        .post(jobPostingRoutePrefix)
                        .send(jobPost)
                        .expect(200)
                        .end(function(err, res) {
                            agent 
                                .post(jobPostingRoutePrefix)
                                .send(jobPost)
                                .expect(200, done);
                        });
                });
        });  

        it('should return own job posts', function(done) {
            agent
                .post(loginRoute)
                .send(employer.credentials)
                .end(function(err, res) {
                    agent
                        .get(jobPostingRoutePrefix)
                        .expect(200)
                        .end(function(err, res) {
                            var posts = res.body;
                            expect(posts).to.have.length(2);
                            _.forEach(posts, function(post) {
                                expect(post).to.contain.keys("meta", "reviews", "specifics", "tags", "location", "date");
                                expect(post.specifics).to.deep.equal(jobPost.specifics);
                                expect(post.location).to.deep.equal(jobPost.location);
                                expect(post.date).to.deep.equal(jobPost.date);
                            });
                            done();
                        });
                });
        });  
     });


    describe('GET /search', function (){
            it('should return a list of job posts', function(done) {
                var keyword = 'software';
                request(app)
                    .get('/search' + '/' + keyword)
                    .expect(200, done);
            });
    });

        describe('POST /post/id/:id/review', function() {
        var agent = null;
        var reviewContent = {
            title : "This is the bes",
            body: "Resturant I have ever been to. Wait, wrong site.",
            rating: 5
        };

        before('register applicant', function(done) {
                request(app)
                    .post(registerApplicantRoute)
                    .send(applicant)
                    .expect(200, done);
        });
         
        before('register employer', function(done) {
                request(app)
                    .post(registerEmployerRoute)
                    .send(employer)
                    .expect(200, done);
        });

        before('have employer post job', function(done) {
           agent = request.agent(app);
           agent
                .post(loginRoute)
                .send(employer.credentials)
                .end(function(err, res) {
                    agent
                        .post(jobPostingRoutePrefix)
                        .send(jobPost)
                        .expect(200, done);
                });

        });

        after('destroy applicant/employer/post db', function(done) {
            models.jobPosting().remove({}, function(err) {
                models.employer().remove({}, function(err){
                    models.applicant().remove({}, done);
                });
            }); 
        });
  
        beforeEach('register new cookie agent', function() {
            agent = request.agent(app);
        });
        
        it('should post a job review', function(done) {
            //login as applicant
            agent
                .post(loginRoute)
                .send(applicant.credentials)
                .end(function() {
                    // then find jobPosting
                    models.jobPosting().findOne(jobPost, function(err, post) {

                        var urlId = post.meta.id,
                        jobReviewRoute = jobPostingRoutePrefix + idParam + "/" +  urlId + jobReviewRouteSuffix;

                        agent
                            .post(jobReviewRoute)
                            .send(reviewContent)
                            .expect(200, done);                  
                    }); 
                });
        });
    });
});
