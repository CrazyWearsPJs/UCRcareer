(function(){

    'use strict';

    /**
     * Users Factory
     */
    
    function UserFactory(USER_ROLES) {
        var forEach = angular.forEach,
            isFunction = angular.isFunction,
            isObject = angular.isObject,
            copy = angular.copy;

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

        var unionArray = function(a, b) {
            var newArr = copy(a),
                found = false;
            forEach(b, function(bValue) {
                found = false;
                forEach(a, function(aValue) {
                    if(bValue === aValue) {
                        found = true;   
                    }
                });
                if(!found) {
                    newArr.push(bValue);
                }
            });

            return newArr;
        };

        var getProfileDataFields = function(role) {
              if(role === USER_ROLES.employer) {
                return employerProfileData;
              } else if (role === USER_ROLES.applicant) {
                return applicantProfileData;
              }
              return [];
        };

       
        var PROFILE_DATA_FIELDS = {};

        PROFILE_DATA_FIELDS[USER_ROLES.all] =  ['personal', 'contact', 'spec', 'location'];
        PROFILE_DATA_FIELDS[USER_ROLES.applicant] = ['spec'];
        PROFILE_DATA_FIELDS[USER_ROLES.employer] = ['companyName'];
        
        var employerProfileData = unionArray(PROFILE_DATA_FIELDS[USER_ROLES.all], PROFILE_DATA_FIELDS[USER_ROLES.employer]),
            applicantProfileData = unionArray(PROFILE_DATA_FIELDS[USER_ROLES.all], PROFILE_DATA_FIELDS[USER_ROLES.applicant]); 


        var User = {
            'companyName': null,
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
            }, 
            'role': USER_ROLES.guest, 
        };


        User.setCredentials = function(email, password) {
            this.credentials.email = email;
            this.credentials.password = password;
        };

        User.getCredentials = function() {
            return User.credentials;
        };

        User.getUserRole = function() {
            return User.role;
        };

        User.setUserRole = function(role) {
            User.role = role;
        };

        User.clearPassword = function() {
            User.credentials.password = null;
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

        User.setProfileData = function(data,  role) {
            var profileDataFields = getProfileDataFields(role);
            forEach(data, function(value, key) {
                if(profileDataFields.indexOf(key) !== -1) {
                    User[key] = copyNonNull(data[key]);
                }
            });
        };

        User.getProfileData = function(role) {
            var info = {},
                profileDataFields = getProfileDataFields(role);
            
            forEach(User, function(value, key) {
                forEach(profileDataFields, function(profileDataField) {
                    if(value && key === profileDataField) {
                        info[profileDataField] = 
                            copyNonNull(value);
                    }
                });  
            });
            return info;
        };

        User.getLoginCredentials = function() {
            var info = {
                credentials: {}
            },
            credentials = User.getCredentials();
            
            forEach(credentials, function(value, key) {
                if((key === 'email' || key === 'password') && value) {
                    info.credentials[key] = value;
                }
            });
            return info;
        };

        return User;
    }

    /**
     * Register functions
     */

    angular.module('ucrCareerServices')
        .factory('User',
            [   
                'USER_ROLES'
              , UserFactory
            ]);

})();
