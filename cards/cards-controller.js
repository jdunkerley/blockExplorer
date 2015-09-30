(function() {
  'use strict';

  angular.module('blockExplorer.cards', [
    'ngRoute',
    'angular-storage',
    'blockExplorer.bitCoin',
    'blockExplorer.momentFormat.filter'
  ])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/cards/:hash', {
        templateUrl: 'cards/cards.html',
        controller: 'CardsCtrl',
        controllerAs: 'cardsCtrl'
      }).when('/cards', {
        templateUrl: 'cards/cards.html',
        controller: 'CardsCtrl',
        controllerAs: 'cardsCtrl'
      });
    }])
    .controller('CardsCtrl', [
      '$routeParams',
      'store',
      'bitCoinService',
      function($routeParams, store, bitCoinService) {
        var self = this;

        this.blocks = [];
        this.currentStatus = 'Loading ...';

        this.display = store.get('displayCount') || 10;
        this.displayOptions = [4, 8, 10, 12, 24, 48];
        this.displayChanged = function() {
          store.set('displayCount', self.display);
          self.blocks = self.blocks.slice(0, self.display);
          if (self.blocks.length < self.display) {
            fetchBlock(self.blocks[self.blocks.length - 1].previousblockhash);
          }
        };

        function fetchBlock(blockHash) {
          self.currentStatus = 'Fetching Block ' + blockHash + ' ...';

          bitCoinService.getBlock(blockHash).then(function(block) {
            self.blocks.push(block);
            self.nextBlock = block.previousblockhash;
            if (self.blocks.length < self.display && block.previousblockhash) {
              fetchBlock(block.previousblockhash);
            } else {
              self.currentStatus = false;
            }
          });
        }

        // Have we been passed the hash otherwise fetch newest
        if ($routeParams.hash) {
          fetchBlock($routeParams.hash);
        } else {
          self.currentStatus = 'Getting newest Block Hash ...';
          bitCoinService.lastBlockHash().then(function(blockHash) {
            if (blockHash === -1) {
              self.currentStatus = 'Failed to get current Block Hash.';
            } else {
              self.nextBlock = blockHash;
              fetchBlock(blockHash);
            }
          });
        }
      }]);
})();