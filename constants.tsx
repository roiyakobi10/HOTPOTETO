
import React from 'react';

export const CITIES = [
  'תל אביב', 'ירושלים', 'חיפה', 'ראשון לציון', 'פתח תקווה', 'אשדוד', 'נתניה', 'באר שבע', 'בני ברק', 'חולון'
];

export const POTATO_SVG = (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <path
      d="M30,20 C10,30 5,60 20,80 C35,100 65,100 80,80 C95,60 90,30 70,20 C50,10 40,15 30,20 Z"
      fill="#8B4513"
      stroke="#5D2E0C"
      strokeWidth="2"
    />
    <circle cx="40" cy="40" r="3" fill="#5D2E0C" opacity="0.4" />
    <circle cx="60" cy="45" r="2" fill="#5D2E0C" opacity="0.4" />
    <circle cx="50" cy="70" r="3" fill="#5D2E0C" opacity="0.4" />
    <circle cx="75" cy="60" r="2" fill="#5D2E0C" opacity="0.4" />
  </svg>
);
