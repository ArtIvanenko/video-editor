;(function() {
	'use strict';

	angular
		.module('brissot')
		.service('editingService', editingService);

	/* @ngInject */
	function editingService(SERVER_CONFIG, $rootScope, $http, $q, $log, FileUploader, $state, $interval, Authenticate) {

		var sessionId = {
			sessionEditing_id: 0
		};

		var status = true;

		$rootScope.$on('discardProcess', function() {
            status = false;
        });

		this.edit = function (obj) {
			var deferred = $q.defer();

			$http
				.post(SERVER_CONFIG.baseUrl + 'editings', obj)
				.then(function(editInfo) {

					status = true;
					getEditProcess(editInfo.data.id);
					deferred.resolve(editInfo)
					
				}, function(error) {
					$log.log(error);
				})

				return deferred.promise;

		}

		this.setSessionEditId = function(userId, sesId) {
			var deferred = $q.defer();

			$http
				.post(SERVER_CONFIG.baseUrl + 'users/' + userId, {'sessionRush_ids': sesId})
				.then(function(data) {

					deferred.resolve(data)
					
				}, function(error) {
					$log.log(error);
				})

				return deferred.promise; 
		}

		function getEditProcess(sesId) {
 			var loop;

			var progress = function(){

				if(status) {
					$http
						.get(SERVER_CONFIG.baseUrl + 'editings/' + sesId)
						.then(function(editInfo) {
							
							if(editInfo.data.status === 'ERRORED') {
								$interval.cancel(loop);
								$rootScope.$broadcast('editingError');
								return;
							}

							if(editInfo.data.status !== 'FINISHED') {
								$rootScope.$broadcast('editingProcess', editInfo.data.progress);
							} else {
								$interval.cancel(loop);
								Authenticate.setRouteEnable(true);
								$state.go('player', {videoSrc: editInfo.data.output});
							}
							
						}, function(error) {
							$log.log('Error-> ',error);
							$interval.cancel(loop);
							$rootScope.$broadcast('editingError', error);
						})
				}else {
					$interval.cancel(loop);
				}

			}

			loop = $interval(progress, 1000);

		}

	}

})();