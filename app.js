(function() {
  'use strict';

  // Declare app level module which depends on views, and components
  angular.module('blockExplorer', [
    'ngRoute',
    'blockExplorer.cards',
    'blockExplorer.block',
    'blockExplorer.version'
  ])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.otherwise({redirectTo: '/cards'});
    }]);
})();