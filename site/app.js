angular.module('ucrCareer', ['ngRoute', 'ngMessages', 'ucrCareerControllers', 'ucrCareerServices', 'ucrCareerDirectives'])
    .run(['AuthService', function(AuthService){
            AuthService.heartbeat();
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
                headers: {'Content-Type': undefined}
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
