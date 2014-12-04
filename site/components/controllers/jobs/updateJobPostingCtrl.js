angular.module('huntEdu.controllers')
    .controller('UpdateJobPostingCtrl', ['$scope', '$location', '$http', '$q', '$routeParams', 'User', 'JobPost',
    function UpdateJobPostingCtrl($scope, $location, $http, $q, $routeParams, User, JobPost){
        var profilePage = '/employerProfile';
/*
            youtubeUrlPrefix = "https://gdata.youtube.com/feeds/api/videos/",
            youtubeUrlSuffix = "?v=2",
            imagePrefix = "http://www.";
*/
        $scope.post = {
            'specifics': {},
            'location':  {},
            'date':      {},
            'media':     {},
            'meta':      {},
            'tags':      {},
            'reviews':   {},
            'poster':    {}
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
       

        $scope.updateJobPostingData = JobPost.prototype.getJobPostData();
/* 
        var postId = $routeParams.id;
        var jobPosts = User.getProfileData().posts;
        for(var i = 0; i < jobPosts.length; ++i)
        {
            if(jobPosts[i].meta.id === postId)
            {
                $scope.updateJobPostingData = jobPosts[i];
            }
        }
*/
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
            if($scope.updateJobPosting.$valid) {
                JobPost.prototype.updateJobPost($scope.post)
                .then(function() {
                    $location.path(profilePage);
                }, function() {
                    console.log("JobPost update failed.");
                });
            }
        };

        $scope.updateCancel = function() {
            $location.path(profilePage);
        };
        
    }]);
