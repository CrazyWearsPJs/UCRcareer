angular.module('ucrCareerServices')
    .factory('User', [ function() {
        var forEach = angular.forEach,
            isFunction = angular.isFunction,
            copy = angular.copy;
        
        var PROFILE_DATA_FIELDS = ['personal', 'contact', 'spec',
            'location']; 

        var User = {
            'credentials': {
                'email': null, 
                'password': null,
                'authKey': null
            },
            'personal': {
                'fName': null,
                'mInit': null,
                'lName': null,
                'jobTitle': null
            },
            'contact': {
                'website': null,
                'linkedIn': null,
                'facebook': null,
                'twitter': null,
                'phoneNum': null,
                'email': null
            }, 
            'spec': {
                'degree': null,
                'univ': null,
                'year': null,
                'resume': null,
                'focus': null
            },
            'location': {
                'city': null,
                'state': null,
                'zip': null,
                'address': null,
                'country': null
            }
        };

        User.addCredentials = function(email, password) {
            this.credentials.email = email;
            this.credentials.password = password;
        };

        User.getCredentials = function() {
            return User.credentials;
        };

        User.clearPassword = function() {
            User.credentials.password = null;
        };

        User.clearAuthToken = function() {
            User.credentials.authToken = null;
        };

        User.getAll = function() {
            var info = {};
            forEach(User, function(value, key){
                if(!isFunction(value)) {
                    info[key] = value; 
                }
            });
            return info;
        };

        User.getProfileData = function() {
            var info = {};
           
            forEach(User, function(_, key) {
                forEach(PROFILE_DATA_FIELDS, function(value,
                    profileDataField) {
                    if(key === profileDataField) {
                        copy(info[profileDataField], value);
                    }
                });  
            });
            return info;
        };

        User.getLoginCredentials = function() {
            var info = {},
                credentials = User.getCredentials();
            forEach(credentials, function(value, key) {
                if(key === 'email' || key === 'password') {
                    info[key] = value;
                }
            });
            return info;
        };
   
        User.storeAuthToken = function(authToken) {
            if(authToken) {
                User.credentials.authToken = authToken;
            }
        };

        User.getAuthToken = function() {
            return User.credentials.authToken;
        };
        
        return User;
    }]);
