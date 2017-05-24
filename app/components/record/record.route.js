(function(){
	'use strict';

	angular
		.module('record')
		.config(routerConfig);

	/** @ngInject */
	function routerConfig($stateProvider){
		$stateProvider.state('record',{
			url: '/record',
			security: true,
			templateUrl: 'components/record/record.tmpl.html',
			controller: 'RecordCtrl',
			controllerAs: 'recordCtrl',
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

