import React, { Component } from 'react';
import './Properties.css';

const Types = {
  Color: 'color',
}

const propsDef = {
  backgroundColor: {type: Types.Color, defaultValue: 'transparent'},
}

function editorForType(t) {
  return <ColorEditor />
}

class TextEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {text: props.text};
  }

  textChanged = (event) => {
    this.setState({text: event.target.value});
  }

  render() {
    return (
      <div>
        <input 
          className='prop-editor-text'
          type='color'
          value={this.state.value}
          onChange={this.textChanged} />
      </div>
    );
  }
}

class ColorEditor extends Component {
  render() {
    return (
      <div>
        <TextEditor value={this.props.value} />
      </div>
    );
  }
}

function PropertyEditor(props) {
  const {propertyName, type} = props;
  return (
    <div key={propertyName}>
      <h3>{propertyName}</h3>
      <ColorEditor {...props} />
    </div>
  );
}

export default class Properties extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {inspectedLayers} = this.props;

    if (inspectedLayers.length === 0) {
      return <div id='properties'>No selection</div>;
    }
    const [inspectedLayer] = inspectedLayers;
    const style = inspectedLayer.style || {};

    return (
      <div id='properties'>
        {Object.keys(propsDef).map( k =>
          <PropertyEditor key={k} propertyName={k} type={propsDef[k].type} value={style[k] || propsDef[k].defaultValue} />
        )}
      </div>
    );
  }
}