angular.module('huntEdu.controllers')
    .controller('JobReviewCtrl',['$scope', '$location',  
        function ($scope, $location){
            
            $scope.reviewData = job.getReviews();
            
            /*Ratings*/
            $scope.rate = 0;
            $scope.max = 5;
            $scope.isReadonly = true;

            $scope.hoveringOver = function(value) {
                $scope.overStar = value;
                $scope.percent = 100 * (value / $scope.max);
            }; 
    }]);
