angular.module('ucrCareerControllers')
    .controller('HunteduSearchbarCtrl', ['$scope', '$location', 'JobListService', 
        function huntSearchBarContoller($scope, $location, JobListService) {
                $scope.searchOptions = {
                    'keyword': ''
                };
                
                $scope.search = function() {
                    var keyword = $scope.searchOptions.keyword;
                    JobListService.search(keyword)
                        .then(function(){
                            $location.path('/searchResults' + '/' + keyword);   
                        }, function(){
                        });
                };
        }]); 

