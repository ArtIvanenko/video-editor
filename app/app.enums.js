;
(function() {
    'use strict';

    // time in seconds
    var VIDEO_DURATION = {
        minimumTotalRushesDuration: 20,
        maximumTotalRushesDuration: 600
    }

    var CLIENT_RESOLUTION = {
    	full: '1280x720',
    	low: '640x360'
    }
    

    angular
        .module('brissot')
        .constant('VIDEO_DURATION', VIDEO_DURATION)
        .constant('CLIENT_RESOLUTION', CLIENT_RESOLUTION);

})();

