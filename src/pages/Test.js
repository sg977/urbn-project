import React from 'react';
import { Slider } from 'antd';

const Test = (({ value, onChange, text }) => {
  return (
    <section className="d-flex flex-column" >
      <div className="d-flex w-100 align-items-center">
        <Slider className="w-100" value={value} min={0} max={60} onChange={onChange} />
      </div>
      <span className="text-center">{text}</span>
    </section >
  );
});

export default Test;