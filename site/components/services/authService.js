angular.module('ucrCareerServices')
    .service('AuthService', ['$rootScope', '$http','$q', 'User', 'USER_ROLES', 'LOGIN_EVENTS', 
        function AuthService($rootScope, $http, $q, User, USER_ROLES, LOGIN_EVENTS){
        var extend = angular.extend;

        this.heartbeat = function() {
            var deferred = $q.defer();
            $http.post('/heartbeat')
                .then(function(res) {
                    var profileData = res.data,
                        role = profileData.type;
                    
                    User.setUserRole(role);
                    
                    User.setProfileData(profileData, role);
                    
                    deferred.resolve(profileData);
                }, function(err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        this.login = function() {
            var deferred = $q.defer(),
                credentials = User.getCredentials();
            $http.post('/login', credentials)
                .then(function(res) {
                        var profileData = res.data, 
                            role = profileData.type;
                        
                        User.setUserRole(role);
                        
                        User.setProfileData(profileData, role);
                        
                        $rootScope.$broadcast(LOGIN_EVENTS.successful, role);
                        
                        deferred.resolve(profileData);
                    }, function(err) {
                        $rootScope.$broadcast(LOGIN_EVENTS.failed, err);
                        deferred.reject(err);
                }); 
            return deferred.promise;
        };

        this.logout = function() {
            var deferred = $q.defer();

            if(User.isGuest()) {
                deferred.reject();
                return deferred.promise;
            }

            $http.post('/logout' + '/' + User.getUserRole())
                .then(function(){
                    User.setUserRole(USER_ROLES.guest);
                    $rootScope.$broadcast(LOGIN_EVENTS.logout); 
                    deferred.resolve();
                }, deferred.reject);
            
            return deferred.promise;
        };

        this.register = function(role) {
            var deferred = $q.defer(),
                registrationRoutePrefix = '/register', 
                registrationData = extend(User.getProfileData(role),
                   {"credentials": User.getCredentials() });
            $http.post(registrationRoutePrefix + '/' + role, registrationData)
                .then(function() {
                    User.setUserRole(role);
                    $rootScope.$broadcast(LOGIN_EVENTS.successful);
                    deferred.resolve();   
                }, function(err) {
                    $rootScope.$broadcast(LOGIN_EVENTS.failed, err);
                    deferred.reject(err);
                });
            return deferred.promise;
        };
    }]);
