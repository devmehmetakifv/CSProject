import React from 'react';

const Logo = ({ width = 100, height = 100 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      display: 'block',
      margin: '0 auto',
      filter: 'drop-shadow(0 2px 8px rgba(25, 118, 210, 0.10))',
      background: 'transparent',
      borderRadius: '50%'
    }}
  >
    {/* Yarım mavi, yarım sarı daire */}
    <defs>
      <linearGradient id="halfCircle" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#1976d2" />
        <stop offset="50%" stopColor="#1976d2" />
        <stop offset="50%" stopColor="#FFD600" />
        <stop offset="100%" stopColor="#FFB300" />
      </linearGradient>
      <linearGradient id="blueGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1976d2" />
        <stop offset="100%" stopColor="#64b5f6" />
      </linearGradient>
      <linearGradient id="yellowGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFD600" />
        <stop offset="100%" stopColor="#FFB300" />
      </linearGradient>
    </defs>
    <circle
      cx="100"
      cy="100"
      r="77"
      fill="#fff"
      stroke="url(#halfCircle)"
      strokeWidth="8"
    />
    {/* "SANA" */}
    <text
      x="50%"
      y="38%"
      textAnchor="middle"
      fontFamily="'Segoe UI', Arial, sans-serif"
      fontWeight="900"
      fontSize="22"
      fill="url(#blueGradient)"
      letterSpacing="1"
      style={{ textTransform: 'uppercase' }}
    >
      SANA
    </text>
    {/* "İŞ" */}
    <text
      x="50%"
      y="58%"
      textAnchor="middle"
      fontFamily="'Segoe UI', Arial, sans-serif"
      fontWeight="900"
      fontSize="26"
      fill="url(#blueGradient)"
      letterSpacing="1"
      style={{ textTransform: 'uppercase' }}
    >
      İŞ
    </text>
    {/* "Mİ YOK" */}
    <text
      x="50%"
      y="78%"
      textAnchor="middle"
      fontFamily="'Segoe UI', Arial, sans-serif"
      fontWeight="900"
      fontSize="18"
      fill="url(#yellowGradient)"
      letterSpacing="1"
      style={{ textTransform: 'uppercase', filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.10))' }}
    >
      Mİ YOK
    </text>
  </svg>
);

export default Logo; 