import React, {PureComponent} from 'react';
import VisibilityIcon from './visibility-icon';
import {highlight, layerListBackground} from './style/colors';
import {Key} from 'ts-keycode-enum';
import styled from 'styled-components';
import {treeToRows, flattenTree} from './Model';

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

const ListTitle = styled.h2`
  font-size: 100%;
`;

const Eye = styled.span`
  opacity: ${({rowHovered}) => (rowHovered ? 0.5 : 0)};
  :hover {
    opacity: 1;
  }
`;

const Indent = styled.span`
  width: ${props => props.width}px;
`;

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

const Wrapper = styled.div`
  flex: 1;
  user-select: none;
  background-color: ${layerListBackground};
`;

export default class LayerList extends PureComponent {
  selectLayer = key => {
    this.props.onSelect(key);
  };

  toggleVisibility = key => {
    this.props.onToggleVisibility(key);
  };

  onKeyDown = (e: KeyboardEvent) => {
    const {onFocusComponent} = this.props;
    const {keyCode, metaKey} = e;
    if (keyCode === Key.UpArrow && !metaKey) {
      this.onNavigate(-1);
      e.stopPropagation();
    } else if (keyCode === Key.DownArrow && !metaKey) {
      this.onNavigate(1);
      e.stopPropagation();
    } else if (
      keyCode === Key.Enter ||
      (keyCode === Key.DownArrow && metaKey)
    ) {
      const {selection, onFocusComponent} = this.props;
      const selected = selection.values().next().value;
      if (selected) {
        onFocusComponent(selected);
      }
      e.stopPropagation();
    } else if (keyCode === Key.UpArrow && metaKey) {
      console.log('onfocus null');
      onFocusComponent(null);
      e.stopPropagation();
    }
  };

  onNavigate = (direction: -1 | 1) => {
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
    const {root, registry} = this.props;
    // const rendered = flattenTree(root, registry);
    const rows = treeToRows(root);
    return rows;
  }

  render() {
    const {root, selection} = this.props;
    const rows = this.rows();
    const selectedIndex = rows.findIndex(row => selection.has(row.layer.key));

    const {layer: selectedLayer} =
      rows.find(row => selection.has(row.layer.key)) || {};

    return (
      <Wrapper
        onMouseDown={e => this.selectLayer(new Set())}
        onKeyDown={this.onKeyDown}
        tabIndex={0}
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
