angular.module('huntEdu', ['ngRoute', 'ngMessages', 'btford.socket-io', 'huntEdu.controllers', 'huntEdu.services', 'huntEdu.directives'])
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
    .service('socket', ['socketFactory', function(socketFactory){
        return socketFactory();
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
    .filter('orderReviews', ['_', function(_) {
        var sortBy = _.sortBy;
        return function orderReviews(input) {
            return sortBy(input, function(review) {
                return new Date(review.timestamps.created);
            }).reverse();
        };
    }])
    .filter('filterJobs', ['_', function(_) {
        var isEmpty = _.isEmpty,
            filter = _.filter,
            some = _.some,
            has = _.has;
        return function filterJobs(input, searchFilterObj) {
            if(isEmpty(searchFilterObj)) {
                return input;
            }

            return filter(input, function(job) {
                var jobFilterObj = job.toFilterObj();
                return some(jobFilterObj, function(value, key) {
                    if(!has(searchFilterObj, key) || typeof value !== "string") {
                        return false;
                    }
                    var actual = value.toLowerCase(),
                        expected = searchFilterObj[key].toLowerCase();
                    
                    return actual.indexOf(expected) !== -1;
                });
            });
        };
    }])
    /* inject lodash as a util factory */
    .factory('_', ['$window', function($window) {
        return $window._;
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

angular.module('huntEdu.directives', ['huntEdu.controllers']);

angular.module('huntEdu.controllers', ['ui.bootstrap', 'youtube-embed']);

angular.module('huntEdu.services', ['LocalStorageModule'])
    .config(['localStorageServiceProvider', function(localStorageServiceProvider){
        localStorageServiceProvider.setPrefix('huntEdu');
        localStorageServiceProvider.setStorageCookie(45, '/');
    }]);        
