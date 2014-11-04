angular.module('ucrCareerServices')
    .service('AuthService', ['$http','$q', 'User',
    function($http, $q, User){
        var authTokenSuffix = 'api-token',
            extend = angular.extend;

        var setPermissions = function(permission) {
            //TODO: set permissions on login;
        };

        
        this.heartBeat = function(credentials) {
            var deferred = $q.defer(0;
            $http.post('/api/v1/heartbeat')
                .then(function() {
                    setPermissions();              
                }, function(data) {
                
                });
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

        this.registerApplicant = function() {
            var deferred = $q.defer(),
                registrationData = extend(User.getProfileData(),
                    User.getLoginCredentials());
           
           $http.post('/api/v1/register/applicant', registrationData)
                .then(function(data) {
                    setPermissions();
                    deferred.resolve(data);   
                }, function(data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        };
    }]);
