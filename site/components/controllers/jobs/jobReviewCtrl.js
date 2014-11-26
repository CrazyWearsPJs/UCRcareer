angular.module('huntEdu.controllers')
    .controller('JobReviewCtrl',['$scope', '$location', 'User', 
        function ($scope, $location, User){
            
            $scope.reviewData = [

                {title:'Great Job!', date:'1288323623006', author:'Jane Seymore', rating:'5', comment:'lorem ipsum blah blah blah blah blah blah blah'},
                {title:'Great Job!', date:'1288323623006', author:'Jane Seymore', rating:'1', comment:'lorem ipsum blah blah blah blah blah blah blah'},
                {title:'Great Job!', date:'1288323623006', author:'Jane Seymore', rating:'3', comment:'lorem ipsum blah blah blah blah blah blah blah'},
                {title:'Great Job!', date:'1288323623006', author:'Jane Seymore', rating:'4', comment:'lorem ipsum blah blah blah blah blah blah blah'},
                {title:'Great Job!', date:'1288323623006', author:'Jane Seymore', rating:'5', comment:'lorem ipsum blah blah blah blah blah blah blah'},
                {title:'Great Job!', date:'1288323623006', author:'Jane Seymore', rating:'2', comment:'lorem ipsum blah blah blah blah blah blah blah'},
                {title:'Great Job!', date:'1288323623006', author:'Jane Seymore', rating:'3', comment:'lorem ipsum blah blah blah blah blah blah blah'},
                {title:'Great Job!', date:'1288323623006', author:'Jane Seymore', rating:'4', comment:'lorem ipsum blah blah blah blah blah blah blah'},
                {title:'Great Job!', date:'1288323623006', author:'Jane Seymore', rating:'5', comment:'lorem ipsum blah blah blah blah blah blah blah'},
            ];
            
            $scope.showLoggedIn = function() {
                return User.isLoggedIn();
            };

            $scope.newReview = function() {
                $location.path('/reviewPosting');
            };
            
            /*Ratings*/
            $scope.rate = 0;
            $scope.max = 5;
            $scope.isReadonly = true;

            $scope.hoveringOver = function(value) {
                $scope.overStar = value;
                $scope.percent = 100 * (value / $scope.max);
            }; 
    }]);
