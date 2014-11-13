angular.module('ucrCareerControllers')
    .controller('JobPostingCtrl', ['$scope', '$location', 'User', 'PostService', 
    function JobPostingCtrl($scope, $location, User, PostService){
        var redirectPath = '/';
        $scope.post = {
            'specifics': {}, 
            'location': {}, 
            'date': {},
            'media': {},
            'tags': []
        };

        /*
         * If they are not an employer,
         * kick them out!
         */

        $scope.$on('$viewContentLoaded', function() {
            if(!User.isEmployer()) {
                $location.path(redirectPath);
            }
        });

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
                $location.path(redirectPath);
            }
        };

        $scope.cancel = function() {
            $location.path(redirectPath);
        };
    }]);
