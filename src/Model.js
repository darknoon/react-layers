// @flow

export type Layer = {|
  key: string,
  type: string,
  name?: string,
  sublayers?: [Layer],
  // TODO: remove this, make text nodes a thing
  content?: string,
  style: {[k: string]: any},
|};

type PropType = 'string' | 'length' | 'color';

export type Component = {|
  name?: string,
  propTypes?: {[string]: PropType},
  render?: Layer,
|};

export type Registry = {[string]: Component};

export const defaultRegistry: Registry = {
  Canvas: {
    name: 'Visual Editor Canvas',
    render: {
      type: 'div',
      sublayers: [
        {
          name: 'First Layer',
          key: '4d175542-ece0-4476-8e71-601a7cd0d3b0',
          type: 'TitledGrid',
          style: {
            position: 'absolute',
            top: 100,
            left: 200,
            width: 300,
            height: 200,
          },
        },
        {
          name: 'First Layer',
          key: '7c81d113-85ec-44c5-9e47-4c85aa03d30f',
          type: 'TitledGrid',
          style: {
            position: 'absolute',
            top: 350,
            left: 200,
            width: 300,
            height: 200,
          },
        },
        {
          key: '27df498c-7d5a-41aa-ba37-e02b9bc2f88f',
          name: 'Second Layer',
          type: 'div',
          style: {
            position: 'absolute',
            top: 900,
            left: 200,
            backgroundColor: 'blue',
            width: 300,
            height: 200,
            padding: 20,
          },
        },
        {
          key: '8c8fbec4-873b-4710-8a8c-86a57e8c0db5',
          type: 'div',
          name: 'Third Layer',
          style: {
            position: 'absolute',
            top: 400,
            left: 800,
            backgroundColor: 'black',
            width: 300,
            height: 200,
            padding: 20,
          },
        },
      ],
    },
  },

  TitledGridTitle: {
    render: {
      type: 'p',
      name: 'Sub 1',
      content: 'My text goes here',
    },
  },

  TitledGrid: {
    propTypes: {},
    render: {
      name: 'Some Content',
      key: '9afaeda1-0160-4570-a6fd-4d4c42b3404e',
      type: 'div',
      style: {
        backgroundColor: 'white',
        padding: 20,
      },
      sublayers: [
        {
          key: 'e6a40678-12c6-47ef-9a6c-02a8cfdc248d',
          type: 'TitledGridTitle',
          name: 'Title',
          content: 'My text goes here',
        },
        {
          key: '79cfa686-f0c6-4073-825b-250c09eac846',
          type: 'p',
          name: 'Sub 2',
          content: 'Some other paragraph Loreen Ipsum',
        },
      ],
    },
  },
};

export function treeToRows(l: Layer) {
  const rowForLayer = (layer: Layer, indent: number) => ({indent, layer});

  const recur = (layer: Layer, indent: number): Row[] => {
    return (layer.sublayers || []).reduce(
      (arr, sublayer) => arr.concat(recur(sublayer, indent + 1)),
      layer !== l ? [rowForLayer(layer, indent)] : [],
    );
  };

  return recur(l, -1);
}
export function flattenTree(
  layer: Layer,
  registry: Registry,
  path: string[] = [],
) {
  const {type, sublayers} = layer;
  const Component = registry[type];

  // If layer has a render method, show it as the children of the layer
  // TODO: handle child arrays?
  if (Component && Component.render && typeof Component.render === 'object') {
    return {
      ...layer,
      path,
      sublayers: [
        flattenTree(Component.render, registry, [...path, layer.key]),
      ],
    };
  } else if (sublayers) {
    return {
      ...layer,
      path,
      sublayers: sublayers.map(sub =>
        flattenTree(sub, registry, [...path, layer.key]),
      ),
    };
  } else {
    return layer;
  }
}
