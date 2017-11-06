// @flow

import * as React from 'react';
import CanvasLayer from './CanvasLayer';
import type Layer from './Model';
import {highlight, canvasBackground} from './style/colors';
import styled from 'styled-components';
import ReactDOM from 'react-dom';
import memoize from './util/memoize';
import {isEqual} from 'underscore';

const borderWidth = 3;

type CanvasProps = {
  selection: Set<string>,
  root: Layer,
};

type Rect = {
  left: number,
  right: number,
  top: number,
  bottom: number,
  width: number,
  height: number,
};

function elementPositionInContainer(
  element: HTMLElement,
  parent: HTMLElement,
): Rect {
  const {
    left,
    right,
    top,
    bottom,
    width,
    height,
  } = element.getBoundingClientRect();

  const {
    left: parentLeft,
    right: parentRight,
    top: parentTop,
    bottom: parentBottom,
  } = parent.getBoundingClientRect();
  const {scrollTop, scrollLeft} = parent;
  return {
    left: left - parentLeft + scrollLeft,
    right: right - parentRight,
    top: top - parentTop + scrollTop,
    bottom: bottom - parentBottom,
    width,
    height,
  };
}

function insetRect(rect: Rect, inset: number) {
  let {top, left, bottom, right, width, height} = rect;
  left = left - inset;
  top = top - inset;
  right = right - inset;
  bottom = bottom - inset;
  width = width + 2 * inset;
  height = height + 2 * inset;

  return {top, left, bottom, right, width, height};
}

function objectFromEntries<T>(entries: [string, T][]) {
  return entries.reduce((out, [key, value]) => {
    out[key] = value;
    return out;
  }, {});
}

const undefinedToUnset = style =>
  objectFromEntries(
    Object.entries(style).filter(([key, value]) => value !== undefined),
  );

const findLayer = (l: Layer, key: string) => {
  if (l.key === key) return l;
  for (let sublayer of l.sublayers || []) {
    let found = findLayer(sublayer, key);
    if (found) {
      return found;
    }
  }
  return null;
};

const SelectionOverlay = styled.div`
  pointer-events: none;
  position: absolute;
  border: 3px solid ${highlight};
  border-radius: 3px;
  background: transparent;
  display: flex;
`;

const InnerMarkings = styled.div`
  flex: 1;
  borderradius: 3px;
  border: 1px solid ${highlight};
  opacity: 0.2;
`;

const CanvasContainer = styled.div`
  flex: 3;
  background: ${canvasBackground};
  position: relative;
  overflow: scroll;
`;

export default class Canvas extends React.PureComponent<
  CanvasProps,
  {
    draggingId: ?string,
    overlays: {layer: Layer, elementPosition: Rect}[],
  },
> {
  state = {draggingId: null, overlays: []};
  container: ?CanvasContainer;
  layerComponents: {[string]: CanvasLayer} = {};

  onMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    this.setState({draggingId: null});
  };

  beginMouseDownOnLayer = (e: Event, l: Layer) => {
    this.setState({draggingId: l.ident});
  };

  onMouseMove = (e: Event) => {
    const {draggingId} = this.state;
    if (draggingId != null) {
      // mutate position
      console.log(`update dragging... ${draggingId}`);
    }
  };

  onMouseUp = (e: Event) => {
    e.stopPropagation();
    this.setState({draggingId: null});
  };

  selectionOverlay(layer: Layer, clientRect: Rect) {
    const {style = {}} = layer;
    let {top, left, width, height} = insetRect(clientRect, borderWidth / 2);

    const {
      padding,
      paddingLeft,
      paddingTop,
      paddingRight,
      paddingBottom,
    } = style;

    return (
      <SelectionOverlay
        style={undefinedToUnset({
          top,
          left,
          width,
          height,
          padding,
          paddingLeft,
          paddingTop,
          paddingRight,
          paddingBottom,
        })}
      >
        <InnerMarkings />
      </SelectionOverlay>
    );
  }

  registerLayer = (key: string, canvasLayer: CanvasLayer) => {
    const {root} = this.props;
    if (canvasLayer !== null) {
      this.layerComponents[key] = canvasLayer;
    } else {
      delete this.layerComponents[key];
    }
  };

  renderTree(l: Layer, selection: Set<string>) {
    const self = this;
    const {sublayers, key, style, content} = l;
    const sub = l.sublayers
      ? l.sublayers.map(t => self.renderTree(t, selection))
      : null;
    return (
      <CanvasLayer
        key={key}
        ident={key}
        style={style}
        beginMouseDownOnLayer={this.beginMouseDownOnLayer}
        selected={selection.has(key)}
        registerLayer={this.registerLayer}
      >
        {sub}
        {content}
      </CanvasLayer>
    );
  }

  makeOverlays = memoize(
    ({root, selection}) =>
      selection
        .map(key => {
          const elem = this.layerComponents[key];
          const layer = findLayer(root, key);
          console.log(
            'overlay ',
            this.container,
            ReactDOM.findDOMNode(this.container),
          );
          if (elem && layer && this.container) {
            const elementPosition = elementPositionInContainer(
              elem,
              ReactDOM.findDOMNode(this.container),
            );

            return {layer, elementPosition};
          } else {
            return null;
          }
        })
        .filter(o => o),
    isEqual,
    isEqual,
  );

  componentDidUpdate() {
    const {root, selection} = this.props;
    const overlays = this.makeOverlays({
      root,
      selection: Array.from(selection.values()),
    });
    this.setState({overlays});
  }

  render() {
    const {root, selection} = this.props;
    const {overlays} = this.state;

    return (
      <CanvasContainer ref={ref => (this.container = ref)}>
        {this.renderTree(this.props.root, selection)}
        {overlays.map(({layer, elementPosition}) =>
          this.selectionOverlay(layer, elementPosition),
        )}
      </CanvasContainer>
    );
  }
}
