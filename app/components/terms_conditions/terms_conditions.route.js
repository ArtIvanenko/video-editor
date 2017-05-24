(function(){
	'use strict';

	angular.module('term_conditions')
		.config(routerConfig);

	/** @ngInject */
	function routerConfig($stateProvider){
		$stateProvider.state('terms_conditions',{
			url: '/terms_conditions',
			security: true,
			templateUrl: 'components/terms_conditions/terms_conditions.tmpl.html',
			controller: 'TermCtrl',
			controllerAs: 'tcCtrl'
		})
	}

})();