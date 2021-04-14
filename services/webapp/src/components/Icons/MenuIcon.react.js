import React from 'react';

export function MenuIcon({ color = '#ffffff' }) {
  return (
    <svg width="24px" height="24px" viewBox="0 0 24 24">
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g
          fill={color}
          fillRule="nonzero"
          transform="translate(1.000000, 3.000000)"
        >
          <path d="M21.08,2 L5,2 L5,0 L21.08,0 C21.6008219,0.0417970282 22.0016745,0.477506291 22,1 L22,1 C22.0016745,1.52249371 21.6008219,1.95820297 21.08,2 Z" />
          <path d="M21.08,10 L5,10 L5,8 L21.08,8 C21.6008219,8.04179703 22.0016745,8.47750629 22,9 L22,9 C22.0016745,9.52249371 21.6008219,9.95820297 21.08,10 Z" />
          <path d="M21.08,18 L5,18 L5,16 L21.08,16 C21.6008219,16.041797 22.0016745,16.4775063 22,17 L22,17 C22.0016745,17.5224937 21.6008219,17.958203 21.08,18 Z" />
          <circle cx="1" cy="1" r="1" />
          <circle cx="1" cy="9" r="1" />
          <circle cx="1" cy="17" r="1" />
        </g>
      </g>
    </svg>
  );
}
