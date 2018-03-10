import 'raf/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import AppContainer from './AppContainer';
import ReactTestRenderer from 'react-test-renderer';

import UserPageCanvas from './userpage.canvas.js';

test('Test ability to render generic app', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AppContainer />, div);
});

test('Test ability to render canvas', () => {
  const a = ReactTestRenderer.create(<UserPageCanvas />);
  console.log(`a ${JSON.stringify(a.toJSON())}`);
});

test('abc', () => {
  const a = ReactTestRenderer.create(<AppContainer />);
  console.log('a', a.toTree());
});
