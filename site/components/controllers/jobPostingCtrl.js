angular.module('ucrCareerControllers')
    .controller('JobPostingCtrl', ['$scope', '$location', 'User', 'PostService', 'USER_ROLES', function JobPostingCtrl($scope, $location, User, PostService, USER_ROLES){
        $scope.post = {
            'specifics': {}, 
            'location': {}, 
            'date': {}
        };

        $scope.ok = function() {
            //if($scope.jobPosting.$valid && User.role === USER_ROLES.employer) {
            if($scope.jobPosting.$valid) {
                PostService.setJobPostData($scope.post);
                PostService.post();
           }
            else {
                $location.path('/');
            }
        };

        $scope.cancel = function() {
            $location.path('/');
        };
    }]);
