angular.module('ucrCareerControllers')
        .controller('JobPostingCtrl', ['$scope', '$location', 'User', 'PostService', 'USER_ROLES',
        function($scope, $location, User, PostService, USER_ROLES){
            $scope.post = {
                'specifics': {}, 
                'location': {}, 
                'date': {}
            };

            var credentials = User.getCredentials();
            if (credentials.email !== null) {
                $scope.user.email = credentials.email;
            }
            
            $scope.ok = function() {
                if($scope.jobPosting.$valid && User.role === USER_ROLES.employer) {
                    PostService.setJobPostData($scope.post);
                    PostService.post();
                }
            };

            $scope.cancel = function() {
                $location.path('/');
            };
       }]);


