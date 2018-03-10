import React from 'react';

const AppContainer = ({user = {}}) => (
  <div>
    <p>{user.name}</p>
    <a href={`users/${user.id}`}>Test link</a>
    Some text
  </div>
);

export default AppContainer;
