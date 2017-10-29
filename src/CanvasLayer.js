import React, { Component } from 'react';

export default class CanvasLayer extends Component {

  omd = (event) => {
    // tell parent about this event?
    this.props.beginMouseDownOnLayer(event, this.props.ident);
  };

  render() {
    const {selected} = this.props;
    let {style = {}} = this.props;
    if (this.props.dragging) {
      style = {
        ...this.props.style,
        cursor:'move',
        backgroundColor:'blue',
      };
    }
    if (style.hasOwnProperty('position')) {
      console.log('style ', style);
    }
    return (
      <div
        style={style}
        onMouseDown={this.omd}
      >
          {this.props.children}
      </div>
    );
  }

}
