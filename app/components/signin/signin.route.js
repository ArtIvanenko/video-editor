(function(){
	'use strict';

	angular.module('signin')
		.config(routerConfig);

	/** @ngInject */
	function routerConfig($stateProvider){
		$stateProvider.state('signin',{
			url: '/signin/:id',
			security: true,
			templateUrl: 'components/signin/signin.tmpl.html',
			controller: 'SigninCtrl',
			controllerAs: 'signinCtrl',
			resolve: {
				id: function($stateParams) { return $stateParams.id;}
			}
		})
	}

})();

