angular.module('ucrCareerControllers')
    .controller('JobListingCtrl', ['$scope', '$location', 'User', 'PostService', 'USER_ROLES', 
    function JobListingCtrl($scope, $location, User, PostService, USER_ROLES){
        $scope.jobListingData = PostService.getJobPostingData();
    }]);
