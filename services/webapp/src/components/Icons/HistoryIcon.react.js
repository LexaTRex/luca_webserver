import React from 'react';

export function HistoryIcon({ color = '#ffffff' }) {
  return (
    <svg width="24px" height="24px" viewBox="0 0 24 24">
      <title>Icon / QR-Code-Scan / active</title>
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <line
          x1="2"
          y1="12"
          x2="22"
          y2="12"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          fill={color}
          fillRule="nonzero"
          d="M21,21 L15,21 L15,23 L21,23 C22.1045695,23 23,22.1045695 23,21 L23,15 L21,15 L21,21 Z"
        />
        <path
          fill={color}
          fillRule="nonzero"
          d="M21,1 L15,1 L15,3 L21,3 L21,9 L23,9 L23,3 C23,1.8954305 22.1045695,1 21,1 Z"
        />
        <path
          fill={color}
          fillRule="nonzero"
          d="M3,3 L9,3 L9,1 L3,1 C1.8954305,1 1,1.8954305 1,3 L1,9 L3,9 L3,3 Z"
        />
        <path
          fill={color}
          fillRule="nonzero"
          d="M3,15 L1,15 L1,21 C1,22.1045695 1.8954305,23 3,23 L9,23 L9,21 L3,21 L3,15 Z"
        />
      </g>
    </svg>
  );
}
