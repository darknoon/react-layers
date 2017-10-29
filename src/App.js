// @flow

import React, { Component } from 'react';
import './App.css';
import LayerList from './LayerList';
import Canvas from './Canvas';
import Properties from './Properties';
import type Layer from './Model';
import {defaultTree as tree} from './Model'

// This could be made a good bit more efficient...
function findSelectedLayers(tree, selection) {
  var result = [];
  if (selection.has(tree.key)) {
    result.push(tree);
  }
  const sl = tree.sublayers ? tree.sublayers.map( sub => findSelectedLayers(sub, selection) ) : [];
  return result.concat(...sl);
}

export default class App extends Component {

  state: {
    selection: Set<string>,
  };

  constructor(props: void) {
    super(props);
    this.state = {
      selection: new Set(['4d175542-ece0-4476-8e71-601a7cd0d3b0']),
    };
  }

  selectLayer = (key: string) => {
    // Key could be null, but Set will deal either way
    const selection = new Set([key]);
    let state = {...this.state, selection};
    this.setState(state);
  }

  toggleVisibility = (key: string) => {

  }

  setLayerStyle = (layer: Layer, propertyName: string, value: string) => {
    // Allow mutability for now. In the future, should really use a proper Map, etc.
    if (!layer.hasOwnProperty('style')) {
      layer.style = {};
    }
    layer.style[propertyName] = value;
    this.forceUpdate();
  }


  render() {
    const {selection} = this.state;
    return (
      <div className='App'>
        <LayerList root={tree} onSelect={this.selectLayer} onToggleVisibility={this.toggleVisibility} selection={selection} />
        <Canvas root={tree} selection={selection} />
        <Properties inspectedLayers={findSelectedLayers(tree, selection)} onSetLayerStyle={this.setLayerStyle} />
      </div>
    );
  }
}
