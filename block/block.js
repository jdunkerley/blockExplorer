'use strict';

angular.module('myApp.block', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/block/:hash', {
    templateUrl: 'block/block.html',
    controller: 'BlockCtrl',
    controllerAs: 'blockCtrl'
  });
}])

.controller('BlockCtrl', ['$http', '$routeParams',function($http, $routeParams) {
    var self = this;
    this.currentStatus = 'Loading ...';

    function getBlock(blockHash) {
      self.currentStatus = 'Loading Block ' + blockHash + ' ...';
      $http({method: 'GET', url: 'https://blockexplorer.com/api/block/' + blockHash})
        .then(function (response) {
          // Success
          self.object = response.data;
          self.currentStatus = false;
        }, function (response) {
          // Failed
        });
    }

    getBlock($routeParams.hash)
  }]);