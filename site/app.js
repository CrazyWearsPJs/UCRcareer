angular.module('ucrCareer', ['ngRoute', 'ngMessages', 'ucrCareerControllers', 'ucrCareerServices'])
    .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/', {
                templateUrl: 'templates/splash.html',
                controller: 'splashCtrl' 
            }).
            otherwise({
                redirectTo: '/'
            });
        }]);

angular.module('ucrCareerControllers', ["ui.bootstrap"]);

angular.module('ucrCareerServices', ['LocalStorageModule'])
    .config(['localStorageServiceProvider', function(localStorageServiceProvider){
        localStorageServiceProvider.setPrefix('ucrCareer');
        localStorageServiceProvider.setStorageCookie(45, '/');
    }]);
