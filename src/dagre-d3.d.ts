export * as dagreD3 from 'dagre-d3';
export * as d3 from 'd3';
export declare namespace D3 {
  type Point = dagreD3.Point;
  type PointArray = [x: number, y: number];
  type Selection<T extends d3.BaseType = globalThis.Element, D = any> = d3.Selection<T, D, any, any>;
  type Transition<T extends globalThis.Element = globalThis.SVGSVGElement> = (transition: d3.Transition<T, any, any, any>) => any;
  type ZoomBehavior<T extends globalThis.Element = globalThis.Element | globalThis.SVGSVGElement> = d3.ZoomBehavior<T, any>;
}
