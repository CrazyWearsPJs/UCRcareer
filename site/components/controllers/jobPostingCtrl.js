(function(){

    'use strict';

    /**
     * Job Posting Controller
     */

    function JobPostingCtrl($scope, $location, User, AuthService, USER_ROLES){
        $scope.post = {
            'specifics': {}, 
            'location': {}, 
            'date': {}
        };

        var credentials = User.getCredentials();
        if (credentials.email !== null) {
            $scope.user.email = credentials.email;
        }
        
        $scope.ok = function() {
            if($scope.jobPosting.$valid) {
                //console.log(User);
                //User.setCredentials($scope.user.credentials.email, $scope.user.credentials.password);
                //User.setProfileData($scope.user, USER_ROLES.employer);
                //AuthService.register(USER_ROLES.employer);
                PostService.post(USER_ROLES.employer);
            }
        };

        $scope.cancel = function() {
            $location.path('/');
        };
    }

    /**
     * Register functions
     */
    
    angular.module('ucrCareerControllers')
        .controller('JobPostingCtrl', 
            [
                '$scope'
              , '$location'
              , 'User'
              , 'USER_ROLES'
              , JobPostingCtrl
            ]);

})();

