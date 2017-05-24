/**
 * Created by artivanenko on 08/02/17.
 */

;(function() {
	'use strict';

	angular 
		.module('brissot', [
			'angularFileUpload',
			'ngIdle',
			'ui.router',
			'pascalprecht.translate',
			'signin',
			'term_conditions',
			'player',
			'progress',
			'record',
			'LocalStorageModule'
		])
		.controller('MainCtrl', MainCtrl);


	/* @ngInject */
	function MainCtrl($scope, ClientDataService, $rootScope, localStorageService, $state, Idle, Authenticate) {

		var vm = this;

		vm.activeClass = '';
		vm.isActive = true;
		vm.showSpinner = false;
		vm.title = 'Club Med';
		vm.client = '';

		$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){

			toState.name === 'player' ? vm.activeClass = 'black' : vm.activeClass = '';

			if(!$state.params.id && $state.current.name === 'signin') {
				
				vm.isActive = false;

			}else if($state.params.id) {

				ClientDataService.setClientId($state.params.id);
				ClientDataService.getClient($state.params.id);
				
				vm.isActive = true;
				
			}

			var client = JSON.parse( localStorageService.get('Client') );

			if(client !== null) {
				vm.client = client.id;
			}

			Authenticate.setRouteEnable(true);

		});

		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){

			ClientDataService.checkClient();

			if(toState.name !== 'signin' && localStorageService.get('authToken') === null ) {
				event.preventDefault();
				$state.go('signin');
			}

			if($rootScope.User) {

				if(toState.name !== 'terms_conditions' && ($rootScope.User.hasAcceptedTandC === undefined || $rootScope.User.hasAcceptedTandC !== true) ) {
					event.preventDefault();
					$state.go('terms_conditions');
				}
			}

		});

		// show/hide spinner and overlay
		$scope.$on('activeSpinner', function(e, isShow) {
	        vm.showSpinner = isShow
	    });

		// clear local storage, when session has expired
	    $scope.$on('IdleTimeout', function() {
	        localStorageService.clearAll();
	    });

	}


})();