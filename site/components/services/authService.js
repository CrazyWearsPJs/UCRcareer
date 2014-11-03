angular.module('ucrCareerServices')
    .service('AuthService', ['$http','$q', 'localStorageService', 'User',
    function($http, $q, localStorageService, User){
        var authTokenSuffix = 'api-token',
            getCookie = localStorageService.cookie.get,
            setCookie = localStorageService.cookie.set,
            removeCookie = localStorageService.cooke.remove,
            extend = angular.extend;

        this.authWithToken = function(authToken) {
            var deferred = $q.defer();
            $http.post('/api/v1/login', {
                'authToken': authToken    
            }).then(function(data) {
                if(data.hasOwnProperty('profileData') ) {
                    User.fillProfileData(data.profileData);        
                }                
                deferred.resolve(data);
            },function(data){
                // if error    
                deferred.reject(data);
            });  
            return deferred.promise;
        };

        this.storeAuthToken = function(authToken) {
            setCookie(authTokenSuffix, authToken);
            User.setAuthToken(authToken);
        };

        this.retriveAuthToken = function() {
            var authToken = getCookie(authTokenSuffix, authToken);
            User.setAuthToken(authToken);
        };

        this.login = function(credentials) {
            var deferred = $q.defer();
            $http.post('/api/v1/login', credentials)
                .then(function(data) {
                    if(data.hasOwnProperty('authToken')) {
                        this.storeAuthToken(data.authToken);
                    }
                    deferred.resolve(data);
                    }, function(data) {
                    deferred.reject(data);
                }); 
            return deferred.promise;
        };

        this.logout = function() {
            removeCookie(authTokenSuffix);
            User.clearAuthToken();
        };

        this.register = function() {
            var deferred = $q.defer(),
                registrationData = extend(User.getProfileData(),
                    User.getLoginCredentials());
           
           $http.post('/api/v1/register', registrationData)
                .then(function(data) {
                    if(data.hasOwnProperty('authToken')) {
                        this.storeAuthToken(data.authToken);
                    }
                    deferred.resolve(data);   
                }, function(data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        };
    }]);
