angular.module('ucrCareerServices')
    .factory('User', ['localStorageService', 
     function(localStorageService) {
        var User = {
            'credentials': {
                'email': null, 
                'password': null
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
            this.credentials.password = null;
        };

        User.getAll = function() {
            var info = {};
            angular.forEach(User, function(value, key){
                if(!angular.isFunction(value)) {
                    info[key] = value; 
                }
            });
            return info;
        };

        return User;
    }]);
