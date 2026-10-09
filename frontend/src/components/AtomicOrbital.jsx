const AtomicOrbital = ({ size = 400 }) => {
  const cx = 200;
  const cy = 200;
  const rx = 155;
  const ry = 50;

  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
      {/* SVG Atomic animation */}
      <svg
        viewBox="0 0 400 400"
        style={{ width: '100%', height: '100%' }}
        aria-label="Animated atomic orbital visualization"
      >
        <defs>
          <radialGradient id="nucleusGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.95)" />
            <stop offset="40%" stopColor="rgba(56, 189, 248, 0.8)" />
            <stop offset="100%" stopColor="rgba(56, 189, 248, 0)" />
          </radialGradient>
          <radialGradient id="haloGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(56, 189, 248, 0.15)" />
            <stop offset="100%" stopColor="rgba(56, 189, 248, 0)" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="electronGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer probability density rings */}
        <ellipse cx={cx} cy={cy} rx={rx + 28} ry={ry + 8} fill="none" stroke="rgba(56, 189, 248, 0.04)" strokeWidth="1.5" strokeDasharray="4 8" style={{ transformOrigin: `${cx}px ${cy}px`, animation: 'orbitalSpin 90s linear infinite reverse' }} />
        <ellipse cx={cx} cy={cy} rx={rx + 18} ry={ry + 5} fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" strokeDasharray="2 10" style={{ transformOrigin: `${cx}px ${cy}px`, animation: 'orbitalSpin 70s linear infinite' }} />

        {/* Nucleus glow halo */}
        <circle cx={cx} cy={cy} r={35} fill="url(#haloGrad)" style={{ animation: 'pulseGlow 3s ease-in-out infinite' }} />

        {/* Orbital plane 1 — rotating fastest */}
        <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: 'orbitalSpin 12s linear infinite' }}>
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
          {/* Electron 1 */}
          <circle cx={cx + rx} cy={cy} r="4.5" fill="rgb(56, 189, 248)" filter="url(#electronGlow)" style={{ animation: 'orbitalSpin 12s linear infinite reverse' }}>
            <animateMotion dur="12s" repeatCount="indefinite">
              <mpath xlinkHref="#orbit1" />
            </animateMotion>
          </circle>
        </g>

        {/* Orbital plane 2 — tilted 60deg */}
        <g style={{ transformOrigin: `${cx}px ${cy}px`, transform: 'rotate(60deg)', animation: 'orbitalSpin 18s linear infinite reverse' }}>
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
          <circle cx={cx + rx} cy={cy} r="4" fill="rgba(56, 189, 248, 0.9)" filter="url(#electronGlow)" style={{ animation: 'orbitalSpin 18s linear infinite' }}>
            <animateMotion dur="18s" repeatCount="indefinite">
              <mpath xlinkHref="#orbit2" />
            </animateMotion>
          </circle>
        </g>

        {/* Orbital plane 3 — tilted 120deg */}
        <g style={{ transformOrigin: `${cx}px ${cy}px`, transform: 'rotate(120deg)', animation: 'orbitalSpin 22s linear infinite' }}>
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" />
          <circle cx={cx + rx} cy={cy} r="3.5" fill="rgba(56, 189, 248, 0.85)" filter="url(#electronGlow)" style={{ animation: 'orbitalSpin 22s linear infinite reverse' }}>
            <animateMotion dur="22s" repeatCount="indefinite">
              <mpath xlinkHref="#orbit3" />
            </animateMotion>
          </circle>
        </g>

        {/* Nucleus */}
        <circle cx={cx} cy={cy} r="8" fill="url(#nucleusGrad)" filter="url(#glow)" />
        <circle cx={cx} cy={cy} r="4" fill="white" />
      </svg>

      {/* CSS-animated outer ring (3D feel) */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        width: '80%', height: '80%',
        transform: 'translate(-50%, -50%)',
        border: '1px solid rgba(56, 189, 248, 0.08)',
        borderRadius: '50%',
        animation: 'orbitalSpin 50s linear infinite',
        pointerEvents: 'none'
      }} />
    </div>
  );
};

export default AtomicOrbital;
