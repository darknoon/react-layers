import React, {PureComponent} from 'react';
import VisibilityIcon from './visibility-icon';
import {highlight, layerListBackground} from './style/colors';
import {Key} from 'ts-keycode-enum';

import './LayerList.css';

const indentSize = 20;

const styleSheet = {
  layerItemSelected: {
    color: 'white',
    background: highlight,
  },
};

class LayerItem extends PureComponent {
  toggleVisibility = e => {
    e.stopPropagation();
    this.props.onToggleVisibility();
  };

  render() {
    let {selected, name, element, onSelect, indent} = this.props;

    return (
      <div
        className="layer-item"
        style={selected ? styleSheet.layerItemSelected : null}
        onMouseDown={onSelect}
      >
        <span style={{width: indent * indentSize}} />
        <span className="element">{element}</span>
        <span className="name">{name}</span>
        <span onClick={this.toggleVisibility}>
          <VisibilityIcon className="eye" fill={selected ? 'white' : 'black'} />
        </span>
      </div>
    );
  }
}

function treeToRows(l: Layer) {
  const rowForLayer = (layer: Layer, indent: number) => ({indent, layer});

  const recur = (layer: Layer, indent: number): Row[] => {
    return (layer.sublayers || []).reduce(
      (arr, sublayer) => arr.concat(recur(sublayer, indent + 1)),
      layer !== l ? [rowForLayer(layer, indent)] : [],
    );
  };

  return recur(l, -1);
}

export default class LayerList extends PureComponent {
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

  onKeyDown = (e: KeyboardEvent) => {
    if (e.keyCode === Key.UpArrow) {
      this.onNavigate(-1);
    } else if (e.keyCode === Key.DownArrow) {
      this.onNavigate(1);
    }
  };

  onNavigate = direction => {
    const {selection} = this.props;
    const rows = this.rows();
    const selectedIndex = rows.findIndex(row => selection.has(row.layer.key));
    // Try to select next row
    const valid = Math.max(
      0,
      Math.min(selectedIndex + direction, rows.length - 1),
    );
    const newLayerKey = rows[valid].layer.key;
    this.selectLayer(newLayerKey);
  };

  // TODO: memoize
  rows() {
    const {root} = this.props;
    const rows = treeToRows(root);
    return rows;
  }

  render() {
    const {root, selection} = this.props;
    const rows = this.rows();
    const selectedIndex = rows.findIndex(row => selection.has(row.layer.key));

    return (
      <div
        className="layer-list"
        onMouseDown={e => this.selectLayer(new Set())}
        onKeyDown={this.onKeyDown}
        tabIndex={0}
        style={{backgroundColor: layerListBackground}}
      >
        {rows.map(({layer: l, indent}) => (
          <LayerItem
            name={l.name}
            element={l.element}
            indent={indent}
            key={l.key}
            selected={selection.has(l.key)}
            onSelect={e => {
              this.selectLayer(l.key);
              e.stopPropagation();
            }}
            onToggleVisibility={e => this.toggleVisibility(l.key)}
            onNavigate={this.onNavigate}
          />
        ))}
      </div>
    );
  }
}
