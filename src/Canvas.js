// @flow

import React, {Component} from 'react';
import CanvasLayer from './CanvasLayer';
import type Layer from './Model';

type CanvasProps = {
  selection: Set<string>,
};

export default class Canvas extends Component {
  state: {
    draggingId: ?string,
  } = {draggingId: null};

  onMouseDown = e => {
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
      console.log(`update dragging... ${this.state.draggingId}`);
    }
  };

  onMouseUp = (e: Event) => {
    e.stopPropagation();
    this.setState({draggingId: null});
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
    const {root, selection} = this.props;
    return (
      <div
        style={{
          flex: '3',
          background: '#999',
          position: 'relative',
          overflow: 'scroll',
        }}
      >
        {this.renderTree(this.props.root, selection)}
      </div>
    );
  }
}
