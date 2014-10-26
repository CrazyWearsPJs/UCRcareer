angular.module('ucrCareer', ['ngRoute', 'ucrCareerControllers'])
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
