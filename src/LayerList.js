import React, {Component} from 'react';
import VisibilityIcon from './visibility-icon';
import {highlight} from './style/colors';

import './LayerList.css';

const styleSheet = {
  layerItemSelected: {
    color: 'white',
    background: highlight,
  },
};

class LayerItem extends Component {
  toggleVisibility = e => {
    e.stopPropagation();
    this.props.onToggleVisibility();
  };

  render() {
    let {selected, name, element, onSelect} = this.props;

    return (
      <div
        className="layer-item"
        style={selected ? styleSheet.layerItemSelected : null}
        onMouseDown={onSelect}
      >
        <span className="element">{element}</span>
        <span className="name">{name}</span>
        <span onClick={this.toggleVisibility}>
          <VisibilityIcon className="eye" fill={selected ? 'white' : 'black'} />
        </span>
      </div>
    );
  }
}

export default class LayerList extends Component {
  constructor(props) {
    super(props);
    if (!props.selection instanceof Set) {
      throw new Error('missing selection');
    }
  }

  selectLayer = key => {
    this.props.onSelect(key);
  };

  toggleVisibility = key => {
    this.props.onToggleVisibility(key);
  };

  helper = l => {
    const sub = l.sublayers ? (
      <ul>{l.sublayers.map(sl => this.helper(sl))}</ul>
    ) : null;

    const {selection} = this.props;
    return (
      <li key={l.key}>
        <LayerItem
          name={l.name}
          element={l.element}
          key={l.key}
          selected={selection.has(l.key)}
          onSelect={e => {
            this.selectLayer(l.key);
            e.stopPropagation();
          }}
          onToggleVisibility={e => this.toggleVisibility(l.key)}
        />
        {sub}
      </li>
    );
  };

  render() {
    return (
      <div
        className="layer-list"
        onMouseDown={e => this.selectLayer(new Set())}
      >
        {this.props.root.sublayers.map(l => this.helper(l))}
      </div>
    );
  }
}
