angular.module('huntEdu.controllers')
    .controller('SearchResultsCtrl',['$scope', '$routeParams','$location', 'jobs', 
        function ($scope, $routeParams, $location, jobs){
            $scope.filter = {
                selected: {
                    companyName: false,
                    state: false,
                    jobTitle: false
                },
                companyName: "",
                state: "",
                jobTitle: ""
            }; 
            
            $scope.jobFilter = function() {
                var filterObj = {};

                if ($scope.filter.selected.companyName) {
                    filterObj.specifics = {
                        companyName : $scope.filter.companyName
                    };
                } 

                if($scope.filter.selected.state){
                    filterObj.location = {
                        state : $scope.filter.state
                    };
                }

                if($scope.filter.selected.jobTitle) {
                    if(!filterObj.specifics) {
                        filterObj.specifics = {
                            jobTitle : $scope.filter.jobTitle
                        };
                    } else {
                        filterObj.specifics.jobTitle = $scope.filter.jobTitle;
                    }
                }

                return filterObj;
            };

            $scope.$on('$routeChangeSuccess', function(){
               $scope.searchResultsData = jobs;
               $scope.keyword = $routeParams.keyword;
            });

            $scope.$on('$routeChangeError', function() {
                $location.path('/searchError' + $routeParams.keyword);
            });
    }]);
