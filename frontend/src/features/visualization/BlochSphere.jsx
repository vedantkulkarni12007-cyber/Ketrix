// --- Coordinate Projection Mathematics ---
// We use a pure orthographic projection mapping 3D (x,y,z) to 2D (u,v).
// To ensure the projected sphere fits perfectly inside a 2D circle of radius SCALE,
// the projection matrix must be composed of two orthonormal 3D vectors E_U and E_V.
// E_U represents the horizontal 2D screen axis in 3D space.
// E_V represents the vertical 2D screen axis in 3D space.
// We choose vectors to tilt the sphere so X, Y, and Z are all clearly visible:
// X axis projects to bottom-left, Y axis to bottom-right, Z axis upward.

const E_U = { x: -0.7071, y: 0.7071, z: 0 };
// Derivation of E_V: orthogonal to E_U, norm = 1, and negative Z for "upward" projection in SVG
const E_V = { x: 0.3333, y: 0.3333, z: -0.8819 };
const SCALE = 120;

const project = (x, y, z) => {
  return {
    u: (x * E_U.x + y * E_U.y + z * E_U.z) * SCALE,
    v: (x * E_V.x + y * E_V.y + z * E_V.z) * SCALE
  };
};

const drawPath3D = (points) => {
  return points.map((p, i) => {
    const proj = project(p.x, p.y, p.z);
    return `${i === 0 ? 'M' : 'L'} ${proj.u.toFixed(2)} ${proj.v.toFixed(2)}`;
  }).join(' ');
};

const generateCirclePoints = (axis, resolution = 64) => {
  const points = [];
  for (let i = 0; i <= resolution; i++) {
    const t = (i / resolution) * 2 * Math.PI;
    if (axis === 'z') points.push({ x: Math.cos(t), y: Math.sin(t), z: 0 }); // Equator
    else if (axis === 'y') points.push({ x: Math.cos(t), y: 0, z: Math.sin(t) }); // X-Z meridian
    else if (axis === 'x') points.push({ x: 0, y: Math.cos(t), z: Math.sin(t) }); // Y-Z meridian
  }
  return points;
};

const BlochSphere = ({ statevector, title, description }) => {
  let isValidNormalized = false;
  let x = 0, y = 0, z = 0;
  let errorMessage = '';

  // 1. Validation for purely single-qubit pure state
  if (Array.isArray(statevector) && statevector.length === 2) {
    if (
      typeof statevector[0]?.real === 'number' && typeof statevector[0]?.imag === 'number' &&
      typeof statevector[1]?.real === 'number' && typeof statevector[1]?.imag === 'number' &&
      Number.isFinite(statevector[0].real) && Number.isFinite(statevector[0].imag) &&
      Number.isFinite(statevector[1].real) && Number.isFinite(statevector[1].imag)
    ) {
      const r0 = statevector[0].real;
      const i0 = statevector[0].imag;
      const r1 = statevector[1].real;
      const i1 = statevector[1].imag;

      const magSq0 = r0 * r0 + i0 * i0;
      const magSq1 = r1 * r1 + i1 * i1;
      const totalMagSq = magSq0 + magSq1;

      // Check normalization within a reasonable floating-point tolerance
      if (Math.abs(totalMagSq - 1.0) <= 0.05) {
        isValidNormalized = true;
        
        // 2. Quantum Mathematics
        // |ψ⟩ = α|0⟩ + β|1⟩, where α = r0 + i*i0, β = r1 + i*i1
        // x = 2 Re(α* β) = 2(r0*r1 + i0*i1)
        // y = 2 Im(α* β) = 2(r0*i1 - i0*r1)
        // z = |α|² - |β|²
        
        x = 2 * (r0 * r1 + i0 * i1);
        y = 2 * (r0 * i1 - i0 * r1);
        z = magSq0 - magSq1;

        // Minor compensation for float math (keeps vector precisely on the unit sphere rim)
        const r = Math.sqrt(x*x + y*y + z*z);
        if (r > 0 && Math.abs(r - 1.0) < 0.1) {
          x /= r;
          y /= r;
          z /= r;
        }
      } else {
        errorMessage = 'Statevector is not normalized.';
      }
    } else {
      errorMessage = 'Statevector contains invalid or missing amplitudes.';
    }
  } else {
    errorMessage = 'Statevector must contain exactly 2 amplitudes (single qubit).';
  }

  // Projection values for rendering
  const stateProj = project(x, y, z);
  
  // Axes end points
  const pX = project(1.2, 0, 0);
  const pY = project(0, 1.2, 0);
  const pZ = project(0, 0, 1.2);

  // Label coordinates
  const lX = project(1.4, 0, 0);
  const lY = project(0, 1.4, 0);
  const lZ = project(0, 0, 1.4);
  
  // Poles
  const poleN = project(0, 0, 1.15);
  const poleS = project(0, 0, -1.15);

  return (
    <div className="sci-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Header */}
      {(title || description) && (
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          {title && <h3 className="text-white" style={{ marginBottom: '0.5rem' }}>{title}</h3>}
          {description && <p className="tech-label">{description}</p>}
        </div>
      )}

      {/* Error state */}
      {!isValidNormalized ? (
        <div style={{ 
          padding: '2rem', 
          border: '1px solid var(--accent-red)', 
          backgroundColor: 'rgba(248, 113, 113, 0.1)',
          color: 'var(--accent-red)',
          borderRadius: '4px',
          textAlign: 'center',
          fontFamily: 'var(--font-mono)'
        }}>
          <div>[INVALID_STATE]</div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>{errorMessage || 'Unknown error'}</div>
        </div>
      ) : (
        /* Valid state - Bloch Sphere Visualization */
        <div style={{ position: 'relative', width: '100%', maxWidth: '350px' }}>
          <svg 
            viewBox="-160 -160 320 320" 
            style={{ width: '100%', height: 'auto', overflow: 'visible' }}
            role="img" 
            aria-label="Bloch Sphere Visualization"
          >
            <title>Bloch Sphere</title>
            <desc>Displays the single-qubit quantum state on the Bloch Sphere.</desc>
            
            {/* Outline */}
            <circle cx="0" cy="0" r={SCALE} fill="var(--bg-panel-light)" stroke="var(--border-active)" strokeWidth="1" opacity="0.3" />
            
            {/* Equator & Meridians */}
            <path d={drawPath3D(generateCirclePoints('z'))} fill="none" stroke="var(--border-light)" strokeWidth="1" strokeDasharray="4 4" />
            <path d={drawPath3D(generateCirclePoints('y'))} fill="none" stroke="var(--border-light)" strokeWidth="1" strokeDasharray="4 4" />
            
            {/* Axes */}
            <line x1="0" y1="0" x2={pX.u} y2={pX.v} stroke="var(--border-active)" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="0" y1="0" x2={pY.u} y2={pY.v} stroke="var(--border-active)" strokeWidth="1" strokeDasharray="2 2" />
            <line x1={project(0,0,-1.2).u} y1={project(0,0,-1.2).v} x2={pZ.u} y2={pZ.v} stroke="var(--border-active)" strokeWidth="1" strokeDasharray="2 2" />

            {/* Axes Labels */}
            <text x={lX.u} y={lX.v} fill="var(--text-dim)" fontSize="12" fontFamily="var(--font-mono)" textAnchor="middle" dominantBaseline="middle">X</text>
            <text x={lY.u} y={lY.v} fill="var(--text-dim)" fontSize="12" fontFamily="var(--font-mono)" textAnchor="middle" dominantBaseline="middle">Y</text>
            <text x={lZ.u} y={lZ.v} fill="var(--text-dim)" fontSize="12" fontFamily="var(--font-mono)" textAnchor="middle" dominantBaseline="middle">Z</text>

            {/* Poles */}
            <text x={poleN.u} y={poleN.v} fill="var(--text-secondary)" fontSize="14" fontFamily="var(--font-mono)" textAnchor="middle" dominantBaseline="middle">|0⟩</text>
            <text x={poleS.u} y={poleS.v} fill="var(--text-secondary)" fontSize="14" fontFamily="var(--font-mono)" textAnchor="middle" dominantBaseline="middle">|1⟩</text>

            {/* State Projection Lines (depth cues) */}
            <path d={drawPath3D([ {x, y, z}, {x, y, z: 0}, {x:0, y:0, z:0} ])} fill="none" stroke="var(--accent-blue)" strokeWidth="1" strokeDasharray="2 2" opacity="0.4" style={{ transition: 'd 0.5s ease-out' }} />

            {/* State Vector */}
            <line x1="0" y1="0" x2={stateProj.u} y2={stateProj.v} stroke="var(--accent-blue)" strokeWidth="2.5" strokeLinecap="round" style={{ transition: 'x2 0.5s ease-out, y2 0.5s ease-out' }} />
            <circle cx={stateProj.u} cy={stateProj.v} r="4" fill="var(--accent-blue)" style={{ transition: 'cx 0.5s ease-out, cy 0.5s ease-out' }} />
          </svg>
          
          {/* Coordinates Overlay */}
          <div style={{ 
            marginTop: '1.5rem',
            padding: '1rem',
            backgroundColor: 'var(--bg-dark)',
            border: '1px solid var(--border-light)',
            borderRadius: '4px',
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span style={{ color: 'var(--text-dim)' }}>X: <span style={{ color: 'var(--text-primary)' }}>{x >= 0 ? ` ${x.toFixed(4)}` : x.toFixed(4)}</span></span>
              <span style={{ color: 'var(--text-dim)' }}>Y: <span style={{ color: 'var(--text-primary)' }}>{y >= 0 ? ` ${y.toFixed(4)}` : y.toFixed(4)}</span></span>
              <span style={{ color: 'var(--text-dim)' }}>Z: <span style={{ color: 'var(--text-primary)' }}>{z >= 0 ? ` ${z.toFixed(4)}` : z.toFixed(4)}</span></span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', color: 'var(--accent-blue)' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>|ψ⟩</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlochSphere;
