;(function() {
	'use strict';

	angular
		.module('brissot')
		.service('LSEmulateService', LSEmulateService);

	/* @ngInject */
	function LSEmulateService() {

		var Storage = {
			Client: {},
			Language: ''
		};


		this.setStorageClient = function(client) {
			Storage.Client = client;
		}

		this.getStorageClient = function() {
			return Storage.Client;
		}

		this.setStorageLanguage = function(lang) {
			Storage.Language = lang;
		}

		this.getStorageLanguage = function() {
			return Storage.Language;
		}


	}


})();