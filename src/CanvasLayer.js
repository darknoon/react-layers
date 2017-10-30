import React, {Component} from 'react';
import {highlight} from './style/colors';

const borderWidth = 3;

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

export default class CanvasLayer extends Component {
  element: ?HTMLDivElement;

  onMouseDown = e => {
    const {beginMouseDownOnLayer, ident} = this.props;
    // tell parent about this event?
    beginMouseDownOnLayer(e, ident);
  };

  onMouseOver = e => {};

  onMouseOut = e => {};

  selectionOverlay() {
    const {style = {}} = this.props;
    let {
      position,
      top,
      left,
      width,
      height,
      padding,
      paddingLeft,
      paddingTop,
      paddingRight,
      paddingBottom,
    } = style;

    left = left !== undefined ? left - borderWidth / 2 : undefined;
    top = top !== undefined ? top - borderWidth / 2 : undefined;
    width = width !== undefined ? width + borderWidth : undefined;
    height = height !== undefined ? height + borderWidth : undefined;

    return (
      <div
        key="selectionOverlay"
        style={undefinedToUnset({
          pointerEvents: 'none',
          position,
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

  componentDidUpdate() {}

  render() {
    const {selected, dragging} = this.props;
    let {style = {}} = this.props;

    if (dragging) {
      style = {
        ...style,
        cursor: 'move',
        backgroundColor: 'blue',
      };
    }
    return [
      <div
        key="element"
        style={style}
        onMouseDown={this.onMouseDown}
        ref={r => (this.element = r)}
      >
        {this.props.children}
      </div>,
      selected ? this.selectionOverlay() : null,
    ];
  }
}
