/**
 * Created by artivanenko on 10/02/17.
 */

(function(){
	'use strict';
	
	angular
		.module('brissot')
		.config(config);
	
	/** @ngInject */
	function config($httpProvider, $translateProvider, $locationProvider, localStorageServiceProvider, IdleProvider, KeepaliveProvider){
		// Enable log
		//$logProvider.debugEnabled(true);
		
		//$locationProvider.html5Mode(true);

		// interceptor for adding token to request
		$httpProvider.interceptors.push(GlobalInterceptor);

		// translation folder
		$translateProvider.useStaticFilesLoader({
			prefix: 'assets/translation/locale-',
			suffix: '.json'
		});
		
		try {

			localStorageServiceProvider.setPrefix('brissot');

			if(localStorage.getItem("Language") === null){
				if (navigator.appVersion.indexOf("MSIE 10") !== -1) {
					$translateProvider.preferredLanguage(navigator.browserLanguage.indexOf('fr') !== -1 ? 'fr' : 'en');
					localStorage.setItem("Language", ''+(navigator.browserLanguage.indexOf('fr') !== -1 ? 'fr' : 'en')+'')
				}
				else {
					$translateProvider.preferredLanguage(navigator.language.indexOf('fr') !== -1 ? 'fr' : 'en');
					localStorage.setItem("Language", (navigator.language.indexOf('fr') !== -1 ? 'fr' : 'en'));
				}
			}
			else{
				$translateProvider.preferredLanguage(localStorage.getItem("Language"));
			}

		}catch(error) {

			alert('LocalStorage not supported');
		}

		

		// security
		$translateProvider.useSanitizeValueStrategy('escapeParameters');

		// check session
		IdleProvider.idle(900); // 15 min
    	IdleProvider.timeout(60); // 1 min
   		KeepaliveProvider.interval(300); // check every 5min

	}

	
})();