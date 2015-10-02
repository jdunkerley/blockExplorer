(function() {
  'use strict';

  angular.module('blockExplorer.nodeGraph-directive', [])
    .directive('nodeGraph', [function() {
      return {
        restrict: 'E',
        scope: {
          nodes: '=',
          links: '=',
          nodeClick: '&',
          nodeMouseOver: '&',
          nodeMouseOut: '&'
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
          var radius = 10;
          var margin = {top: 0, right: 0, bottom: 0, left: 0};
          var width = svg.attr('width') - margin.left - margin.right;
          var height = svg.attr('height') - margin.top - margin.bottom;

          // Add background before anything else
          svg.append('rect')
              .attr({
                class: 'chart bg',
                width: width,
                height: height
              });

          // Set up zoom
          var zoom = d3.behavior.zoom()
            .scaleExtent([attr.minZoom || 0.1, attr.maxZoom || 5]);

          // Define Chart
          var chart = svg.append('g')
            .attr('transform',
            'translate(' + margin.left + ',' + margin.top + ')scale(' + zoom.scale() + ')');

          zoom.on('zoom', function() {
            chart.attr('transform',
              'translate(' + d3.event.translate + ')scale(' + zoom.scale() + ')');
          });
          svg.call(zoom);

          var force = d3.layout.force()
            .size([width, height])
            .linkDistance(50)
            .charge(-200);

          // Create Render
          var firstRender = false;
          scope.render = function(nodes, links, scope) {
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
              .on('click', function(d) {
                if (scope.nodeClick) { scope.nodeClick({datum: d}); }
              })
              .on('mouseover', function(d) {
                if (scope.nodeMouseOver) { scope.nodeMouseOver({datum: d}); }
              })
              .on('mouseout', function(d) {
                if (scope.nodeMouseOut) { scope.nodeMouseOut({datum: d}); }
              });

            // Do Classing
            node
              .classed('expanded', function(d) { return d.expanded; })
              .classed('terminal', function(d) { return !d.txId; })
              .classed('initial', function(d) { return d.initial; });

            function tick() {
              node.attr({
                r: radius,
                //cx: function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); },
                //cy: function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); }
                cx: function(d) { return d.x; },
                cy: function(d) { return d.y; }
              });
              link.attr({
                x1: function(d) { return d.source.x; },
                y1: function(d) { return d.source.y; },
                x2: function(d) { return d.target.x; },
                y2: function(d) { return d.target.y; }
              });
            }

            force.on('tick', tick);
            force.on('end', function() {
              //console.log('Done - ' + Date.now());
            });

            force.start();
          };

          // Wire Up Watch
          scope.$watch('links', function() {
            scope.render(scope.nodes, scope.links, scope);
          }, true);
        }
      };
    }]);
})();
