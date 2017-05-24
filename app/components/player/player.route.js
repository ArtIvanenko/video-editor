(function(){
	'use strict';

	angular.module('player')
		.config(routerConfig);

	/** @ngInject */
	function routerConfig($stateProvider){
		$stateProvider.state('player',{
			url: '/player',
			security: true,
			templateUrl: 'components/player/player.tmpl.html',
			controller: 'PlayerCtrl',
			controllerAs: 'playerCtrl',
			params: {
				videoSrc: null
			},
			resolve: {
				permission: function(Authenticate, $q) {
					var deffer = $q.defer();
					if(Authenticate.getRouteEnable()) {
							deffer.resolve();
					} else {
						deffer.reject();
					}

					return deffer.promise;
				}
			}
		})
	}

})();

