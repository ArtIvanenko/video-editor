(function(){
	'use strict';

	angular
		.module('progress', [])
		.controller('ProgressCtrl', ProgressCtrl);

	/* @ngInject */
	function ProgressCtrl($scope, $rootScope, $state, permission, Authenticate, ClientDataService){

		var vm = this,
			duration = 0;

		vm.discard = discard;

		vm.processData = {
			progress: 0,
			countFiles: 0,
			totalDuration: 0,
			editingProcess: 0,
			editingStatus: false,
			errorUploadStatus: false,
			errorEditingStatus: false,
			errorCode: '',
			errorText: '',
			time: ''
		}

		vm.progressBg = '';

		if(ClientDataService.progressBg) {
			vm.progressBg = ClientDataService.progressBg;
		}


		$scope.$on('uploadProcess', function(e, progress, progressInfo) {
			duration = Math.round(progressInfo.totalDuration);
			vm.processData.progress = progress;
			vm.processData.countFiles = progressInfo.fileCount;

			if(duration < 60) {
				vm.processData.totalDuration = duration;
				vm.processData.time = 'sec';

			} else {

				vm.processData.totalDuration =  Math.round( duration / 60 );
				vm.processData.time = 'min';
			}

		});

		$scope.$on('editingProcess', function(e, progress) {
			vm.processData.editingStatus = true;
			progress.toFixed(2) >= 100 ? vm.processData.editingProcess = 100 : vm.processData.editingProcess = progress.toFixed(2);
		});

		$scope.$on('editingError', function(e, error) {
			vm.processData.editingStatus = false;
			vm.processData.errorEditingStatus = true;
			vm.processData.errorCode = error.status;
			vm.processData.errorText = error.statusText;
		});

		$scope.$on('uploadError', function(e, status) {

			vm.processData.errorUploadStatus = true;
			vm.processData.errorCode = status;

			if(status === 403) {
				vm.processData.errorText = 'Access Denied';
			} 
			
		});



		function discard(event) {

			event.preventDefault();
			$rootScope.$emit('discardProcess');
			Authenticate.setRouteEnable(true);
			$state.go('record');
		}

	}

})();