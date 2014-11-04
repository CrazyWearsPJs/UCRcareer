angular.module('ucrCareerServices')
    .factory('User', [ function() {
        var forEach = angular.forEach,
            isFunction = angular.isFunction,
            isObject = angular.isObject,
            copy = angular.copy;
        
        var PROFILE_DATA_FIELDS = ['personal', 'contact', 'spec',
            'location']; 


        var User = {
            'credentials': {
                'email': null, 
                'password': null
            },
            'personal': {
                'fName': null,
                'mInit': null,
                'lName': null
            },
            'contact': {
                'website': null,
                'linkedIn': null,
                'facebook': null,
                'twitter': null,
                'phoneNum': null
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
                'address1': null,
                'address2': null,
                'country': null
            }
        };

        var copyNonNull = function(src, dest) { 
            if(dest) {
                copy(src, dest);
            } else {
                dest = copy(src); 
            }

            if(isObject(dest)) {
                forEach(dest, function(value, key) {
                    if(!value) {
                        delete dest[key];
                    }
                });
            }
            return dest;
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
                    info[key] = copyNonNull(value); 
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
                        info[profileDataField] = copyNonNull(value);
                    }
                });  
            });
            return info;
        };

        User.getLoginCredentials = function() {
            var info = {},
                credentials = User.getCredentials();
            forEach(credentials, function(value, key) {
                if((key === 'email' || key === 'password') && value) {
                    info[key] = value;
                }
            });
            return info;
        };
   
        return User;
    }]);
