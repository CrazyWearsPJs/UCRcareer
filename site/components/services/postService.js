angular.module('ucrCareerServices')
    .service('PostService', ['$http','$q', 'User',
    function($http, $q, User){
        var authTokenSuffix = 'api-token',
            extend = angular.extend;

        var setPermissions = function(role) {
            User.setUserRole(role);
        };
        
        this.heartBeat = function(credentials) {
            var deferred = $q.defer();
            $http.post('/heartbeat')
                .then(function() {
                    setPermissions();              
                }, function(data) {
                
                });
            return deferred.promise;
        };

        this.post = function(role) {
            var deferred = $q.defer(),
                jobPostingRoutePrefix = '/post',
                jobPostingData = extend(User.getPostingData())); // TODO create the get posting data function for users!!!
            $http.post(jobPostingRoutePrefix, jobPostingData)
                .then(function(data) {
                    deferred.resolve(data);
                }, function(data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        };
    }]);
