angular.module('ucrCareerServices')
    .factory('User', ['localStorageService', function(localStorageService){
       var User = {
            'email': null, 
            'password': null
        };

        User.addCredentials = function(email, password) {
            this.email = email;
            this.password = password;
        };

        User.getCredentials = function() {
            return {
                'email' : this.email,
                'password': this.password
            };
        };

        User.clearPassword = function() {
            this.password = null;
        };

        return User;
    }]);
