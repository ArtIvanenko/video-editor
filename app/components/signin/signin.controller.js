(function(){
	'use strict';

	angular
		.module('signin', [])
		.controller('SigninCtrl', SigninCtrl);

	/* @ngInject */
	function SigninCtrl($scope, $rootScope, Authenticate, ClientDataService, $state, $log){

		var vm = this;

		vm.user = {
			email: '',
			password: ''
		}

		vm.signin = signin;

		vm.fieldComplete = false;
		vm.error = false;
		vm.emptyField = false;

		function signin() {

			if(vm.user.email && vm.user.password) {

				$rootScope.$broadcast('activeSpinner', true);
				vm.emptyField = false;
				Authenticate
					.getToken(vm.user)
					.then(function(data){

						if(data.status == 200) {
							$rootScope.$broadcast('activeSpinner', false);
							Authenticate.setRouteEnable(true);
							data.data.hasAcceptedTandC === true ? $state.go('record') : $state.go('terms_conditions');
							
						}

					},function(error){
						$rootScope.$broadcast('activeSpinner', false);
						vm.error = true;
						vm.emptyField = true;
					}); 
			} else {
				vm.emptyField = true;
			}
		}

		function errorHandler() {
			vm.error = true;
		}

	}

})();