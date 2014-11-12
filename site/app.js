angular.module('ucrCareer', ['ngRoute', 'ngMessages', 'ucrCareerControllers', 'ucrCareerServices'])
    .run(['AuthService', function(AuthService){
            AuthService.heartbeat();
    }])
    .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/', {
                templateUrl: 'templates/splash.html',
                controller: 'SplashCtrl' 
            }).when('/applicantRegister', {
                templateUrl: 'templates/applicantRegister.html',
                controller: 'ApplicantRegisterCtrl'
            }).when('/employerRegister', {
   	            templateUrl: 'templates/employerRegister.html',
            	controller: 'EmployerRegisterCtrl'
            }).when('/jobPosting', {
		        templateUrl: 'templates/jobPosting.html',
        		controller: 'JobPostingCtrl'
            }).when('/employerProfile', {
                templateUrl: 'templates/employerProfile.html',
                controller: 'EmployerProfileCtrl'
            }).when('/applicantProfile', {
                templateUrl: 'templates/applicantProfile.html',
                controller: 'ApplicantProfileCtrl'
            }).when('/jobListing', {
                templateUrl: 'templates/jobListing.html',
                controller: 'JobListingCtrl'
	        }).otherwise({
                redirectTo: '/'
        });
    }])
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

angular.module('ucrCareerControllers', ['ui.bootstrap']);

angular.module('ucrCareerServices', ['LocalStorageModule'])
    .config(['localStorageServiceProvider', function(localStorageServiceProvider){
        localStorageServiceProvider.setPrefix('ucrCareer');
        localStorageServiceProvider.setStorageCookie(45, '/');
    }]);        
