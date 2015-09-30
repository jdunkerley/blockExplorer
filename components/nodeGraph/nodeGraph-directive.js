(function() {
  'use strict';

  angular.module('blockExplorer.nodeGraph-directive', [])
    .directive('nodeGraph', [function() {
      return {
        restrict: 'E',
        scope: {
          nodes: '=',
          links: '=',
          nodeDoubleClick: '=',
          statusMessage: '='
        },
        link: function(scope, element, attr) {
          // Create SVG Element (read width and height from attributes)
          var svg = d3.select(element[0]).append('svg')
            .attr({
              class: 'chart',
              width: attr.width || 960,
              height: attr.height || 800
            });

          // Define Margins and Width, Height
          var margin = {top: 20, right: 30, bottom: 30, left: 40};
          var width = svg.attr('width') - margin.left - margin.right;
          var height = svg.attr('height') - margin.top - margin.bottom;

          // Define Chart
          var chart = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
          chart.append('rect')
            .attr({
              class: 'chart bg',
              width: width,
              height: height
            });

          var force = d3.layout.force()
            .size([width, height])
            .linkDistance(50)
            .charge(-200);

          // Create Render
          var statusMessage = scope.statusMessage;
          var nodeDblClick = scope.nodeDoubleClick;

          var firstRender = false;
          scope.render = function(nodes, links) {
            // Update
            var link = chart.selectAll('.link')
              .data(links);
            var node = chart.selectAll('.node')
              .data(nodes);

            // init force layout
            force.nodes(nodes)
              .links(links);

            // Add New Points
            link.enter().append('line')
              .attr('class', 'link');
            node.enter().append('circle')
              .attr('class', 'node')
              .on('dblclick', function(d) {
                if (nodeDblClick) { nodeDblClick(d); }
              });

            force.on('end', function() {
              if (statusMessage) { statusMessage('Done'); }

              node.attr({
                  r: 10,
                  cx: function(d) { return d.x; },
                  cy: function(d) { return d.y; }
                })
                .classed('expanded', function(d) { return d.expanded; });
              link.attr({
                x1: function(d) { return d.source.x; },
                y1: function(d) { return d.source.y; },
                x2: function(d) { return d.target.x; },
                y2: function(d) { return d.target.y; }
              });

            });

            if (statusMessage) { statusMessage('Running Force Layout...'); }
            force.start();
          };

          // Wire Up Watch
          scope.$watch('links', function() {
            scope.render(scope.nodes, scope.links);
          }, true);
        }
      };
    }]);
})();
