/**
 * Created by artivanenko on 08/02/17.
 */

;(function() {
  'use strict';

  angular
    .module('brissot')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/signin');
  }

})();