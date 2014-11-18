angular.module('ucrCareer', ['ngRoute', 'ngMessages', 'ucrCareerControllers', 'ucrCareerServices', 'ucrCareerDirectives'])
    .run(['AuthService', function(AuthService){
            AuthService.heartbeat();
    }])
    .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/', {
                templateUrl: 'templates/splash.html',
                controller: 'SplashCtrl' 
            }).when('/applicantRegister', {
                templateUrl: 'templates/register/applicantRegister.html',
                controller: 'ApplicantRegisterCtrl'
            }).when('/employerRegister', {
   	        templateUrl: 'templates/register/employerRegister.html',
            	controller: 'EmployerRegisterCtrl'
            }).when('/jobPosting', {
                templateUrl: 'templates/jobs/jobPosting.html',
       	        controller: 'JobPostingCtrl'
            }).when('/searchResults', {
                templateUrl: 'templates/searchResults.html',
                controller: 'SearchResultsCtrl'
            }).when('/employerProfile', {
                templateUrl: 'templates/employerProfile.html',
                controller: 'EmployerProfileCtrl'
            }).when('/applicantProfile', {
                templateUrl: 'templates/applicantProfile.html',
                controller: 'ApplicantProfileCtrl'
            }).when('/jobListing/:keyword/:index', {
                templateUrl: 'templates/jobs/jobListing.html',
                controller: 'JobListingCtrl'
            }).when('/searchResults/:keyword', {
                templateUrl: 'templates/searchResults.html',
                controller: 'SearchResultsCtrl'
            }).when('/thankyou', {
                templateUrl: 'templates/thankyou.html',
                controller: 'ThankyouCtrl'
            }).when('/updateApplicantProfile', {
                templateUrl: 'templates/updateApplicantProfile.html',
                controller: 'UpdateApplicantProfileCtrl',
            }).when('/updateEmployerProfile', {
                templateUrl: 'templates/updateEmployerProfile.html',
                controller: 'UpdateEmployerProfileCtrl',
            }).when('/newJob', {
                templateUrl: 'templates/jobs/jobListing.html',
                controller: 'NewJobCtrl'
            }).when('/home', {
                templateUrl: 'templates/home.html',
                controller: 'HomeCtrl',
                resolve: {
                    jobs: function(JobListService){
                        return JobListService.getRecommendedJobs();
                    }
                }    
            }).otherwise({
                    redirectTo: '/'
            });
    }])
    .directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;
                
                element.bind('change', function(){
                    scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }])
    .service('fileUpload', ['$http', function ($http) {
        this.uploadFileToUrl = function(file, uploadUrl, cb){
            var fd = new FormData();
            fd.append('file', file);
            $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': 'multipart/form-data'}
            })
            .success(function(){
                cb();
            })
            .error(function(){
            });
        };
    }])
    .filter('join', function() {
        return function join(input, delimiter) {
            input = input || [];
            delimiter = delimiter ||  ", ";
            return input.join(delimiter);
        };
    })
    .constant('USER_ROLES', {
        all: '*',
        guest: 'guest',
        applicant: 'applicant',
        employer: 'employer'
    })
    .constant('LOGIN_EVENTS', {
        successful: 'loginSucessful',
        failed: 'loginFailed',
        logout: 'logout'
    });


angular.module('ucrCareerDirectives', ['ucrCareerControllers']);

angular.module('ucrCareerControllers', ['ui.bootstrap', 'youtube-embed']);

angular.module('ucrCareerServices', ['LocalStorageModule'])
    .config(['localStorageServiceProvider', function(localStorageServiceProvider){
        localStorageServiceProvider.setPrefix('ucrCareer');
        localStorageServiceProvider.setStorageCookie(45, '/');
    }]);        
