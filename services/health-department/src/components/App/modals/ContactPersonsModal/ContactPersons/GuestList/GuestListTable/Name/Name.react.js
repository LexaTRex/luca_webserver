import React from 'react';

export const Name = ({ trace }) => (
  <div>{`${trace.userData.fn} ${trace.userData.ln}`}</div>
);
