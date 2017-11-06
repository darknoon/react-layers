// @flow

export type Layer = {|
  name: string,
  key: string,
  type: string,
  sublayers: [Layer],
  style: {[k: string]: any},
|};

type PropType = 'string' | 'length' | 'color';

export type Component = {|
  propTypes: {[string]: PropType},
  render?: Layer,
|};

export const defaultRegistry = {
  TitledGridTitle: {
    type: 'p',
    name: 'Sub 1',
    content: 'My text goes here',
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

export const defaultTree = {
  name: '_root_',
  key: 'a17d02a2-d5bf-4def-a171-49de6400859f',
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
};
