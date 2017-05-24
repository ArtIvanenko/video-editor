;(function() {
	'use strict';

	angular
		.module('brissot')
		.service('videoUploader', videoUploader);

	/* @ngInject */
	function videoUploader(SERVER_CONFIG, $rootScope, $http, $q, $log, FileUploader, $state) {


		this.upload = function (video) {
			var deferred = $q.defer();

			$http
				.post(SERVER_CONFIG.baseUrl + 'rushes/', video)
				.then(function(rush) {

					deferred.resolve(rush);
					
				}, function(error) {
					$log.log(error);
					$rootScope.$broadcast('brearerExpired', error);
				})

				return deferred.promise;
		}

		this.getUploadedRush = function(id) {
			var deferred = $q.defer();

			$http
				.get(SERVER_CONFIG.baseUrl + 'rushes/' + id)
				.then(function(rush) {

					deferred.resolve(rush)
					
				}, function(error) {
					$rootScope.$broadcast('uploadError', error);
					$log.log(error);
				})

				return deferred.promise;
		}



	}


})();