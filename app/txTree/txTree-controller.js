(function() {
  'use strict';

  angular.module('blockExplorer.txTree', [
    'ngRoute',
    'blockExplorer.bitCoin',
    'blockExplorer.nodeGraph-directive'
  ])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/tx/:blockHash', {
        templateUrl: 'txTree/txTree.html',
        controller: 'TxTreeCtrl',
        controllerAs: 'txTreeCtrl'
      }).when('/tx/:blockHash/:txHash', {
        templateUrl: 'txTree/txTree.html',
        controller: 'TxTreeCtrl',
        controllerAs: 'txTreeCtrl'
      });
    }])
    .controller('TxTreeCtrl', ['bitCoinService', '$routeParams', function(bitCoinService, $routeParams) {
      var self = this;
      this.blockHash = $routeParams.blockHash;

      this.txHash = $routeParams.txHash;

      this.currentStatus = 'Initialising ...';

      function loadTransaction(txHash) {
        self.currentStatus = 'Loading transaction object for hash ' + txHash + ' ...';
        bitCoinService.getTransaction(txHash)
          .then(function(tx) {
            if (!tx.txid) {
              self.failed = true;
              self.currentStatus = 'Failed to load transaction ' + txHash;
            }

            if (txHash === self.txHash) {
              self.rootTransaction = tx;
            }
          });
      }

      function loadBlockObject() {
        self.currentStatus = 'Loading block object for hash ' + self.blockHash + ' ...';
        bitCoinService.getBlock(self.blockHash)
          .then(function(block) {
            if (block.hash) {
              self.blockObject = block;

              if (!self.txHash) {
                self.txHash = block.tx[0];
              }
              loadTransaction(self.txHash);
            } else {
              self.failed = true;
              self.currentStatus = 'Failed to load block ' + self.hash;
            }
          });
      }

      loadBlockObject();
    }]);
})();