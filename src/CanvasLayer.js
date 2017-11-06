import React, {Component} from 'react';

export default class CanvasLayer extends Component {
  onMouseDown = e => {
    const {beginMouseDownOnLayer, ident} = this.props;
    // tell parent about this event?
    beginMouseDownOnLayer(e, ident);
    e.stopPropagation();
  };

  onMouseOver = e => {};

  onMouseOut = e => {};

  myRef = r => {
    const {ident, registerLayer} = this.props;
    registerLayer(ident, r);
  };

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
    return (
      <div
        key="element"
        style={style}
        onMouseDown={this.onMouseDown}
        ref={this.myRef}
      >
        {this.props.children}
      </div>
    );
  }
}
