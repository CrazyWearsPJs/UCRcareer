angular.module('huntEdu.controllers')
    .controller('SearchResultsCtrl',['$scope', '$routeParams','$location', 'jobs', 
        function ($scope, $routeParams, $location, jobs){
            $scope.filter = {
                selected: {
                    companyName: false,
                    location: {
                        state: false
                    },
                    specifics: {
                        jobTitle: false
                    }
                },
                companyName: "",
                location: {
                    state: ""
                },
                specifics: {
                    jobTitle: ""
                }
            }; 
            
            $scope.jobFilter = function() {
                var filterObj = {};

                if ($scope.filter.selected.companyName) {
                    filterObj.companyName = $scope.filter.companyName;
                } 

                if($scope.filter.selected.location.state){
                    filterObj.location = {
                        state : $scope.filter.location.state
                    };
                }

                if($scope.filter.selected.specifics.jobTitle) {
                    filterObj.specifics = {
                        jobTitle : $scope.filter.specifics.jobTitle
                    };
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
