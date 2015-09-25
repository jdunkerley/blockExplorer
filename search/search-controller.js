(function() {
  'use strict';

  angular.module('blockExplorer.search', [
    'ngRoute',
    'blockExplorer.bitCoin'
  ])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/search/:query', {
        templateUrl: 'search/search.html',
        controller: 'SearchCtrl',
        controllerAs: 'searchCtrl'
      });
    }])
    .controller('SearchCtrl', ['$routeParams', '$location', 'bitCoinService', function($routeParams, $location, bitCoinService) {
      var self = this;

      function searchByHeight(query) {
        if (query.match(/^\d+$/)) {
          self.currentStatus = 'Trying to get BlockHash for height ' + query + ' ...';
          bitCoinService.getHashFromHeight(query)
            .then(function(result) {
              if (result === -1) {
                searchByHash(query);
              } else {
                $location.url('/block/' + result);
              }
            });
        } else {
          searchByHash(query);
        }
      }

      function searchByHash(query) {
        if (query.match(/^[A-F0-9]+$/)) {
          self.currentStatus = 'Trying to get Block for hash ' + query + ' ...';
          bitCoinService.getBlock(query)
            .then(function(block) {
              if (block.hash) {
                $location.url('/block/' + block.hash);
              } else {
                searchFailed(query);
              }
            });
        } else {
          searchFailed(query);
        }
      }

      function searchFailed(query) {
        self.currentStatus = 'Could not find ' + query;
        self.failed = true;
      }

      this.currentStatus = '';
      this.query = $routeParams.query || '';
      this.submit = function() {
        $location.url('/search/' + self.query);
      };

      if (this.query !== '') {
        searchByHeight(this.query.trim().toUpperCase());
      }
    }]);
})();
