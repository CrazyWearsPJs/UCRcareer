(function(){

    'use strict';

    /**
     * Job Posting Controller
     */

    function JobPostingCtrl($scope, $location, User, PostService, USER_ROLES){
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
            if($scope.jobPosting.$valid && User.role == USER_ROLES.employer) {
                Post.setJobPostData($scope.post);
                PostService.post();
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
              , 'PostService'
              , 'USER_ROLES'
              , JobPostingCtrl
            ]);
            
})();

