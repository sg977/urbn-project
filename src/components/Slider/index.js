import React from 'react';
import "./style.css";
import { Slider } from 'antd';

const DistanceSlider = (({ value, onChange, text }) => {
  return (
    <section className="d-flex flex-column" >
        <Slider className="w-100" value={value} min={0} max={60} onChange={onChange} />
      <span className="text-center">{text}</span>
    </section >
  );
});

export default DistanceSlider;