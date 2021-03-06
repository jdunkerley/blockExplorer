(function() {
  'use strict';

  angular.module('blockExplorer.bitCoin', [])
    .factory('bitCoinService', ['$q', '$http', function($q, $http) {
      var baseUrl = 'https://blockexplorer.com/api/';
      var cache = {};
      var txCache = {};

      function lastBlockHash(isARetry) {
        return $http({
          method: 'GET',
          url: baseUrl + 'status?q=getLastBlockHash'
        })
          .then(function(response) {
            if (!isARetry && !response.data.lastblockhash) {
              return lastBlockHash(true);
            }

            return response.data.lastblockhash || -1;
          }, function() {
            // Failed
            if (!isARetry) {
              return lastBlockHash(true);
            }

            return -1;
          });
      }

      function getBlockFromWeb(blockHash) {
        return $http({method: 'GET', url: baseUrl + 'block/' + blockHash})
          .then(function(response) {
            // Success
            if (response.data.time) {
              response.data.timestamp = moment('19700101', 'YYYYMMDD').add(response.data.time, 's').toDate();
            }
            cache[blockHash] = response.data;
            return response.data;
          }, function(response) {
            return {error: response.message};
          });
      }

      function getBlock(blockHash) {
        if (cache[blockHash]) {
          var def =  $q.defer();
          def.resolve(cache[blockHash]);
          return def.promise;
        }

        return getBlockFromWeb(blockHash);
      }

      function getHashFromHeight(height) {
        return $http({
          method: 'GET',
          url: baseUrl + 'block-index/' + height
        })
          .then(function(response) {
            return response.data.blockHash || -1;
          }, function(response) {
            return -1;
          });
      }

      function getTransactionFromWeb(txId) {
        return $http({method: 'GET', url: baseUrl + 'tx/' + txId})
          .then(function(response) {
            // Success
            if (response.data.time) {
              response.data.timestamp = moment('19700101', 'YYYYMMDD').add(response.data.time, 's').toDate();
            }
            txCache[txId] = response.data;
            return response.data;
          }, function(response) {
            return {error: response.message};
          });
      }

      function getTransaction(txId) {
        if (txCache[txId]) {
          var def =  $q.defer();
          def.resolve(txCache[txId]);
          return def.promise;
        }

        return getTransactionFromWeb(txId);
      }

      return {
        lastBlockHash: lastBlockHash,
        getBlock: getBlock,
        getTransaction: getTransaction,
        getHashFromHeight: getHashFromHeight
      };
    }]);
})();