angular.module('huntEdu.controllers')
    .controller('UpdateJobPostingCtrl', ['$scope', '$location', '$routeParams', 'User',
    function UpdateJobPostingCtrl($scope, $location, $routeParams, User){

        var profilePage = '/employerProfile';

        $scope.$on('$viewContentLoaded', function() {
            if(User.isEmployer())
            {
                var postId = $routeParams.id;
                var jobPosts = User.getProfileData().posts;
                for(var i = 0; i < jobPosts.length; ++i)
                {
                    if(jobPosts[i].meta.id === postId)
                    {
                        $scope.updateJobPostingData = jobPosts[i];
                    }
                }
            }
            else
            {
                $location.path('/');
            }
        });

        $scope.updateCancel = function() {
            $location.path(profilePage);
        };
        
    }]);
