/** @ngInject */
var GlobalInterceptor = function($rootScope, localStorageService){

	return {
		request: function(config){

			if( localStorageService.get('authToken') !== null ) {
                // use this to prevent destroying other existing headers
                config.headers['Authorization'] = "Bearer " + localStorageService.get('authToken');
            }
			
			return config;
		}
	};
};
