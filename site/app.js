angular.module('ucrCareer', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/', {
                templateUrl: 'templates/splash.html'//,
               // controller: 'splashCtrl' 
            }).
            otherwise({
                redirectTo: '/'
            });
        }]);

