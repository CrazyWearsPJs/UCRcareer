angular.module('ucrCareerDirectives')
    .directive('hunteduNavSearchbar',[ 
        function huntNavSearchBarDirective(){
    
            return {
                controller: 'HunteduSearchbarCtrl', 
                restrict: 'A',
                templateUrl: 'templates/search/hunteduNavSearchbar.html',
                scope: {
                    placeholder: '@placeholder',
                    formClass: '@formClass',
                    searchButtonId: '@submitButtonId',
                }
            };
        
    }]);
