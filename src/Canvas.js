// @flow

import React, { Component } from 'react';
import CanvasLayer from './CanvasLayer';
import type Layer from './Model';

type CanvasProps = {
  selection: Set<string>,
};

export default class Canvas extends Component {
  state: {
    draggingId: ?string,
  };

  constructor(props: CanvasProps) {
    super(props);
    this.state = { draggingId: null };
  }

  // onMouseDown = (e) => {
  //   e.preventDefault();
  //   this.setState({draggingId: e.});
  // }

  beginMouseDownOnLayer = (e: Event, l: Layer) => {
    this.setState({ ...this.state, draggingId: l.ident });
  };

  onMouseMove = (e: Event) => {
    if (this.state.draggingId != null) {
      // mutate position
      console.log(`update dragging... ${this.state.draggingId}`);
    }
  };

  onMouseUp = (e: Event) => {
    e.stopPropagation();
    this.setState({ draggingId: null });
  };

  renderTree(l: Layer, selection: Set<string>) {
    const self = this;
    const sub = l.sublayers
      ? l.sublayers.map(t => self.renderTree(t, selection))
      : null;
    return (
      <CanvasLayer
        key={l.key}
        ident={l.key}
        style={l.style}
        beginMouseDownOnLayer={this.beginMouseDownOnLayer}
        selected={selection.has(l.key)}
      >
        {sub}
      </CanvasLayer>
    );
  }

  render() {
    return (
      <div style={{ flex: '3', background: '#999', position: 'relative' }}>
        {this.renderTree(this.props.root, new Set(['abcd']))}
      </div>
    );
  }
}
