/**
 * Created by artivanenko on 08/02/17.
 */

(function(){
	'use strict';
	
	angular
		.module('brissot')
		.run(runBlock);
	
	/* @ngInject */
	function runBlock($rootScope, localStorageService, $state, Idle, $translate, LSEmulateService){

		if(localStorageService.isSupported) {

		    if(localStorageService.get('User') !== null) {
				$rootScope.User = JSON.parse(localStorageService.get('User'));
			} else {
				$state.go('signin');
			}

			if(localStorageService.get('Client') !== null) {
				$rootScope.Client = JSON.parse(localStorageService.get('Client'));
			}
		}else {

			LSEmulateService.setStorageLanguage( navigator.language.indexOf('fr') !== -1 ? 'fr' : 'en' )
			$translate.use(LSEmulateService.getStorageLanguage());

		}

		

		Idle.watch();

	}
	
})();
