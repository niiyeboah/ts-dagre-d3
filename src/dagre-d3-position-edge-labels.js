// ORIGINAL: dagre-d3/lib/position-edge-labels.js
var util = require('dagre-d3/lib/util');
var d3 = require('dagre-d3/lib/d3');
var _ = require('dagre-d3/lib/lodash');

module.exports = positionEdgeLabels;

function positionEdgeLabels(selection, g, edgeLabelX, edgeLabelY) {
  var created = selection.filter(function () {
    return !d3.select(this).classed('update');
  });

  function translate(e) {
    var edge = g.edge(e);
    return _.has(edge, 'x') ? `translate(${edge.x + edgeLabelX},${edge.y + edgeLabelY})` : '';
  }

  created.attr('transform', translate);

  util.applyTransition(selection, g).style('opacity', 1).attr('transform', translate);
}
