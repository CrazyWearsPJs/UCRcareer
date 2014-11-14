angular.module('ucrCareerServices')
    .factory('User', ['$http', '$q', 'USER_ROLES', function UserFactory($http, $q, USER_ROLES) {
        var forEach = angular.forEach,
            isFunction = angular.isFunction,
            isObject = angular.isObject,
            isArray = angular.isArray,
            copy = angular.copy,
            equals = angular.equals;

        var EMPTY_OBJECT = {},
            EMPTY_ARRAY = [];

        var copyNonNull = function(src, dest) {
            if(dest) {
                copy(src, dest);
            } else {
                dest = copy(src); 
            }

            if(isObject(dest)) {
                forEach(dest, function(value, field) {
                    if (isArray(value)) {
                        if(equals(EMPTY_ARRAY, value)) {
                            delete dest[field];
                        }
                    }
                    else if(isObject(value)) {
                        if(equals(EMPTY_OBJECT, value)) {
                            delete dest[field];
                        } else {
                            forEach(value, function(propertyVal, propertyKey) {
                                if(!propertyVal) {
                                    delete dest[field][propertyKey];
                                }
                            });
                        }
                    } else if(!value) {
                        delete dest[field];
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

        PROFILE_DATA_FIELDS[USER_ROLES.all] =  ['personal', 'contact', 'location'];
        PROFILE_DATA_FIELDS[USER_ROLES.applicant] = ['spec', 'interests'];
        PROFILE_DATA_FIELDS[USER_ROLES.employer] = ['companyName'];
        
        var employerProfileData = unionArray(PROFILE_DATA_FIELDS[USER_ROLES.all], 
                                            PROFILE_DATA_FIELDS[USER_ROLES.employer]),
            applicantProfileData = unionArray(PROFILE_DATA_FIELDS[USER_ROLES.all],
                                            PROFILE_DATA_FIELDS[USER_ROLES.applicant]); 

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
            'interests': [],
            'role': USER_ROLES.guest, 
        };


        /*
         *  Copies properties from data that are 
         *  different than the current User model.
         *  
         *  @param data {Object} Data to be copied
         *  @param(optional) role {String} role of the current user object
         *
         *  @returns {Object} data with nulled properties and properties
         *  that have the same value of the properties in User deleted
         */
        
        var filterArrayDuplicates = function(arr) {
            var uniqueArr = [];
            forEach(arr, function(value) {
                // if not found in uniqueArray, add to uniqueArray
                if(uniqueArr.indexOf(value) === -1) {
                    uniqueArr.push(value);
                }
            });
            return uniqueArr;
        };

        var copyDifferentProfileData = function(data, role) {
             role = role || User.role;
            var profileDataFields = getProfileDataFields(role),
                _data = copyNonNull(data);

            forEach(profileDataFields, function(value, field) {
                if (_data.hasOwnProperty(field)) {
                    if(equals(_data[field], User[field])) {
                        delete _data[field];
                    } else {
                        forEach(_data[field], function(subPropertyValue, subPropertyKey) {
                            if(equals(_data[field][subPropertyKey], User[field][subPropertyKey])) {
                                delete _data[field][subPropertyKey];
                            }
                        });
                    }
                }
            });

            return _data;
        };

        User.setCredentials = function(email, password) {
            this.credentials.email = email;
            this.credentials.password = password;
        };

        User.getCredentials = function() {
            return User.credentials;
        };

        User.setEmail = function(email) {
            User.credentials.email = email;
        };

        User.getEmail = function() {
            return User.credentials.email;
        };

        User.getUserRole = function() {
            return User.role;
        };

        User.setUserRole = function(role) {
            User.role = role;
        };

        User.isLoggedIn = function() {
            return User.role === USER_ROLES.applicant ||
                User.role === USER_ROLES.employer;
        };

        User.isGuest = function() {
            return User.role === USER_ROLES.guest;
        };

        User.isEmployer = function() {
            return User.role === USER_ROLES.employer;
        };

        User.isApplicant = function() {
            return User.role === USER_ROLES.applicant;
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
            role = role || User.role;
            var profileDataFields = getProfileDataFields(role);
            forEach(data, function(value, key) {
                if(profileDataFields.indexOf(key) !== -1) {
                    if(isObject(value)) {
                        User[key] = copyNonNull(value);
                    } else if(isArray(value)) {
                        User[key] = filterArrayDuplicates(value);
                    } else {
                        User[key] = value;
                    }
                }   
            });
        };

        User.getProfileData = function(role) {
            role = role || User.role;
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

        User.clearAll = function() {
            forEach(User, function(value, key) {
                if(!isFunction(value)) {
                    if(isArray(value)){
                        User[key] = [];
                    } else if (isObject(value)) {
                        User[key] = {};
                    } else {
                        User[key] = null;
                    }
                }
            });
        };

        /**
        * Sends a request to update profile information in the server,
        * if it is valid info, then merge all changes from the backend
        * to the User model in the frontend
        */
        User.updateProfileData = function(data) {
           
            /*
             * crude hack since you cant use email as a URI
             */
           
            var deferred = $q.defer(),
                role = User.role;


            if(!User.isEmployer() && !User.isApplicant()) {
                deferred.reject();
                return deferred.promise;
            }
            
            var updatedProfileData = copyDifferentProfileData(data, role);
            updatedProfileData.email = User.credentials.email;
            
            if(updatedProfileData.interests) {
                updatedProfileData.interests = filterArrayDuplicates(updatedProfileData.interests);
            }

            $http.post('/profile/' + role, updatedProfileData)
                .then(function(res) {
                    var updatedProfileDataResponse = res.data;
                    User.setProfileData(updatedProfileDataResponse);
                    deferred.resolve(res);
                }, function(err) {
                    deferred.reject(err);   
                });

            return deferred.promise;
        };

        return User;
    }]);
