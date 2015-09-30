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
      }).when('/tx/:blockHash/:txId', {
        templateUrl: 'txTree/txTree.html',
        controller: 'TxTreeCtrl',
        controllerAs: 'txTreeCtrl'
      });
    }])
    .controller('TxTreeCtrl', ['bitCoinService', '$routeParams', function(bitCoinService, $routeParams) {
      var self = this;
      self.blockHash = $routeParams.blockHash;

      self.txId = $routeParams.txId;

      self.nodes = [];
      self.nodeMap = {};
      self.links = [];

      self.currentStatus = 'Initialising ...';
      self.statusMessage = function(message) {
        self.currentStatus = message;
      };

      function loadBlockObject() {
        self.currentStatus = 'Loading block object for hash ' + self.blockHash + ' ...';
        bitCoinService.getBlock(self.blockHash)
          .then(function(block) {
            if (block.hash) {
              self.blockObject = block;

              if (!self.txId) {
                self.txId = block.tx[0];
              }

              self.txIndex = self.blockObject.tx.indexOf(self.txId);
              if (self.txIndex > 0) { self.previousTxId = self.blockObject.tx[self.txIndex - 1]; }
              if (self.txIndex < self.blockObject.tx.length - 1) { self.nextTxId = self.blockObject.tx[self.txIndex + 1]; }

              loadTransaction();
            } else {
              self.failed = true;
              self.currentStatus = 'Failed to load block ' + self.hash;
            }
          });
      }

      function loadTransaction() {
        self.currentStatus = 'Loading transaction object for txid ' + self.txId + ' ...';
        bitCoinService.getTransaction(self.txId)
          .then(function(tx) {
            if (!tx.txid) {
              self.failed = true;
              self.currentStatus = 'Failed to load transaction ' + self.txId;
              return;
            }

            self.rootTransaction = tx;
            self.nodeMap[self.txId] = self.nodes.length;
            self.nodes.push({txId: self.txId, expanded: false});
            self.currentStatus = false;
            expandTransaction(self.txId);
          });
      }

      function expandTransaction(parentTxId) {

        var refNodeIdx = self.nodeMap[parentTxId];
        if (refNodeIdx === null) { return; }

        if (self.nodes[refNodeIdx].expanded) { return; }

        self.nodes[refNodeIdx].expanded = true;
        self.currentStatus = 'Expanding transaction ' + parentTxId;

        bitCoinService.getTransaction(parentTxId)
          .then(function(txObject) {
            if (!txObject || !txObject.vin || txObject.vin.length === 0) {
              return;
            }

            var newNodes = [];
            var newLinks = [];

            for (var i = 0; i < txObject.vin.length; i++) {
              var childId = txObject.vin[i].txid;
              var childIdx = self.nodes.length + newNodes.length;
              if (childId) {
                self.nodeMap[childId] = childIdx;
              }

              newNodes.push({txId: childId, expanded: !childId});
              newLinks.push({source: refNodeIdx, target: childIdx});
            }

            if (newNodes.length > 0) {
              self.nodes = self.nodes.concat(newNodes);
              self.links = self.links.concat(newLinks);
            }
            self.currentStatus = false;
          });
      }

      self.expandNode = function(d) {
        expandTransaction(d.txId);
      }

      loadBlockObject();
    }]);
})();