(function(){

    /**
     * Create angular modules
     */

    angular.module('ucrCareerControllers', ['ui.bootstrap']);
    angular.module('ucrCareerServices',    ['LocalStorageModule']);
    angular.module('ucrCareer',            ['ngRoute', 'ngMessages', 'ucrCareerControllers', 'ucrCareerServices']);
        
    /**
     * Set constants
     */

    angular.module('ucrCareer')
        .constant('USER_ROLES', {
            all: '*',
            guest: 'guest',
            applicant: 'applicant',
            employer: 'employer'
        });

    /**
     * Configure modules
     */
    
    angular.module('ucrCareerServices')
        .config(['localStorageServiceProvider', function(localStorageServiceProvider){
            localStorageServiceProvider.setPrefix('ucrCareer');
            localStorageServiceProvider.setStorageCookie(45, '/');
        }]);        
    
    angular.module('ucrCareer')
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
                controller: 'jobPostingCtrl'
	        }).otherwise({
                redirectTo: '/'
            });
        }]);

})();
