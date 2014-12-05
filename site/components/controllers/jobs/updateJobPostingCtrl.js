angular.module('huntEdu.controllers')
    .controller('UpdateJobPostingCtrl', ['$scope', '$location', '$http', '$q','User', 'JobPost', 'PostService', 'job',
    function UpdateJobPostingCtrl($scope, $location, $http, $q, User, JobPost, PostService, job){

        var profilePage = '/employerProfile',
            youtubeUrlPrefix = "https://gdata.youtube.com/feeds/api/videos/",
            youtubeUrlSuffix = "?v=2",
            imagePrefix = "http://www.";

        $scope.post = {
            'specifics': {},
            'location':  {},
            'date':      {},
            'media':     {},
            'meta':      {},
            'tags':      {}
        };

        $scope.mediaCheck = {
            'failedVideo': false,
            'failedImage': false
        };

        $scope.$on('$viewContentLoaded', function() {
            if(!User.isEmployer()){
                $location.path('/');
            }
            $scope.post.meta.id = job.getId();
            $scope.oldJobPosting = job.getJobPostData();
            $scope.oldJobPosting.tags = $scope.oldJobPosting.tags.join(", ");
    });

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

        var isImage = function(src) {
            var deferred = $q.defer();

            var image = new Image();
            image.onerror = function() {
                deferred.reject();
            };
            image.onload = function() {
                deferred.resolve();
            };
            image.src = src;

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
                isImage(imagePrefix + imageUrl)
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

        $scope.updateJob = function() {
            var updatedJob = new JobPost($scope.post);

            if($scope.updateJobPosting.$valid && updatedJob) {
                checkValidMedia(updatedJob)
                    .then(function() {
                        PostService.updateJob(updatedJob)
                            .then(function(res) {
                                var id = updatedJob.getId(),
                                    updatedJobPostRawData = res.data;
                                console.log(updatedJobPostRawData);

                                User.setJobPost(updatedJobPostRawData);
                                $location.path('/jobListing/' + id);  
                            }, function(err) {
                                console.log("something went wrong :(", err);
                            });
                    });
            }
        };

        $scope.updateCancel = function() {
            $location.path(profilePage);
        };
        
    }]);
