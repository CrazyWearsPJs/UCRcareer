angular.module('ucrCareerControllers')
    .controller('JobPostingCtrl', ['$scope', '$location', 'User', 'PostService', 
    function JobPostingCtrl($scope, $location, User, PostService){
        var redirectPath = '/';
        $scope.post = {
            'specifics': {}, 
            'location': {}, 
            'date': {}
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
            if($scope.jobPosting.$valid) {                
                var job = new JobPost($scope.post);
                PostService.postJob(job);
           }
            else {
                $location.path(redirectPath);
            }
        };

        $scope.cancel = function() {
            $location.path(redirectPath);
        };
    }]);
