import React from 'react';
import "./style.css";
import { InputNumber } from 'antd';

const Timer = (({ value, onChange, text }) => {
  return (
    <section className="d-flex flex-column" >
        <InputNumber min={0} max={60} defaultValue={0} value={value} onChange={onChange} />
      <span className="text-center">{text}</span>
    </section >
  );
});

export default Timer;