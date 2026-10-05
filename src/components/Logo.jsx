import React from "react";

export const LogoIcon = ({ size = 36, className = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ verticalAlign: "middle", flexShrink: 0 }}
    >
      <defs>
        {/* Pin Blue 3D Gradient */}
        <linearGradient id="lvCompPinGrad" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stop-color="#00D2FF" />
          <stop offset="35%" stop-color="#0084FF" />
          <stop offset="100%" stop-color="#004AD7" />
        </linearGradient>

        {/* Green Hill Gradient */}
        <linearGradient id="lvCompGreenGrad" x1="0%" y1="0%" x2="100%" y2="80%">
          <stop offset="0%" stop-color="#10B981" />
          <stop offset="40%" stop-color="#16A34A" />
          <stop offset="100%" stop-color="#84CC16" />
        </linearGradient>

        {/* Road 3D Sheen */}
        <linearGradient id="lvCompRoadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFFFFF" />
          <stop offset="80%" stop-color="#F1F5F9" />
          <stop offset="100%" stop-color="#CBD5E1" />
        </linearGradient>

        {/* Glossy Highlight Gradient */}
        <linearGradient id="lvCompGlossGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.65" />
          <stop offset="50%" stop-color="#FFFFFF" stop-opacity="0.1" />
          <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
        </linearGradient>

        {/* Shadow Filter */}
        <filter id="lvCompShadow" x="-15%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#004AD7" flood-opacity="0.3" />
        </filter>

        {/* Pin Clip Path */}
        <clipPath id="lvCompPinClip">
          <path d="M 100,12 C 144,12 178,46 178,90 C 178,128 140,164 100,192 C 60,164 22,128 22,90 C 22,46 56,12 100,12 Z" />
        </clipPath>
      </defs>

      {/* Pin Body */}
      <g filter="url(#lvCompShadow)">
        <path
          d="M 100,12 C 144,12 178,46 178,90 C 178,128 140,164 100,192 C 60,164 22,128 22,90 C 22,46 56,12 100,12 Z"
          fill="url(#lvCompPinGrad)"
        />
      </g>

      {/* Clipped Inner Visuals */}
      <g clip-path="url(#lvCompPinClip)">
        {/* Glossy top-left sheen */}
        <ellipse cx="65" cy="50" rx="45" ry="30" fill="url(#lvCompGlossGrad)" transform="rotate(-25 65 50)" />

        {/* White Center Circle */}
        <circle cx="100" cy="84" r="50" fill="#FFFFFF" />

        {/* Microphone Capsule */}
        <rect x="88" y="56" width="20" height="32" rx="10" fill="#0A1E3F" />
        {/* Grille Bars */}
        <line x1="91" y1="65" x2="105" y2="65" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" />
        <line x1="91" y1="71" x2="105" y2="71" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" />
        <line x1="91" y1="77" x2="105" y2="77" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" />

        {/* Cradle */}
        <path d="M 83,72 C 83,89 113,89 113,72" fill="none" stroke="#0A1E3F" stroke-width="3.5" stroke-linecap="round" />
        {/* Stem & Base */}
        <line x1="98" y1="89" x2="98" y2="99" stroke="#0A1E3F" stroke-width="4" stroke-linecap="round" />
        <line x1="88" y1="99" x2="108" y2="99" stroke="#0A1E3F" stroke-width="4" stroke-linecap="round" />

        {/* Sound Waves (Right side) */}
        <path d="M 119,74 C 122,78 122,83 119,87" fill="none" stroke="#0084FF" stroke-width="3" stroke-linecap="round" />
        <path d="M 126,68 C 131,75 131,86 126,93" fill="none" stroke="#0084FF" stroke-width="3.2" stroke-linecap="round" />
        <path d="M 133,62 C 140,72 140,89 133,99" fill="none" stroke="#0084FF" stroke-width="3.2" stroke-linecap="round" />

        {/* Green Hill Landscape */}
        <path d="M 10,138 C 45,108 90,105 130,108 C 160,110 185,122 195,135 L 195,200 L 5,200 Z" fill="url(#lvCompGreenGrad)" />

        {/* Winding Road */}
        <path
          d="M 82,192 C 86,168 88,150 112,136 C 120,131 116,120 100,108 C 96,114 105,124 97,133 C 83,148 72,168 82,192 Z"
          fill="url(#lvCompRoadGrad)"
          stroke="#047857"
          stroke-width="0.75"
        />
        <path
          d="M 88,186 C 92,166 94,149 107,135 C 111,130 109,122 100,108"
          fill="none"
          stroke="#10B981"
          stroke-width="1.75"
          stroke-dasharray="3 3"
          stroke-linecap="round"
        />
      </g>

      {/* Pin Highlight Border */}
      <path
        d="M 100,12 C 144,12 178,46 178,90 C 178,128 140,164 100,192 C 60,164 22,128 22,90 C 22,46 56,12 100,12 Z"
        fill="none"
        stroke="#FFFFFF"
        stroke-width="1.5"
        stroke-opacity="0.35"
      />
    </svg>
  );
};

export const Logo = ({ size = 36, showText = true, textSize = "1.35rem", className = "", light = false }) => {
  return (
    <div
      className={`logo-container ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.55rem",
        textDecoration: "none",
        userSelect: "none"
      }}
    >
      <LogoIcon size={size} />
      {showText && (
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 800,
            fontSize: textSize,
            letterSpacing: "-0.03em",
            display: "inline-flex",
            alignItems: "center",
            lineHeight: 1
          }}
        >
          <span style={{ color: "#00b4d8" }}>Local</span>
          <span style={{ color: light ? "#60a5fa" : "#0284c7" }}>Voice</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
