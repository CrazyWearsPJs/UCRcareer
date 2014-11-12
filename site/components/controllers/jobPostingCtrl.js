angular.module('ucrCareerControllers')
    .controller('JobPostingCtrl', ['$scope', '$location', 'User', 'PostService', 'USER_ROLES', function JobPostingCtrl($scope, $location, User, PostService, USER_ROLES){
        $scope.post = {
            'specifics': {}, 
            'location': {}, 
            'date': {},
            'tags': []
        };

        $scope.ok = function() {
            if($scope.post.tags[0]) {
                var tags = $scope.post.tags.toString();
                $scope.post.tags = tags.split(" ");
            }
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
