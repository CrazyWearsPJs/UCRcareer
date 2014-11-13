angular.module('ucrCareerControllers')
    .controller('SearchResultsCtrl', ['$scope', '$location', 'User', 'PostService', 
    function SearchResultsCtrl($scope, $location, User, PostService){
        $scope.searchResultsData = PostService.getJobPostingData();
    }]);
