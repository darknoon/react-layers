// @flow

import React, {Component} from 'react';
import CanvasLayer from './CanvasLayer';
import type Layer from './Model';
import {highlight} from './style/colors';

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
  console.log('parent: ', {parentLeft, parentTop});
  console.log('scroll position: ', {scrollTop, scrollLeft});

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

export default class Canvas extends Component<
  CanvasProps,
  {
    draggingId: ?string,
  },
> {
  state = {draggingId: null};
  container: ?HTMLDivElement;
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
      <div
        key="selectionOverlay"
        style={undefinedToUnset({
          pointerEvents: 'none',
          position: 'absolute',
          top,
          left,
          width,
          height,
          padding,
          paddingLeft,
          paddingTop,
          paddingRight,
          paddingBottom,
          borderColor: highlight,
          borderWidth: 3,
          borderRadius: 3,
          borderStyle: 'solid',
          background: 'transparent',
          display: 'flex',
        })}
      >
        <div
          key="innerMarkings"
          style={{
            flex: 1,
            borderWidth: 1,
            borderRadius: 3,
            borderStyle: 'solid',
            borderColor: highlight,
            opacity: 0.2,
          }}
        />
      </div>
    );
  }

  registerLayer = (key: string, canvasLayer: CanvasLayer) => {
    console.log('registering: ', key, canvasLayer);
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

  render() {
    const {root, selection} = this.props;

    const overlays = Array.from(selection.values()).map(key => {
      const elem = this.layerComponents[key];
      const layer = findLayer(root, key);
      console.log('overlay ', key, root, layer);
      if (elem && layer && this.container) {
        const elementPosition = elementPositionInContainer(
          elem,
          this.container,
        );

        return this.selectionOverlay(layer, elementPosition);
      } else {
        return null;
      }
    });

    return (
      <div
        style={{
          flex: '3',
          background: '#999',
          position: 'relative',
          overflow: 'scroll',
        }}
        ref={ref => (this.container = ref)}
      >
        {this.renderTree(this.props.root, selection)}
        {overlays}
      </div>
    );
  }
}
