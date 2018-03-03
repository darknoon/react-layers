// @flow

import React, {Component} from 'react';
import './App.css';
import LayerList from './LayerList';
import Canvas from './Canvas';
import Properties from './Properties';
import type {Layer, Registry} from './Model';
import {defaultRegistry} from './Model';
import styled from 'styled-components';

// This could be made a good bit more efficient...
function findSelectedLayers(tree: Layer, selection: Set<string>) {
  var result = [];
  if (selection.has(tree.key)) {
    result.push(tree);
  }
  const sl = tree.sublayers
    ? tree.sublayers.map(sub => findSelectedLayers(sub, selection))
    : [];
  return result.concat(...sl);
}

function findLayer(tree: Layer, key: string) {
  if (tree.key === key) {
    return tree;
  }
  if (tree.sublayers !== undefined) {
    for (let l of tree.sublayers) {
      const found = findLayer(l, key);
      if (found) {
        return l;
      }
    }
  }
  return null;
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
  currentComponent: string,
  registry: Registry,
  selection: Set<string>,
  path: string[],
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
    currentComponent: 'Canvas',
    registry: defaultRegistry,
    selection: new Set(['4d175542-ece0-4476-8e71-601a7cd0d3b0']),
    path: ['Canvas'],
  };

  selectLayer = (key: ?string) => {
    // $FlowFixMe Key could be null, but Set will deal either way
    this.setState({selection: new Set([key])});
  };

  onToggleVisibility = (key: string) => {};

  onFocusComponent = (key: ?string) => {
    const {registry, currentComponent} = this.state;
    const component = registry[currentComponent];
    if (!key) {
      // Console
      this.setState(({path}) => {
        const newPath = [...path];
        const currentComponent = newPath.pop() || 'App';
        console.log('popping', {newPath, currentComponent});
        return {
          path: newPath,
          currentComponent,
        };
      });
    }

    const layer = findLayer(component.render, key);
    if (!layer) {
      return;
    }
    const {type} = layer;
    console.log('onFocusComponent', type);

    // If this is an editable component
    if (type in registry) {
      this.setState(({path}) => ({
        currentComponent: type,
        selection: new Set(),
        path: [...path, key],
      }));
    }
  };

  setLayerStyle = (layer: Layer, propertyName: string, value: string) => {
    const {style = {}, key} = layer;
    console.log(`set key ${key}.${propertyName} = ${value}`);
    this.setState(({registry, currentComponent}) => {
      const component = registry[currentComponent];
      const tree: Layer = component.render;
      const newTree = replaceLayer(tree, key, {
        ...layer,
        style: {...style, [propertyName]: value},
      });
      console.log('newTree', newTree);

      const updatedComponent = {...component, render: newTree};

      return {registry: {...registry, [currentComponent]: updatedComponent}};
    });
  };

  render() {
    const {selection, currentComponent, registry} = this.state;

    // Stay focused on app
    const component = registry[currentComponent];
    const tree = component.render;

    const root = registry.Canvas.render;

    return (
      <Wrapper>
        <LayerList
          root={tree}
          onSelect={this.selectLayer}
          onToggleVisibility={this.onToggleVisibility}
          onFocusComponent={this.onFocusComponent}
          selection={selection}
        />
        <Canvas
          root={root}
          registry={registry}
          onSelect={this.selectLayer}
          selection={selection}
        />
        {tree ? (
          <Properties
            inspectedLayers={findSelectedLayers(tree, selection)}
            onSetLayerStyle={this.setLayerStyle}
          />
        ) : null}
      </Wrapper>
    );
  }
}
