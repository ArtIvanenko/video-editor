;(function() {
	'use strict';

	angular 
		.module('brissot')
		.factory('User', User);

		/* @ngInject */
		function User($http, SERVER_CONFIG, $rootScope, ClientDataService, localStorageService, $q, $log) {

			var API = {
				getUser: getUser,
				approveTC: approveTC
			}

			return API;

			function getUser(id) {
				var deferred = $q.defer();

				$http
					.get(SERVER_CONFIG.baseUrl + 'users/' + id)
					.then( function(data) {

						localStorageService.set('User', JSON.stringify(data.data) );
						$rootScope.User = data.data;
						ClientDataService.getClient(data.data.client_id);

						deferred.resolve(data);

					}, function error(err) {

						$log.error('Auth error ', err);
						deferred.reject(error);

					});

					return deferred.promise;
			}

			function approveTC (id) {

				var deferred = $q.defer();

				$http
					.post(SERVER_CONFIG.baseUrl + 'users/' + id, {hasAcceptedTandC: true})
					.then( function(data) {

						localStorageService.set('User', JSON.stringify(data.data) );
						$rootScope.User = data.data;
						deferred.resolve(data);

					}, function error(err) {

						$log.error('Auth error ', err);
						deferred.reject(error);

					});

					return deferred.promise;
			}

		}

})();