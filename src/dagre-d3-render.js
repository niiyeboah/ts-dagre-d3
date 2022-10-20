// ORIGINAL: dagre-d3/lib/render.js
var _ = require('dagre-d3/lib/lodash');
var d3 = require('dagre-d3/lib/d3');
var layout = require('./dagre-d3-layout');

module.exports = render;

function render() {
  var createNodes = require('dagre-d3/lib/create-nodes');
  var createClusters = require('dagre-d3/lib/create-clusters');
  var createEdgeLabels = require('dagre-d3/lib/create-edge-labels');
  var createEdgePaths = require('dagre-d3/lib/create-edge-paths');
  var positionNodes = require('dagre-d3/lib/position-nodes');
  var positionEdgeLabels = require('dagre-d3/lib/position-edge-labels');
  var positionClusters = require('dagre-d3/lib/position-clusters');
  var shapes = require('dagre-d3/lib/shapes');
  var arrows = require('dagre-d3/lib/arrows');

  var fn = function (svg, g) {
    preProcessGraph(g);

    if (typeof options.edgeLabelX !== 'number') options.edgeLabelX = 10;
    if (typeof options.edgeLabelY !== 'number') options.edgeLabelY = -32;

    var outputGroup = createOrSelectGroup(svg, 'output');
    var clustersGroup = createOrSelectGroup(outputGroup, 'clusters');
    var edgePathsGroup = createOrSelectGroup(outputGroup, 'edgePaths');
    var edgeLabels = createEdgeLabels(createOrSelectGroup(outputGroup, 'edgeLabels'), g);
    var nodes = createNodes(createOrSelectGroup(outputGroup, 'nodes'), g, shapes);

    layout(g);

    positionNodes(nodes, g);
    positionEdgeLabels(edgeLabels, g, options.edgeLabelX, options.edgeLabelY);
    createEdgePaths(edgePathsGroup, g, arrows);

    var clusters = createClusters(clustersGroup, g);
    positionClusters(clusters, g);

    postProcessGraph(g);
  };

  fn.createNodes = function (value) {
    if (!arguments.length) return createNodes;
    createNodes = value;
    return fn;
  };

  fn.createClusters = function (value) {
    if (!arguments.length) return createClusters;
    createClusters = value;
    return fn;
  };

  fn.createEdgeLabels = function (value) {
    if (!arguments.length) return createEdgeLabels;
    createEdgeLabels = value;
    return fn;
  };

  fn.createEdgePaths = function (value) {
    if (!arguments.length) return createEdgePaths;
    createEdgePaths = value;
    return fn;
  };

  fn.shapes = function (value) {
    if (!arguments.length) return shapes;
    shapes = value;
    return fn;
  };

  fn.arrows = function (value) {
    if (!arguments.length) return arrows;
    arrows = value;
    return fn;
  };

  return fn;
}

var NODE_DEFAULT_ATTRS = {
  paddingLeft: 10,
  paddingRight: 10,
  paddingTop: 10,
  paddingBottom: 10,
  rx: 0,
  ry: 0,
  shape: 'rect'
};

var EDGE_DEFAULT_ATTRS = {
  arrowhead: 'normal',
  curve: d3.curveLinear
};

function preProcessGraph(g) {
  g.nodes().forEach(function (v) {
    var node = g.node(v);
    if (!_.has(node, 'label') && !g.children(v).length) {
      node.label = v;
    }

    if (_.has(node, 'paddingX')) {
      _.defaults(node, {
        paddingLeft: node.paddingX,
        paddingRight: node.paddingX
      });
    }

    if (_.has(node, 'paddingY')) {
      _.defaults(node, {
        paddingTop: node.paddingY,
        paddingBottom: node.paddingY
      });
    }

    if (_.has(node, 'padding')) {
      _.defaults(node, {
        paddingLeft: node.padding,
        paddingRight: node.padding,
        paddingTop: node.padding,
        paddingBottom: node.padding
      });
    }

    _.defaults(node, NODE_DEFAULT_ATTRS);

    _.each(['paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom'], function (k) {
      node[k] = Number(node[k]);
    });

    // Save dimensions for restore during post-processing
    if (_.has(node, 'width')) {
      node._prevWidth = node.width;
    }
    if (_.has(node, 'height')) {
      node._prevHeight = node.height;
    }
  });

  g.edges().forEach(function (e) {
    var edge = g.edge(e);
    if (!_.has(edge, 'label')) {
      edge.label = '';
    }
    _.defaults(edge, EDGE_DEFAULT_ATTRS);
  });
}

function postProcessGraph(g) {
  _.each(g.nodes(), function (v) {
    var node = g.node(v);

    // Restore original dimensions
    if (_.has(node, '_prevWidth')) {
      node.width = node._prevWidth;
    } else {
      delete node.width;
    }

    if (_.has(node, '_prevHeight')) {
      node.height = node._prevHeight;
    } else {
      delete node.height;
    }

    delete node._prevWidth;
    delete node._prevHeight;
  });
}

function createOrSelectGroup(root, name) {
  var selection = root.select(`g.${name}`);
  if (selection.empty()) {
    selection = root.append('g').attr('class', name);
  }
  return selection;
}
