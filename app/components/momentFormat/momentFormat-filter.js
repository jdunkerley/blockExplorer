(function() {
  'use strict';

  angular.module('blockExplorer.momentFormat.filter', [])
    .filter('fromNow', function() {
      return function(input) {
        var mom  = moment(input);
        var diff = moment().diff(mom, 'minutes');
        if (diff > 90) {
          if (mom.isBefore(moment().startOf('day'))) {
            return mom.format('d-MMM H:mm');
          }
          return mom.format('H:mm:ss');
        }
        return mom.fromNow();
      };
    });
})();