angular.module('ucrCareerServices')
    .service('AuthService', ['$http','$q', 'User',
    function($http, $q, User){
        var authTokenSuffix = 'api-token',
            extend = angular.extend;

        var setPermissions = function(role) {
            User.setUserRole(role);
        };
        
        this.heartBeat = function(credentials) {
            var deferred = $q.defer();
            $http.post('/api/v1/heartbeat')
                .then(function() {
                    setPermissions();              
                }, function(data) {
                
                });
            return deferred.promise;
        };

        this.login = function(credentials) {
            var deferred = $q.defer();
            $http.post('/api/v1/login', credentials)
                .then(function(data) {
                    setPermissions();
                    deferred.resolve(data);
                    }, function(data) {
                    deferred.reject(data);
                }); 
            return deferred.promise;
        };

        this.logout = function() {
            $http.post('/api/v1/logout');
        };

        this.register = function(role) {
            var deferred = $q.defer(),
                registrationRoutePrefix = '/api/v1/register', 
                registrationData = extend(User.getProfileData(role),
                    User.getLoginCredentials());
           $http.post(registrationRoutePrefix + '/' + role, registrationData)
                .then(function(data) {
                    setPermissions(role);
                    deferred.resolve(data);   
                }, function(data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        };
    }]);
