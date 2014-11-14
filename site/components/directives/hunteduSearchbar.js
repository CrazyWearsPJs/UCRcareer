angular.module('ucrCareerDirectives')
    .directive('hunteduSearchbar',[ 
        function huntSearchBarDirective(){
    
            return {
                controller: 'HunteduSearchbarCtrl', 
                restrict: 'A',
                templateUrl: 'templates/search/hunteduSearchbar.html',
                scope: {
                    placeholder: '@placeholder',
                    searchBarId: '@searchBarId',
                    searchButtonId: '@submitButtonId',
                    formId: '@formId'
                }
            };
        
    }]);
