import React, {PureComponent} from 'react';
import VisibilityIcon from './visibility-icon';
import {highlight, layerListBackground} from './style/colors';
import {Key} from 'ts-keycode-enum';
import styled from 'styled-components';

const indentSize = 20;

const LayerItemWrapper = styled.div`
  display: flex;
  align-items: center;
  padding-left: 1em;
  color: ${({selected}) => (selected ? 'white' : 'inherit')};
  background: ${({selected}) => (selected ? highlight : 'inherit')};
`;

const LayerName = styled.span`
  flex: 1;
  padding-left: 2px;
`;

const LayerType = styled.span`
  font-size: 80%;
  padding: 2px 4px;
  background-color: white;
  color: black;
  min-width: 2em;
  text-align: center;
  border-radius: 999px;
`;

const Eye = styled.span`
  opacity: ${({rowHovered}) => (rowHovered ? 0.5 : 0)};
  :hover {
    opacity: 1;
  }
`;

const Indent = styled.span`width: ${props => props.width}px;`;

class LayerItem extends PureComponent {
  state = {hovered: false};

  toggleVisibility = e => {
    e.stopPropagation();
    this.props.onToggleVisibility();
  };

  onMouseEnter = (e: MouseEvent<HTMLSpanElement>) => {
    this.setState({hovered: true});
  };

  onMouseLeave = (e: MouseEvent<HTMLSpanElement>) => {
    this.setState({hovered: false});
  };

  render() {
    const {selected, name, type, onSelect, indent} = this.props;
    const {hovered} = this.state;

    return (
      <LayerItemWrapper
        selected={selected}
        onMouseDown={onSelect}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <Indent width={indent * indentSize} />
        <LayerType>{type}</LayerType>
        <LayerName>{name}</LayerName>
        <Eye onClick={this.toggleVisibility} rowHovered={hovered}>
          <VisibilityIcon className="eye" fill={selected ? 'white' : 'black'} />
        </Eye>
      </LayerItemWrapper>
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

const Wrapper = styled.div`
  flex: 1;
  user-select: none;
`;

export default class LayerList extends PureComponent {
  selectLayer = key => {
    this.props.onSelect(key);
  };

  toggleVisibility = key => {
    this.props.onToggleVisibility(key);
  };

  onKeyDown = (e: KeyboardEvent) => {
    if (e.keyCode === Key.UpArrow) {
      this.onNavigate(-1);
      e.stopPropagation();
    } else if (e.keyCode === Key.DownArrow) {
      this.onNavigate(1);
      e.stopPropagation();
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
      <Wrapper
        onMouseDown={e => this.selectLayer(new Set())}
        onKeyDown={this.onKeyDown}
        tabIndex={0}
        style={{backgroundColor: layerListBackground}}
      >
        {rows.map(({layer: l, indent}) => (
          <LayerItem
            name={l.name}
            type={l.type}
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
      </Wrapper>
    );
  }
}
