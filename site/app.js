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
            }).otherwise({
                    redirectTo: '/'
            });
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
