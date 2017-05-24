(function() {
    'use strict';

    angular
        .module('brissot')
        .directive('brFileSelect', brFileSelect);

    /* @ngInject */
    function brFileSelect(VIDEO_DURATION, $rootScope, $state, FileUploader, videoUploader, SERVER_CONFIG, $q, CLIENT_RESOLUTION, editingService, $timeout, Authenticate) {

        function selectFileController($scope, $element) {

            var vm = this;
            var mimeImgType = ['mp4', 'mov', 'avi', 'wmv', 'mpeg', 'gif'];
            var video, userId;

            var Video = {
                fileItems: [],
                rushSessId: [],
                userId: ''
            }

            var uploader = $scope.uploader = new FileUploader( {disableMultipart : true} );

            uploader.statuses = {
                ERRORED : -1,
                INITIALIZING : 1,
                UPLOADING : 2,
                UPLOAD_FINISHED : 3,
                EDITING : 4,
                EDITING_FINISHED : 5
            };

            var progressInfo = {
                fileCount: 0,
                totalDuration: 0
            }

            var editObject = {
                resolution: '',
                rush_ids: [],
                strategy: 'template-adrenaline', //$rootScope.Client.strategy,
                user_id: $rootScope.User.id
            };


            if($rootScope.Client.HD !== undefined) {
                editObject.resolution = CLIENT_RESOLUTION.full;
            }else {
                editObject.resolution = CLIENT_RESOLUTION.low;
            }

            userId = $rootScope.User.id;

            /*
            * Define video duration and return promise with file info
            *
            */
            function getVideoDuration(file) {

                var deferred = $q.defer();

                var video = document.createElement('video');
                video.preload = 'metadata';

                video.onloadedmetadata = function() {

                    window.URL.revokeObjectURL(this.src);
                    var duration = video.duration;

                    file.duration = duration;

                    deferred.resolve(file);
                    
                }
                video.src = URL.createObjectURL(file);

                return deferred.promise;
            }

            /**
            * create rush object and upload it to the server
            */

            uploader.updateStatus = function() {
                var vs = uploader.queue;
                var errored = 0;

                uploader.progress = uploader._getTotalProgress();

                for (var i = 0; i < vs.length; i++) {
                    if (vs[i].isErrored) {
                        errored++;
                    }
                }

                if (vs.length > 0 && errored == 0) {
                    uploader.status = uploader.statuses.UPLOAD_FINISHED;
                } else if (errored > 0) {
                    uploader.status = uploader.statuses.ERRORED;

                }
            }

            uploader.onErrorItem = function(item, response, status, headers){

                $rootScope.$broadcast('uploadError', status);

                uploader.status = uploader.statuses.ERRORED;
            }

            uploader.onAfterAddingAll = function(addedFileItems) {

                var fileItem = '';
                var videoWithDuration = [];
                var rushObject = [];
                var rush = {
                    duration: 0,
                    filename: '',
                    mimeType: '',
                    size: 0,
                    user_id: ''
                }

                for (var i = addedFileItems.length - 1; i >= 0; i--) {

                    fileItem = addedFileItems[i];

                    /*
                    * push to array all selected files and return durations 
                    */
                    videoWithDuration.push( getVideoDuration(fileItem._file) );
                    
                    Video.fileItems.push(fileItem);

                }

                $q.all( videoWithDuration )
                    .then(function(fileArr) {

                    for (var i = 0; i < fileArr.length; i++) {
                        progressInfo.totalDuration += fileArr[i].duration;
                    }

                    if(progressInfo.totalDuration < VIDEO_DURATION.minimumTotalRushesDuration) {
                        $scope.$emit('videoLengthError', 'TOTAL_LENGTH_MUST_BE_MORE_THAN_MINIMUM');
                        progressInfo.totalDuration = 0;
                        return;
                    }else if(progressInfo.totalDuration > VIDEO_DURATION.maximumTotalRushesDuration) {
                        $scope.$emit('videoLengthError', 'TOTAL_LENGTH_MUST_BE_LESS_THAN_MAXIMUM');
                        progressInfo.totalDuration = 0;
                        return;
                    }else {

                        $scope.$emit('videoLengthNormal', '');

                        for (var i = 0; i < fileArr.length; i++) {

                            rush = {
                                duration: fileArr[i].duration,
                                filename: fileArr[i].name,
                                mimeType: fileArr[i].type,
                                size: fileArr[i].size,
                                user_id: userId
                            }

                            /*
                            * send POST with rush object
                            */
                            rushObject.push( videoUploader.upload(rush) );
                        }

                    }
                    $q.all( rushObject )
                        .then(function(rush) {

                            for (var i = 0; i < rush.length; i++) {

                                Video.rushSessId.push( rush[i].data.id );

                                if(rush[i].data.status === 'UPLOADED') {
                                   uploader.status = uploader.statuses.UPLOAD_FINISHED
                                }

                                for (var j = 0; j < Video.fileItems.length; j++) {

                                    if( rush[i].data.filename === Video.fileItems[j].file.name ) {

                                        Video.fileItems[j].url = rush[i].data.s3PresignedUploadUrl;

                                        if (!Video.fileItems[j].url) {

                                            return fileItem.cancel();
                                        }
                                        Video.fileItems[j].id = rush[i].data.id;
                                        editObject.rush_ids.push(rush[i].data.id);
                                        Video.fileItems[j].method = 'PUT';
                                        Video.fileItems[j].headers['Content-Type'] = 'video/mp4';
                                    }

                                }

                            }

                            editingService.setSessionEditId( userId, Video.rushSessId )
                                .then(function(data) {
                                    uploader.uploadAll();
                                    Authenticate.setRouteEnable(true);
                                    $state.go('progress');
                                })

                        })
                
                });

                progressInfo.fileCount = addedFileItems.length;

            };

            $rootScope.$on('discardProcess', function() {
                uploader.status = uploader.statuses.ERRORED;
                uploader.cancelAll();
            });

            uploader.onProgressAll = function(progress) {

                if(uploader.status !== -1) {
                    $rootScope.$broadcast('uploadProcess', progress, progressInfo);
                }

                if(uploader.status === 3) {
                    $rootScope.$broadcast('uploadProcess', 100, progressInfo);
                }

            };

            uploader.onCompleteAll  = function() {
                
                if(uploader.status !== -1) {
                    var uploadedRush = [];
                    for (var i = 0; i < editObject.rush_ids.length; i++) {

                        uploadedRush.push(videoUploader.getUploadedRush(editObject.rush_ids[i]) );

                    }
                    $q.all(uploadedRush).then(function(arr){
                        var rush_ids = [];

                        for (var i = 0; i < arr.length; i++) {
                            rush_ids.push(arr[i].data.id);
                        }
                        editObject.rush_ids = rush_ids;
                        
                        editingService.edit(editObject);
                    })
                }   
                
            };

        }

        return {
            restrict: 'E',
            controller: selectFileController,
            template: '<input type="file" nv-file-select uploader="uploader" id="upload" multiple><label for="upload" class="fileUpload">{{"BS2_SELECT_VIDEOS" | translate}}</label>'
        };
    }


})();
