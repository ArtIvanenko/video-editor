(function(){
	'use strict';

	angular.module('progress')
		.config(routerConfig);

	/** @ngInject */
	function routerConfig($stateProvider){
		$stateProvider.state('progress',{
			url: '/progress',
			security: true,
			templateUrl: 'components/progress/progress.tmpl.html',
			controller: 'ProgressCtrl',
			controllerAs: 'progressCtrl',
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

