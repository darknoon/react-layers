// @flow

import React, {Component} from 'react';
import './App.css';
import LayerList from './LayerList';
import Canvas from './Canvas';
import Properties from './Properties';
import type Layer from './Model';
import {defaultTree, defaultRegistry} from './Model';
import styled from 'styled-components';

// This could be made a good bit more efficient...
function findSelectedLayers(tree, selection) {
  var result = [];
  if (selection.has(tree.key)) {
    result.push(tree);
  }
  const sl = tree.sublayers
    ? tree.sublayers.map(sub => findSelectedLayers(sub, selection))
    : [];
  return result.concat(...sl);
}

function replaceLayer(tree: Layer, key: string, replacement: Layer) {
  if (tree.key === key) {
    return replacement;
  }
  if (tree.sublayers) {
    const sublayers = tree.sublayers.map(sub =>
      replaceLayer(sub, key, replacement),
    );
    return {...tree, sublayers};
  }
  return tree;
}

type AppState = {
  tree: Layer,
  selection: Set<string>,
};

const Wrapper = styled.div`
  display: flex;
  align-items: stretch;
  height: 100%;

  font-size: 12px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
`;

export default class App extends Component<void, AppState> {
  state = {
    tree: defaultTree,
    registry: defaultRegistry,
    selection: new Set(['4d175542-ece0-4476-8e71-601a7cd0d3b0']),
  };

  selectLayer = (key: ?string) => {
    // $FlowFixMe Key could be null, but Set will deal either way
    this.setState({selection: new Set([key])});
  };

  toggleVisibility = (key: string) => {};

  setLayerStyle = (layer: Layer, propertyName: string, value: string) => {
    const {style = {}, key} = layer;
    console.log(`set key ${key}.${propertyName} = ${value}`);
    this.setState(({tree}) => {
      const newTree = replaceLayer(tree, key, {
        ...layer,
        style: {...style, [propertyName]: value},
      });
      console.log('newTree', newTree);
      return {tree: newTree};
    });
  };

  componentDidUpdate() {
    const {selection} = this.state;
  }

  render() {
    const {selection, tree, registry} = this.state;

    return (
      <Wrapper>
        <LayerList
          root={tree}
          onSelect={this.selectLayer}
          onToggleVisibility={this.toggleVisibility}
          selection={selection}
        />
        <Canvas
          root={tree}
          registry={registry}
          onSelect={this.selectLayer}
          selection={selection}
        />
        <Properties
          inspectedLayers={findSelectedLayers(tree, selection)}
          onSetLayerStyle={this.setLayerStyle}
        />
      </Wrapper>
    );
  }
}
