import React from 'react';

export function CrossIcon({ color = '#ffffff' }) {
  return (
    <svg role="img" width="16px" height="16px" viewBox="0 0 16 16">
      <title>Add</title>
      <g
        fill="none"
        stroke="none"
        strokeWidth="1"
        fillRule="evenodd"
        strokeLinecap="round"
      >
        <g id="Group" stroke={color} strokeWidth="2">
          <line x1="8" y1="16" x2="8" y2="0" id="Path-4" />
          <line x1="0" y1="8" x2="16" y2="8" id="Path-4" />
        </g>
      </g>
    </svg>
  );
}
