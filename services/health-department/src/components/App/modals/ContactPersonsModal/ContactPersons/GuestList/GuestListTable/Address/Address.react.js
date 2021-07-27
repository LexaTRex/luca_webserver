import React from 'react';

export const Address = ({ trace }) => (
  <>
    <div>{`${trace.userData?.st} ${trace.userData?.hn}`}</div>
    <div>{`${trace.userData?.pc} ${trace.userData?.c}`}</div>
  </>
);
