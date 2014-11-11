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
            $http.post('/heartbeat')
                .then(function() {
                    setPermissions();              
                }, function(data) {
                
                });
            return deferred.promise;
        };

        this.login = function(credentials) {
            var deferred = $q.defer();
            $http.post('/login', credentials)
                .then(function(data) {
                    role = data.type;
                    setPermissions(role);
                    User.setProfileData(data, role);
                    deferred.resolve(data);
                    }, function(data) {
                    deferred.reject(data);
                }); 
            return deferred.promise;
        };

        this.logout = function() {
            $http.post('/logout');
        };

        this.register = function(role) {
            var deferred = $q.defer(),
                registrationRoutePrefix = '/register', 
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
