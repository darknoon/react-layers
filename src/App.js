// @flow

import React, {Component} from 'react';
import './App.css';
import LayerList from './LayerList';
import Canvas from './Canvas';
import Properties from './Properties';
import type Layer from './Model';
import {defaultTree} from './Model';

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

export default class App extends Component<void, AppState> {
  state = {
    tree: defaultTree,
    selection: new Set(['4d175542-ece0-4476-8e71-601a7cd0d3b0']),
  };

  selectLayer = (key: string) => {
    // Key could be null, but Set will deal either way
    const selection = new Set([key]);
    let state = {...this.state, selection};
    this.setState(state);
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
    const {selection, tree} = this.state;

    return (
      <div className="App">
        <LayerList
          root={tree}
          onSelect={this.selectLayer}
          onToggleVisibility={this.toggleVisibility}
          selection={selection}
        />
        <Canvas root={tree} selection={selection} />
        <Properties
          inspectedLayers={findSelectedLayers(tree, selection)}
          onSetLayerStyle={this.setLayerStyle}
        />
      </div>
    );
  }
}
