(function() {
  'use strict';

  angular.module('blockExplorer.block', [
    'ngRoute',
    'blockExplorer.bitCoin'
  ])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/block/:hash', {
        templateUrl: 'block/block.html',
        controller: 'BlockCtrl',
        controllerAs: 'blockCtrl'
      });
    }])
    .controller('BlockCtrl', ['bitCoinService', '$routeParams', function(bitCoinService, $routeParams) {
      var self = this;
      this.hash = $routeParams.hash;
      this.currentStatus = 'Loading ...';

      bitCoinService.getBlock($routeParams.hash)
        .then(function(block) {
          if (block.hash) {
            self.object = block;
          }
          self.currentStatus = false;
        });
    }]);
})();