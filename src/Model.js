const knownClasses = ['div', 'Shape', 'View'];

export type Layer = {|
  name: string,
  key: string,
  element: string,
  sublayers: [Layer],
  style: {[k: string]: any},
|};

const registry = {};

export const defaultTree = {
  name: '_root_',
  key: 'a17d02a2-d5bf-4def-a171-49de6400859f',
  element: 'div',
  sublayers: [
    {
      name: 'First Layer',
      key: '4d175542-ece0-4476-8e71-601a7cd0d3b0',
      element: 'div',
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
          element: 'p',
          name: 'Sub 1',
          content: 'My text goes here',
        },
        {
          key: '79cfa686-f0c6-4073-825b-250c09eac846',
          element: 'p',
          name: 'Sub 2',
          content: 'Some other paragraph Loreen Ipsum',
        },
      ],
    },
    {
      key: '27df498c-7d5a-41aa-ba37-e02b9bc2f88f',
      name: 'Second Layer',
      element: 'div',
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
      element: 'div',
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
