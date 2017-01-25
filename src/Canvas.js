import React, { Component } from 'react';

function renderLayer(l) {
  const sub = l.sublayers ? l.sublayers.map(renderLayer) : null;
  return <div key={l.key} style={l.style}>{sub}</div>
}

export default class Canvas extends Component {
  render() {
    return <div style={{flex: '4', background: '#999', position:'relative'}}>{renderLayer(this.props.root)}</div>;
  }
}