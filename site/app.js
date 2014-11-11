angular.module('ucrCareer', ['ngRoute', 'ngMessages', 'ucrCareerControllers', 'ucrCareerServices'])
    .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/', {
                templateUrl: 'templates/splash.html',
                controller: 'SplashCtrl' 
            }).when('/applicantRegister', {
                templateUrl: 'templates/applicantRegister.html',
                controller: 'ApplicantRegisterCtrl'
            })/*.when('/employerProfile', {
                templateUrl: 'templates/employerProfile.html',
                controller: 'EmployerRegisterCtrl'
            })*/.when('/employerRegister', {
	        templateUrl: 'templates/employerRegister.html',
            	controller: 'EmployerRegisterCtrl'
            }).when('/jobPosting', {
		templateUrl: 'templates/jobPosting.html',
		//TODO Fix this shit. Same name as something else
		controller: 'RegisterCtrl'
	    }).otherwise({
                redirectTo: '/'
            });
    }])
    .constant('USER_ROLES', {
        all: '*',
        guest: 'guest',
        applicant: 'applicant',
        employer: 'employer'
    });

angular.module('ucrCareerControllers', ["ui.bootstrap"]);

angular.module('ucrCareerServices', ['LocalStorageModule'])
    .config(['localStorageServiceProvider', function(localStorageServiceProvider){
        localStorageServiceProvider.setPrefix('ucrCareer');
        localStorageServiceProvider.setStorageCookie(45, '/');
}]);
