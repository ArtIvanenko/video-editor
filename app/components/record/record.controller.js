(function(){
	'use strict';

	angular
		.module('record', ['ui.router'])
		.controller('RecordCtrl', RecordCtrl);

	/* @ngInject */
	function RecordCtrl($scope, localStorageService, $state){

		var vm = this;

		// init record data variable
		vm.recordData = {
			status: false,
			errorText: '',
			expired: false,
			expiredText: ''
		}

		

		$scope.$on('videoLengthError', function(e, data) {
			vm.recordData.status = true;
			vm.recordData.errorText = data;
		});

		$scope.$on('videoLengthNormal', function(e, data) {
			vm.recordData.status = false;
		});

		$scope.$on('brearerExpired', function(e, error) {
			vm.recordData.expired = true;
			vm.recordData.expiredText = 'Session has expired. Please relogin';
			localStorageService.clearAll();
		});

	}

})();