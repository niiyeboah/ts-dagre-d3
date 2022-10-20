import * as orignalDagreD3 from 'dagre-d3';
import render from './dagre-d3-render';
const modifedDagreD3 = { ...orignalDagreD3, render };
export { modifedDagreD3 as dagreD3 };
export * as d3 from 'd3';
