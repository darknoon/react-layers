import React, { Component } from 'react';
import './App.css';
import LayerList from './LayerList'
import Canvas from './Canvas'
import Properties from './Properties'

const tree = {
name: '_root_',
key: 'a17d02a2-d5bf-4def-a171-49de6400859f',
sublayers: [
  {
    name: 'First Layer',
    key: '4d175542-ece0-4476-8e71-601a7cd0d3b0',
    style: {
      position: 'absolute',
      top: '100px',
      left: '200px',
      backgroundColor: 'red',
      width: '300px',
      height: '200px',
    },
    sublayers: [
    {
      key: 'e6a40678-12c6-47ef-9a6c-02a8cfdc248d',
      name: 'Sub 1',
    },
    {
      key: '79cfa686-f0c6-4073-825b-250c09eac846',
      name: 'Sub 2',
    },
    ]
  },
  {
    key: '27df498c-7d5a-41aa-ba37-e02b9bc2f88f',
    name: 'Second Layer',
  },
  {
    key: '8c8fbec4-873b-4710-8a8c-86a57e8c0db5',
    name: 'Third Layer',
  },
],
}


// This could be made a good bit more efficient...
function findSelectedLayers(tree, selection) {
  var result = [];
  if (selection.has(tree.key)) {
    result.push(tree);
  }
  const sl = tree.sublayers ? tree.sublayers.map( sub => findSelectedLayers(sub, selection) ) : [];
  return result.concat(...sl);
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selection: new Set(['4d175542-ece0-4476-8e71-601a7cd0d3b0']),
    };
  }

  selectLayer = (key) => {
    // Key could be null, but Set will deal either way
    const selection = new Set([key]);
    let state = Object.assign(this.state, {selection});
    this.setState(state);
  }

  toggleVisibility = (key) => {

  }

  setLayerStyle = (layer, propertyName, value) => {
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

export default App;
