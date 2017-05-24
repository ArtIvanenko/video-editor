;(function() {
	'use strict';

	angular 
		.module('brissot')
		.factory('Authenticate', Authenticate);

		/* @ngInject */
		function Authenticate($http, SERVER_CONFIG, localStorageService, $q, $log, User, ClientDataService) {

            var routeEnable = true;

			var auth = {
				getToken: getToken,
				getRouteEnable: getRouteEnable,
				setRouteEnable: setRouteEnable,
				routeEnable: routeEnable
			}

			return auth;
			
			var config = {
                headers : {
                    'Content-Type': 'application/json'
                }
            }



			function getToken(user) {
				var deferred = $q.defer(),
					ClientId = ClientDataService.getClientId();

				$http
					.post(SERVER_CONFIG.authUrl, { username: user.email, password: user.password, client_id:  ClientId}, config)
					.then( function(data) {

						// set auth token to the storage
						localStorageService.set('authToken', data.data.bearer);
						
						// get user by id
						return User.getUser(data.data.id);
						

					})
					.then(function(data) {

						deferred.resolve(data);

					}, function error(err) {

						$log.error('Auth error ', err);
						deferred.reject(err);

					});

					return deferred.promise;
			}

			function getRouteEnable() {
				return routeEnable;
			}

			function setRouteEnable(bool) {
				routeEnable = bool;
			}

		}

})();