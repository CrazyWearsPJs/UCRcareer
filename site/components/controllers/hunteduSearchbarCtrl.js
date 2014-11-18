angular.module('ucrCareerControllers')
    .controller('HunteduSearchbarCtrl', ['$scope', '$location', 
        function huntSearchBarContoller($scope, $location) {
                $scope.searchOptions = {
                    'keyword': ''
                };
                
                $scope.search = function() {
                    var keyword = $scope.searchOptions.keyword;
                    $location.path('/searchResults' + '/' + keyword);   
                };
        }]); 

