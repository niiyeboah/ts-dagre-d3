// ORIGINAL: dagre-d3/lib/render.js
import _ from 'dagre-d3/lib/lodash';
import * as d3 from 'dagre-d3/lib/d3';
import layout from './dagre-d3-layout';
import createNodes from 'dagre-d3/lib/create-nodes';
import createClusters from 'dagre-d3/lib/create-clusters';
import createEdgeLabels from 'dagre-d3/lib/create-edge-labels';
import createEdgePaths from 'dagre-d3/lib/create-edge-paths';
import positionNodes from 'dagre-d3/lib/position-nodes';
import positionEdgeLabels from './dagre-d3-position-edge-labels';
import positionClusters from 'dagre-d3/lib/position-clusters';
import shapes from 'dagre-d3/lib/shapes';
import arrows from 'dagre-d3/lib/arrows';

export default function render() {
  const fn = (svg, g, options = {}) => {
    preProcessGraph(g);

    if (typeof options.edgeLabelX !== 'number') options.edgeLabelX = 10;
    if (typeof options.edgeLabelY !== 'number') options.edgeLabelY = -32;

    const outputGroup = createOrSelectGroup(svg, 'output');
    const clustersGroup = createOrSelectGroup(outputGroup, 'clusters');
    const edgePathsGroup = createOrSelectGroup(outputGroup, 'edgePaths');
    const edgeLabels = createEdgeLabels(createOrSelectGroup(outputGroup, 'edgeLabels'), g);
    const nodes = createNodes(createOrSelectGroup(outputGroup, 'nodes'), g, shapes);

    layout(g);
    positionNodes(nodes, g);
    positionEdgeLabels(edgeLabels, g, options.edgeLabelX, options.edgeLabelY);
    createEdgePaths(edgePathsGroup, g, arrows);
    positionClusters(createClusters(clustersGroup, g), g);
    postProcessGraph(g);
  };

  fn.createNodes = (value) => {
    if (!arguments.length) return createNodes;
    createNodes = value;
    return fn;
  };

  fn.createClusters = (value) => {
    if (!arguments.length) return createClusters;
    createClusters = value;
    return fn;
  };

  fn.createEdgeLabels = (value) => {
    if (!arguments.length) return createEdgeLabels;
    createEdgeLabels = value;
    return fn;
  };

  fn.createEdgePaths = (value) => {
    if (!arguments.length) return createEdgePaths;
    createEdgePaths = value;
    return fn;
  };

  fn.shapes = (value) => {
    if (!arguments.length) return shapes;
    shapes = value;
    return fn;
  };

  fn.arrows = (value) => {
    if (!arguments.length) return arrows;
    arrows = value;
    return fn;
  };

  return fn;
}

const NODE_DEFAULT_ATTRS = {
  paddingLeft: 10,
  paddingRight: 10,
  paddingTop: 10,
  paddingBottom: 10,
  rx: 0,
  ry: 0,
  shape: 'rect'
};

const EDGE_DEFAULT_ATTRS = {
  arrowhead: 'normal',
  curve: d3.curveLinear
};

const preProcessGraph = (g) => {
  g.nodes().forEach(function (v) {
    const node = g.node(v);
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

  g.edges().forEach((e) => {
    const edge = g.edge(e);
    if (!_.has(edge, 'label')) edge.label = '';
    _.defaults(edge, EDGE_DEFAULT_ATTRS);
  });
};

const postProcessGraph = (g) => {
  _.each(g.nodes(), (v) => {
    const node = g.node(v);

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
};

const createOrSelectGroup = (root, name) => {
  let selection = root.select('g.' + name);
  if (selection.empty()) selection = root.append('g').attr('class', name);
  return selection;
};
