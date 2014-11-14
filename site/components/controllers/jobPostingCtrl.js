angular.module('ucrCareerControllers')
    .controller('JobPostingCtrl', ['$scope', '$location', '$http', '$q','User', 'PostService', 'JobPost', 'JobListService', 
    function JobPostingCtrl($scope, $location, $http, $q, User, PostService, JobPost, JobListService){
        var redirectPath = '/',
            youtubeUrlPrefix = "https://gdata.youtube.com/feeds/api/videos/",
            youtubeUrlSuffix = "?v=2",
            imagePrefix = "http://www.";

        $scope.mediaCheck = {
            'failedVideo': false,
            'failedImage': false
        };

        $scope.post = {
            'specifics': {}, 
            'location': {}, 
            'date': {},
            'media': {},
            'tags': []
        };

        /*
         * If they are not an employer,
         * kick them out!
         */

        $scope.$on('$viewContentLoaded', function() {
            if(!User.isEmployer()) {
                $location.path(redirectPath);
            }
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

        $scope.ok = function() {
            if($scope.jobPosting.$valid) {                
                var job = new JobPost($scope.post);
                job.specifics.companyName = User.companyName;
                checkValidMedia(job)
                    .then(function() {
                        //passed media check test 
                        return PostService.postJob(job);
                    }).then(function(){
                        //post job is successful!
                        JobListService.setNewJob(job);
                        $location.path('/newJob');
                    });
                

           }
        };

        $scope.cancel = function() {
            $location.path(redirectPath);
        };
    }]);
