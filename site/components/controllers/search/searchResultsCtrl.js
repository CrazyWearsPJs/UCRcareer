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
                var filterObj = {},
                    selCompanyName = $scope.filter.selected.companyName,
                    selState = $scope.filter.selected.state,
                    selJobTitle = $scope.filter.selected.jobTitle;
                
                if(selState){
                    filterObj.location = {
                        state : $scope.filter.state
                    };
                } 

                if(selCompanyName && !selJobTitle) {
                    filterObj.specifics = {
                        companyName : $scope.filter.companyName
                    };
                } else if(selJobTitle && !selCompanyName) {
                    filterObj.specifics = {
                        jobTitle : $scope.filter.jobTitle
                    };
                } else if (selCompanyName && selJobTitle) {
                    filterObj.specifics = {
                        companyName : $scope.filter.companyName,
                        jobTitle: $scope.filter.jobTitle
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
