(function() {
    'use strict';

    angular
        .module('brissot')
        .directive('brVideoPlayer', brVideoPlayer);

    /* @ngInject */
    function brVideoPlayer($state, Authenticate) {

        function videoController($scope, $element) {
                
            var vm = this,
                player =  $element.find('video')[0];
            /* custom player styles */    
            //     time,
            //     unit_time,
            //     unit_persent,
            //     progressBar =  document.getElementById('progress-bar'),
            //     v_controls = document.getElementById('videoControls'),
            //     progress = v_controls.getElementsByClassName('progress')[0],
            //     past_time = v_controls.getElementsByClassName('past-time')[0],
            //     all_time = v_controls.getElementsByClassName('all-time')[0];

            //     past_time.innerHTML = '00.00';

            //     player.addEventListener('loadedmetadata', function() {
            //         time = Math.round(player.duration);

            //         all_time.innerHTML = prettyTime(Math.round(time));

            //     });

            //     player.addEventListener('timeupdate', function() {

            //         past_time.innerHTML = prettyTime( Math.round(player.currentTime) );
            //         unit_persent = player.duration / 100;
            //         unit_time = player.currentTime / unit_persent;
            //         progressBar.style.width = unit_time.toFixed(3) + '%';

            //     });

            // function prettyTime(t) {

            //     var m = Math.floor( t / 60 ) < 10 ? '0' + Math.floor( t / 60 ) : Math.floor( t / 60 );
            //     var s = Math.floor( t - ( m * 60 ) ) < 10 ? '0' + Math.floor( t - ( m * 60 )) : Math.floor( t-( m * 60 ));
            //     return m + '.' + s;

            // }

            vm.src = $scope.src;

            vm.restart = function(e) {
                e.preventDefault();
                Authenticate.setRouteEnable(true);
                $state.go('record');
                // player.pause();
                // player.currentTime = 0;
                // player.play();

            }

            // progress.addEventListener('click', function(e) {

            //     var pos = ( e.offsetX * player.duration ) / this.offsetWidth;
            //     player.currentTime = pos;
            // });

        }


        return {

            restrict: 'E',
            scope: {
                src: '='
            },
            controller: videoController,
            controllerAs: 'vm',
            templateUrl: './common/directives/brissot-video-player/videoPlayer.tmpl.html'
        };
    }


})();
