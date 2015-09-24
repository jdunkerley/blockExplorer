(function() {
  'use strict';

  angular.module('blockExplorer.version', [
    'blockExplorer.version.version-directive'
  ])
    .value('version', '0.1');
})();