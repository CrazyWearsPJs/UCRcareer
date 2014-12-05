angular.module('huntEdu.services')
    .factory('User', ['$http', '$q', 'USER_ROLES', '_', 'Util', function UserFactory($http, $q, USER_ROLES, _, Util) {
        var forEach = _.forEach,
            isFunction = _.isFunction,
            isObject = _.isObject,
            isArray = _.isArray,
            clone = _.clone,
            uniq = _.uniq,
            union = _.union,
            pick = _.pick,
            findIndex = _.findIndex,
            diffObject = Util.diffObject,
            compactObjectDeep = Util.compactObjectDeep,
            compactObject = Util.compactObject,
            prettyList = Util.prettyList;
       
        var PROFILE_DATA_FIELDS = {};

        PROFILE_DATA_FIELDS[USER_ROLES.all] =  ['personal', 'contact', 'location', 'subscription'];
        PROFILE_DATA_FIELDS[USER_ROLES.applicant] = ['spec', 'interests', 'bookmarkedPosts', 'postNotifications'];
        PROFILE_DATA_FIELDS[USER_ROLES.employer] = ['companyName', 'posts'];
        
        var employerProfileData = union(PROFILE_DATA_FIELDS[USER_ROLES.all], 
                                            PROFILE_DATA_FIELDS[USER_ROLES.employer]), 
            applicantProfileData = union(PROFILE_DATA_FIELDS[USER_ROLES.all],
                                            PROFILE_DATA_FIELDS[USER_ROLES.applicant]); 

        var User = {
            'companyName': null,
            'credentials': {
                'email': null, 
                'password': null
            },
            'personal': {
                'fName': null,
                'mInit': null,
                'lName': null
            },
            'contact': {
                'website': null,
                'linkedIn': null,
                'facebook': null,
                'twitter': null,
                'phoneNum': null
            }, 
            'spec': {
                'degree': null,
                'univ': null,
                'year': null,
                'resume': null,
                'focus': null
            },
            'location': {
                'city': null,
                'state': null,
                'zip': null,
                'address1': null,
                'address2': null,
                'country': null
            }, 
            'interests': [],
            'bookmarkedPosts': [],
            'postNotifications': [],
            'posts': [],
            'subscription': "0",
            'role': USER_ROLES.guest, 
        };


        /*
         *  Copies properties from data that are 
         *  different than the current User model.
         *  
         *  @param data {Object} Data to be copied
         *  @param(optional) role {String} role of the current user object
         *
         *  @returns {Object} data with nulled properties and properties
         *  that have the same value of the properties in User deleted
         */
        

        var getProfileDataFields = function(role) {
            role = role || User.role;
            if(role === USER_ROLES.applicant) {
                return applicantProfileData;
            } else if (role === USER_ROLES.employer) {
                return employerProfileData;
            } else {
                return PROFILE_DATA_FIELDS[USER_ROLES.all];
            }
        };

        var updatedProfileData = function(data, role) {
             role = role || User.role;
            var profileDataFields = getProfileDataFields(role),
                compactData = compactObjectDeep(data),
                diffData = diffObject(compactData, User); 

            return pick(diffData, profileDataFields);  
        };

        User.setCredentials = function(email, password) {
            this.credentials.email = email;
            this.credentials.password = password;
        };

        User.getCredentials = function() {
            return User.credentials;
        };

        User.setEmail = function(email) {
            User.credentials.email = email;
        };

        User.getEmail = function() {
            return User.credentials.email;
        };

        User.getMajor = function() {
            return User.spec.focus;
        };
    
        User.getInterests = function() {
            return clone(User.interests);
        };

        User.getSubscription = function() {
            return User.subscription;
        };

        User.prettyListInterests = function(conjunction, noneString) {
            return prettyList(User.interests, conjunction, noneString);
        };

        User.getUserRole = function() {
            return User.role;
        };

        User.setUserRole = function(role) {
            User.role = role;
        };

        User.isLoggedIn = function() {
            return User.role === USER_ROLES.applicant ||
                User.role === USER_ROLES.employer;
        };

        User.isGuest = function() {
            return User.role === USER_ROLES.guest;
        };

        User.isEmployer = function() {
            return User.role === USER_ROLES.employer;
        };

        User.isApplicant = function() {
            return User.role === USER_ROLES.applicant;
        };

        User.hasResume = function() {
            return !!User.spec.resume;
        };

        User.hasBookmark = function(jobId) { 
            var jobPos = findIndex(User.bookmarkedPosts, function(post){
                return post.meta.id === jobId;
            });

            if (jobPos === -1){
                return false;
            }
            else {
                return true;
            }
        };

        User.removeBookmark = function(jobId) {
            var deferred = $q.defer();
            if (!this.hasBookmark(jobId)){
                return deferred.promise;
            } 
            
            $http.post('/bookmark/remove', { 'id' : jobId })
                .then(function(){
                    var jobPos = findIndex(User.bookmarkedPosts, function(post){
                        return post.meta.id === jobId;
                    });
                    User.bookmarkedPosts.splice(jobPos, 1);
                    deferred.resolve();
                }, function(){
                    deferred.reject();
                });
            return deferred.promise;
        };

        User.addBookmark = function(job){
            var deferred = $q.defer(),
                jobId = job.getId();
            if (this.hasBookmark(jobId)){
                return deferred.promise;
            }
            $http.post('/bookmark/add', { 'id' : jobId })
                .then(function(){
                    User.bookmarkedPosts.push(job);
                    deferred.resolve();
                }, function(){
                    deferred.reject();
                });
            return deferred.promise;
        };

        User.clearPassword = function() {
            User.credentials.password = null;
        };

        User.getAll = function() {
            return compactObjectDeep();
        };

        User.updateSubscription = function(days) {
            User.subscription += days;
        };

        User.getExpiration = function() {
            return new Date(User.subscription.expires);
        };

        User.setProfileData = function(data,  role) {
            var updatedData = updatedProfileData(data, role);

            forEach(updatedData, function(value, key) {
                    if(isArray(value)) {
                        User[key] = uniq(value);
                    } else {
                        User[key] = value;
                    }
            });
        };

        User.getProfileData = function(role) {
            role = role || User.role;
            var profileDataFields = getProfileDataFields(role),
                data = compactObject(User);
            
            return pick(data, profileDataFields);
        };

        User.clearAll = function() {
            forEach(User, function(value, key) {
                if(!isFunction(value)) {
                   if(isArray(value)){
                        User[key] = [];
                    } else if (isObject(value)) {
                        User[key] = {};
                    } else {
                        User[key] = null;
                    }
                }
            });
            User.setUserRole(USER_ROLES.guest);
        };

        /**
        * Sends a request to update profile information in the server,
        * if it is valid info, then merge all changes from the backend
        * to the User model in the frontend
        */
        User.updateProfileData = function(data) {
           
            /*
             * crude hack since you cant use email as a URI
             */
           
            var deferred = $q.defer(),
                role = User.role;


            if(!User.isEmployer() && !User.isApplicant()) {
                deferred.reject();
                return deferred.promise;
            }
        
            var updatedData = updatedProfileData(data); 
            updatedData.email = User.credentials.email;

            console.log("Sending Data:", updatedData);

            $http.post('/profile/' + role, updatedData)
                .then(function(res) {
                    var updatedDataRes = res.data;
                    console.log(updatedDataRes);
                    User.setProfileData(updatedDataRes);
                    deferred.resolve(res);
                }, function(err) {
                    deferred.reject(err);   
                });

            return deferred.promise;
        };

        return User;
    }]);
