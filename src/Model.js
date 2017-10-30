const knownClasses = ['div', 'Shape', 'View'];

export type Layer = {|
  name: string,
  key: string,
  sublayers: [Layer],
  style: {[k: string]: any},
|};

export const defaultTree = {
  name: '_root_',
  key: 'a17d02a2-d5bf-4def-a171-49de6400859f',
  sublayers: [
    {
      name: 'First Layer',
      key: '4d175542-ece0-4476-8e71-601a7cd0d3b0',
      style: {
        position: 'absolute',
        top: 100,
        left: 200,
        backgroundColor: 'white',
        width: 300,
        height: 200,
        padding: 20,
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
      ],
    },
    {
      key: '27df498c-7d5a-41aa-ba37-e02b9bc2f88f',
      name: 'Second Layer',
      style: {
        position: 'absolute',
        top: 600,
        left: 200,
        backgroundColor: 'blue',
        width: 300,
        height: 200,
        padding: 20,
      },
    },
    {
      key: '8c8fbec4-873b-4710-8a8c-86a57e8c0db5',
      name: 'Third Layer',
    },
  ],
};
