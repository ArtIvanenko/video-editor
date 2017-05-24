(function(){
	'use strict';

	angular
		.module('player', [])
		.controller('PlayerCtrl', PlayerCtrl);

	/* @ngInject */
	function PlayerCtrl($scope, $rootScope, $stateParams){

		var vm = this;

		vm.userVideo = $stateParams.videoSrc;

	}

})();