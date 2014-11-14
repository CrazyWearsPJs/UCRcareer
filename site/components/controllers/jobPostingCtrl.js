angular.module('ucrCareerControllers')
    .controller('JobPostingCtrl', ['$scope', '$location', 'User', 'PostService', 'JobPost', 'JobListService', 
    function JobPostingCtrl($scope, $location, User, PostService, JobPost, JobListService){
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
            if($scope.jobPosting.$valid) {                
                var job = new JobPost($scope.post);
                PostService.postJob(job)
                    .then(function(){
                        //if successful
                        JobListService.setNewJob(job);
                        $location.path('/newJob');
                    });
           }
            else {
                $location.path(redirectPath);
            }
        };

        $scope.cancel = function() {
            $location.path(redirectPath);
        };
    }]);
