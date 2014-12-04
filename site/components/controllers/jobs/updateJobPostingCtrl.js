angular.module('huntEdu.controllers')
    .controller('UpdateJobPostingCtrl', ['$scope', '$location', '$http', '$q', '$routeParams', 'User', 'JobPost',
    function UpdateJobPostingCtrl($scope, $location, $http, $q, $routeParams, User, JobPost){
        var profilePage = '/employerProfile';
/*
            youtubeUrlPrefix = "https://gdata.youtube.com/feeds/api/videos/",
            youtubeUrlSuffix = "?v=2",
            imagePrefix = "http://www.";
*/
        $scope.updatedPost = {
            'jobTitle':     {},
            'description':  {},
            'requirements': {},
            'salary':       {},
            'department':   {},
            'jobType':      {},
            'application':  {},
            'city':         {},
            'state':        {},
            'image':        {},
            'video':        {},
            'tags':         []
        };
/*
        $scope.mediaCheck = {
            'failedVideo': false,
            'failedImage': false
        };
*/
        $scope.$on('$viewContentLoaded', function() {
            if(!User.isEmployer())
            {
                $location.path('/');
            }
        });
        
        var postId = $routeParams.id;
        var jobPosts = User.getProfileData().posts;
        var postToUpdate = jobPosts[0];
        for(var i = 0; i < jobPosts.length; ++i)
        {
            if(jobPosts[i].meta.id === postId)
            {
                $scope.updateJobPostingData = jobPosts[i];
                postToUpdate = jobPosts[i];
            }
        }
/*
        var checkValidVideo = function(job) {
            var deferred = $q.defer(),
                hasVideo = job.hasVideo();

            if(!hasVideo) {
                $scope.mediaCheck.failedVideo = false;
                deferred.resolve();
            } else {
                var videoId = job.getVideo();
                $http.head(youtubeUrlPrefix + videoId + youtubeUrlSuffix)
                    .then(function(){
                        $scope.mediaCheck.failedVideo = false;
                        deferred.resolve();
                    },function() {
                        $scope.mediaCheck.failedVideo = true;
                        deferred.reject();
                    });
            }
            return deferred.promise;
        };
       
        var checkValidImage = function(job) {
            var deferred = $q.defer(),
                hasImage = job.hasImage();

            if(!hasImage) {
                $scope.mediaCheck.failedImage = false;
                deferred.resolve();
            } else {
                var imageUrl = job.getImage();
                $http.head(imagePrefix + imageUrl)
                    .then(function(){
                        $scope.mediaCheck.failedImage = false;
                        deferred.resolve();
                    },function() {
                        $scope.mediaCheck.failedImage = true;
                        deferred.reject();
                    });
            }
            return deferred.promise;
        };

        var checkValidMedia = function(job) {
            var deferred = $q.defer();

            checkValidVideo(job)
                .then(function(){
                    return checkValidImage(job);
                }, deferred.reject)
                .then(deferred.resolve,
                    deferred.reject);

            return deferred.promise;
        };
*/
        $scope.updateJob = function() {
                JobPost.prototype.updateJobPost(postToUpdate);
        };

        $scope.updateCancel = function() {
            $location.path(profilePage);
        };
        
    }]);
