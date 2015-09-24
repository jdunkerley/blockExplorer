(function() {
  'use strict';

  angular.module('blockExplorer.cards', ['ngRoute', 'angular-storage'])
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
    .controller('CardsCtrl', ['$http', '$routeParams', 'store', function($http, $routeParams, store) {
      var self = this;
      this.blocks = [];

      this.currentStatus = 'Loading ...';

      this.display = store.get('displayCount') || 10;
      this.displayOptions = [4, 8, 10, 12, 24, 48];
      this.displayChanged = function() {
        store.set('displayCount', self.display);
        if (self.blocks.length > self.display) {
          self.blocks = self.blocks.slice(0, self.display);
          self.nextBlock = self.blocks[self.blocks.length - 1].previousblockhash;
        }
        if (self.blocks.length < self.display) {
          getNextBlock(self.nextBlock);
        }
      };

      this.nextBlock = '';

      function getNextBlock(blockHash) {
        self.currentStatus = 'Fetching Block ' + blockHash + ' ...';
        $http({method: 'GET', url: 'https://blockexplorer.com/api/block/' + blockHash})
          .then(function (response) {
            // Success
            self.blocks.push(response.data);
            self.nextBlock = response.data.previousblockhash;
            if (self.blocks.length < self.display && response.data.previousblockhash) {
              getNextBlock(response.data.previousblockhash);
            } else {
              self.currentStatus = false;
            }
          }, function (response) {
            // Failed
          });
      }

      if ($routeParams.hash) {
        getNextBlock($routeParams.hash);
      } else {
        self.currentStatus = 'Getting newest Block Hash ...';

        $http({method: 'GET', url: 'https://blockexplorer.com/api/status?q=getLastBlockHash'})
          .then(function (response) {
            // Success
            self.success = response.status;
            self.currentBlock = response.data.lastblockhash;
            getNextBlock(self.currentBlock);
          }, function (response) {
            // Failed
            self.currentStatus = 'Failed to get current Block Hash.';
          });
      }
    }]);
})();
