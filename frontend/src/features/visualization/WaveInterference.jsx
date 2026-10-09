import { useState, useEffect, useRef } from 'react';

const WaveInterference = () => {
  const [phase, setPhase] = useState(Math.PI);
  const [time, setTime] = useState(0);
  const requestRef = useRef();

  useEffect(() => {
    let cancel = false;
    const animate = () => {
      if (cancel) return;
      setTime(prev => prev + 0.05);
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      cancel = true;
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const width = 600;
  const height = 200;
  const points = 100;
  const amplitude = 40;
  const frequency = 0.02;

  const generateWave = (offsetPhase, ampMultiplier = 1) => {
    let path = `M 0 ${height / 2}`;
    for (let i = 0; i <= points; i++) {
      const x = (i / points) * width;
      // y = A * sin(kx - wt + phi)
      const y = (height / 2) + amplitude * ampMultiplier * Math.sin(x * frequency - time + offsetPhase);
      path += ` L ${x} ${y}`;
    }
    return path;
  };

  const generateInterference = () => {
    let path = `M 0 ${height / 2}`;
    for (let i = 0; i <= points; i++) {
      const x = (i / points) * width;
      const y1 = Math.sin(x * frequency - time);
      const y2 = Math.sin(x * frequency - time + phase);
      const y = (height / 2) + amplitude * (y1 + y2);
      path += ` L ${x} ${y}`;
    }
    return path;
  };

  const probability = (Math.cos(phase / 2) ** 2) * 100;

  return (
    <div className="sci-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="tech-label text-blue">WAVE INTERFERENCE</div>
          <h3 style={{ margin: '0.5rem 0 0 0' }}>Superposition & Phase</h3>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="tech-label">DETECTION PROBABILITY</div>
          <div className="text-mono" style={{ fontSize: '1.5rem', color: probability > 50 ? 'var(--accent-green)' : 'var(--accent-amber)' }}>
            {probability.toFixed(1)}%
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', width: '100%', maxWidth: '600px', margin: '0 auto', overflow: 'hidden', backgroundColor: 'var(--bg-panel-light)', border: '1px solid var(--border-light)' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
          {/* Reference Line */}
          <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="var(--border-active)" strokeDasharray="4 4" />
          
          {/* Wave 1 */}
          <path d={generateWave(0)} fill="none" stroke="var(--text-dim)" strokeWidth="2" opacity="0.6" strokeDasharray="2 2" />
          
          {/* Wave 2 */}
          <path d={generateWave(phase)} fill="none" stroke="var(--accent-amber)" strokeWidth="2" opacity="0.6" strokeDasharray="2 2" />
          
          {/* Interference Sum */}
          <path d={generateInterference()} fill="none" stroke="var(--accent-blue)" strokeWidth="3" />
        </svg>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span className="tech-label">RELATIVE PHASE: {(phase / Math.PI).toFixed(2)}π</span>
          <span className="text-mono text-dim">
            {phase === 0 ? '[CONSTRUCTIVE]' : (phase === Math.PI ? '[DESTRUCTIVE]' : '[PARTIAL]')}
          </span>
        </div>
        <input 
          type="range" 
          min="0" 
          max={2 * Math.PI} 
          step="0.01" 
          value={phase} 
          onChange={(e) => setPhase(parseFloat(e.target.value))}
          style={{ width: '100%', cursor: 'pointer' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <span>0 (In Phase)</span>
          <span>π (Out of Phase)</span>
          <span>2π (In Phase)</span>
        </div>
      </div>
      
    </div>
  );
};

export default WaveInterference;
