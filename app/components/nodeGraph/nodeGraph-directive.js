(function() {
  'use strict';

  angular.module('blockExplorer.nodeGraph-directive', [])
    .directive('nodeGraph', [function() {
      return {
        restrict: 'E',
        scope: {},
        link: function(scope, element, attr) {
          // Create SVG Element (read width and height from attributes)
          var svg = d3.select(element[0]).append('svg')
            .attr({
              width: attr.width || 1280,
              height: attr.height || 800
            });

          // Define Margins and Width, Height
          var margin = {top: 10, right: 60, bottom: 60, left: 45};
          var width = svg.attr('width') - margin.left - margin.right;
          var height = svg.attr('height') - margin.top - margin.bottom;
        }
      };
    }]);
})();
