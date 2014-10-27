angular.module('ucrCareer', ['ngRoute', 'ucrCareerControllers', 'ucrCareerServices'])
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

angular.module('ucrCareerServices', []);
