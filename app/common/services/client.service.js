;(function() {
	'use strict'

	angular
		.module('brissot')
		.service('ClientDataService', ClientDataService)

	/* @ngInject */
	function ClientDataService($http, $rootScope, $q, localStorageService, $log, SERVER_CONFIG) {
		
		var DOM = {
			body: document.body,
			main: document.getElementById('main'),
			bgContainer: document.getElementsByClassName('bg-container')[0],
			logo: document.getElementsByClassName('logo')[0]
		};

		var that = this,
			ClientId = '';

		var _promise = $q.defer();
		this.resolvePromise = _promise.promise;
		this.progressBg = '';
		/**
		*	return promisse with client object
		*/
		this.getClient = function(clientId) {
			var deferred = $q.defer();

			$http
				.get(SERVER_CONFIG.baseUrl + 'clients/' + clientId )
				.then(function(data) {

					deferred.resolve(data);

					_promise.resolve(data);

					$rootScope.Client = data.data;
					that.setClientData(data.data);

				}, function(error) {
					$log.error('Client error ', error);
					deferred.reject(error);
				});

			return deferred.promise;

		}

		this.setClientData = function (client) {

			if(client !== undefined) {

				localStorageService.set('Client', JSON.stringify(client) );
				
				DOM.body.style.color = client.frontColor;
				DOM.body.style.backgroundColor = client.sideMarginColor;
				DOM.logo.style.backgroundImage = "url(' " + client.logo + " ')";
				DOM.main.style.backgroundColor = client.backgroundColor; 
				that.progressBg = client.progressBarBackgroundColor;

				if(client.backgroundImage !== 'undefined') {

					DOM.bgContainer.style.backgroundImage = "url(' " + client.backgroundImage + " ')";


				}
			}

		}

		/**
		* 	If user reload pages styles from client will set by this function
		*/
		this.checkClient = function() {

			var client = JSON.parse( localStorageService.get('Client') );

			if(client !== null) {
				that.setClientData(client);
			}

		}

		this.setClientId = function (id) {
			ClientId = id;
		}

		this.getClientId = function () {
			return ClientId;
		}

		this.getClientData = function () {
			return ClientData;
		}
		
	}

})();