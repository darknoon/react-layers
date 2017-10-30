import React, {Component} from 'react';
import './Properties.css';

const Types = {
  Color: 'color',
  Length: 'length',
};

const propsDef = {
  backgroundColor: {type: Types.Color, defaultValue: 'transparent'},
  width: {type: Types.Length, defaultValue: '100px'},
  height: {type: Types.Length, defaultValue: '100px'},
};

class ColorEditor extends Component {
  focus = () => this.input.focus();

  textChanged = event => {
    this.props.changeValue(event.target.value);
  };

  render() {
    const size = 20;
    return (
      <div style={{display: 'flex'}}>
        <svg
          width={size}
          height={size}
          fill={this.props.value}
          onClick={this.focusInput}
        >
          <circle cx={size / 2} cy={size / 2} r={size / 2} />
        </svg>
        <div style={{flex: '1'}}>
          <input
            className="prop-editor-text"
            value={this.props.value}
            onChange={this.textChanged}
          />
        </div>
      </div>
    );
  }
}

class PropertyEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {value: props.value || null};
  }

  changeValue = value => {
    const {layer, propertyName, onChange} = this.props;
    this.setState({value});
    onChange(layer, propertyName, value);
  };

  focus = () => this.impl.focus();

  render() {
    const {propertyName, type} = this.props;
    return (
      <div>
        <h3>{propertyName}</h3>
        <ColorEditor
          ref={i => (this.impl = i)}
          {...this.props}
          value={this.state.value}
          changeValue={this.changeValue}
        />
      </div>
    );
  }
}

export default class Properties extends Component {
  render() {
    const {inspectedLayers, onSetLayerStyle} = this.props;

    if (inspectedLayers.length === 0) {
      return <div id="properties">No selection</div>;
    }
    // For now, just grab the first inspected layer and use its properties
    const [inspectedLayer] = inspectedLayers;
    const {style = {}, key, name} = inspectedLayer;

    return (
      <div id="properties" key={key}>
        <p>{name} properties</p>
        {Object.keys(propsDef).map(k => (
          <PropertyEditor
            key={k}
            propertyName={k}
            type={propsDef[k].type}
            value={style[k] || propsDef[k].defaultValue}
            onChange={onSetLayerStyle}
            layer={inspectedLayer}
          />
        ))}
      </div>
    );
  }
}
