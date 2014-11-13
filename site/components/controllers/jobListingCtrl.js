angular.module('ucrCareerControllers')
    .controller('JobListingCtrl', ['$scope', '$location', 'User', 'PostService', 
    function JobListingCtrl($scope, $location, User, PostService){
        $scope.jobListingData = PostService.getJobPostingData();
    }]);
