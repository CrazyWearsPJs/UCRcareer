angular.module('ucrCareer', ['ngRoute', 'ngMessages', 'ucrCareerControllers', 'ucrCareerServices'])
    .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/', {
                templateUrl: 'templates/splash.html',
                controller: 'SplashCtrl' 
            }).when('/register', {
                templateUrl: 'templates/register.html',
                controller: 'RegisterCtrl'
            }).when('/employerRegister', {
		templateUrl: 'templates/employerRegister.html',
            	controller: 'RegisterCtrl'
            }).otherwise({
                redirectTo: '/'
            });
        }]);

angular.module('ucrCareerControllers', ["ui.bootstrap"]);

angular.module('ucrCareerServices', ['LocalStorageModule'])
    .config(['localStorageServiceProvider', function(localStorageServiceProvider){
        localStorageServiceProvider.setPrefix('ucrCareer');
        localStorageServiceProvider.setStorageCookie(45, '/');
    }]);
