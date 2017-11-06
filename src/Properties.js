import React, {Component} from 'react';
import {SketchPicker} from 'react-color';
import styled from 'styled-components';

const Types = {
  Color: 'color',
  Length: 'length',
};

const propsDef = {
  backgroundColor: {type: Types.Color, defaultValue: 'transparent'},
  width: {type: Types.Length, defaultValue: '100px'},
  height: {type: Types.Length, defaultValue: '100px'},
};

const r = 10;
const ColorDot = ({onClick, color}) => (
  <svg width={2 * r + 2} height={2 * r + 2} onClick={onClick}>
    <circle fill={color} cx={r + 1} cy={r + 1} r={r - 0.5} />
    <circle
      fill="transparent"
      stroke="rgba(0,0,0,0.2)"
      cx={r + 1}
      cy={r + 1}
      r={r}
    />
  </svg>
);

class ColorEditor extends Component {
  state = {
    displayColorPicker: false,
  };

  focus = () => this.input.focus();

  colorChanged = color => {
    this.props.changeValue(color.hex);
  };

  onClick = e => {
    console.log('displayColorPicker');
    this.setState(({displayColorPicker}) => ({
      displayColorPicker: !displayColorPicker,
    }));
  };

  handleClose = e => this.setState({displayColorPicker: false});

  render() {
    const {value} = this.props;
    const {displayColorPicker} = this.state;

    const popover = {
      position: 'absolute',
      zIndex: '2',
      right: 0,
    };
    const cover = {
      position: 'fixed',
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px',
    };

    return (
      <div>
        <ColorDot color={value} onClick={this.onClick} />
        {displayColorPicker ? (
          <div style={popover}>
            <div style={cover} onClick={this.handleClose} />
            <SketchPicker color={value} onChange={this.colorChanged} />
          </div>
        ) : null}
      </div>
    );
  }
}

class LengthEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {value: props.value !== undefined ? props.value : null};
  }

  focus = () => this.input.focus();

  onBlur = (e: FocusEvent) => {
    const {value} = this.props;
    this.setState({value});
  };

  textChanged = event => {
    const textValue = event.target.value;
    this.setState({value: textValue});
    const floatValue = parseFloat(textValue);
    this.props.changeValue(floatValue);
  };

  render() {
    const size = 20;
    return (
      <div style={{display: 'flex'}}>
        <div style={{flex: '1'}}>
          <input value={this.props.value} onChange={this.textChanged} />
        </div>
      </div>
    );
  }
}

const PropertyRow = ({children}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
  >
    {children}
  </div>
);

class PropertyEditor extends Component {
  changeValue = value => {
    const {layer, propertyName, onChange} = this.props;
    onChange(layer, propertyName, value);
  };

  focus = () => this.impl.focus();

  render() {
    const {propertyName, type, value} = this.props;
    return (
      <PropertyRow>
        <label>{propertyName}</label>
        {type === Types.Color ? (
          <ColorEditor
            ref={i => (this.impl = i)}
            {...this.props}
            changeValue={this.changeValue}
          />
        ) : null}
        {type === Types.Length ? (
          <LengthEditor
            ref={i => (this.impl = i)}
            {...this.props}
            changeValue={this.changeValue}
          />
        ) : null}
      </PropertyRow>
    );
  }
}

const Wrapper = styled.div`
  flex: 1;
  padding: 20px;
`;

export default class Properties extends Component {
  render() {
    const {inspectedLayers, onSetLayerStyle} = this.props;

    if (inspectedLayers.length === 0) {
      return <Wrapper>No selection</Wrapper>;
    }
    // For now, just grab the first inspected layer and use its properties
    const [inspectedLayer] = inspectedLayers;
    const {style = {}, key, name} = inspectedLayer;

    return (
      <Wrapper key={key}>
        <h2>{name}</h2>
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
      </Wrapper>
    );
  }
}
