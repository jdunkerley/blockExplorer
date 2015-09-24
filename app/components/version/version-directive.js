(function() {
  'use strict';

  angular.module('blockExplorer.version.version-directive', [])
    .directive('appVersion', ['version', function(version) {
      return function(scope, elm) {
        elm.text(version);
      };
    }]);
})();