import React from 'react';
import { EnvironmentTwoTone } from '@ant-design/icons';

const Marker = (({ name, key }) => {
  return (
    <div key={key}>
      <span className="brand-red">{name}</span>
      <EnvironmentTwoTone />
    </div>
  );
});

export default Marker;
