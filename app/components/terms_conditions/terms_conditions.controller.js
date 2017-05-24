(function(){
	'use strict';

	angular
		.module('term_conditions', [])
		.controller('TermCtrl', TermCtrl);

	/* @ngInject */
	function TermCtrl($scope, $rootScope, User, $state, $log, Authenticate){

		var vm = this;

		var userId = $rootScope.User.id;

		vm.approveTerms = approveTerms;


		function approveTerms(e) {

			if(e.target.tagName !== 'SPAN'){

				e.preventDefault();

				User.approveTC(userId)
					.then(function(data) {

						if(data.status == 200) {
							Authenticate.setRouteEnable(true);
							$state.go('record');

						}

					}, function(error) {

						$log.log('error');

					});
			}
		

		}



	}

})();