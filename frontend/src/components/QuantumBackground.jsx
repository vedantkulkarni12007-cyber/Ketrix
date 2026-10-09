import { useEffect, useRef, useState } from 'react';

const isMobile = () => window.innerWidth < 768;

const QuantumBackground = () => {
  const canvasRef = useRef(null);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionRef.current = mediaQuery.matches;
    const handler = (e) => { reducedMotionRef.current = e.matches; };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    // Responsive particle count
    const particleCount = isMobile() ? 20 : 45;

    // Parallax particles
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      z: Math.random() * 2.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      phase: Math.random() * Math.PI * 2,
      size: Math.random() * 1.5 + 0.5,
    }));

    // Atomic structures — 3 at different corners/areas
    const buildAtoms = () => [
      { x: window.innerWidth * 0.82, y: window.innerHeight * 0.28, radius: isMobile() ? 60 : 120, speed: 0.006, numOrbitals: 3 },
      { x: window.innerWidth * 0.12, y: window.innerHeight * 0.65, radius: isMobile() ? 50 : 100, speed: 0.004, numOrbitals: 2 },
      { x: window.innerWidth * 0.55, y: window.innerHeight * 0.88, radius: isMobile() ? 40 : 80, speed: 0.007, numOrbitals: 2 },
    ];

    let atoms = buildAtoms();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      atoms = buildAtoms();
    };

    window.addEventListener('resize', resize);
    resize();

    const drawAtom = (atom) => {
      ctx.save();
      ctx.translate(atom.x, atom.y);

      // Nucleus glow halo
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, atom.radius * 0.15);
      gradient.addColorStop(0, 'rgba(56, 189, 248, 0.25)');
      gradient.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.beginPath();
      ctx.arc(0, 0, atom.radius * 0.15, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Nucleus core
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.9)';
      ctx.shadowBlur = 12;
      ctx.shadowColor = 'rgba(56, 189, 248, 0.8)';
      ctx.fill();
      ctx.shadowBlur = 0;

      // Orbitals with electrons
      for (let i = 0; i < atom.numOrbitals; i++) {
        const dir = i % 2 === 0 ? 1 : -1;
        const rotBase = (Math.PI / atom.numOrbitals) * i;
        const rotSpeed = time * atom.speed * dir;

        ctx.save();
        ctx.rotate(rotBase + rotSpeed);

        // Orbital ellipse
        ctx.beginPath();
        ctx.ellipse(0, 0, atom.radius, atom.radius * 0.32, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Electron position along ellipse
        const eAngle = time * 0.025 * (i + 1.5) * dir;
        const ex = atom.radius * Math.cos(eAngle);
        const ey = atom.radius * 0.32 * Math.sin(eAngle);

        // Electron trail (3 ghost positions)
        for (let t = 1; t <= 3; t++) {
          const trailAngle = eAngle - t * 0.15 * dir;
          const tx = atom.radius * Math.cos(trailAngle);
          const ty = atom.radius * 0.32 * Math.sin(trailAngle);
          ctx.beginPath();
          ctx.arc(tx, ty, 1.5 - t * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(56, 189, 248, ${0.3 - t * 0.08})`;
          ctx.fill();
        }

        // Electron
        ctx.beginPath();
        ctx.arc(ex, ey, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(56, 189, 248, 1)';
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(56, 189, 248, 0.9)';
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.restore();
      }

      ctx.restore();
    };

    const draw = () => {
      if (reducedMotionRef.current) {
        // Static fallback: just show dim atoms once, no animation loop
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      if (document.hidden) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw all atomic structures
      atoms.forEach(atom => drawAtom(atom));

      // Draw particles and quantum node connections
      particles.forEach((p, i) => {
        p.x += p.vx / p.z;
        p.y += p.vy / p.z;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const pulse = Math.sin(time * 0.05 + p.phase) * 0.4 + 0.8;
        const drawSize = Math.max(0.5, (p.size / p.z) * pulse);

        ctx.beginPath();
        ctx.arc(p.x, p.y, drawSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.35 / p.z})`;
        ctx.fill();

        // Node connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.07 * (1 - dist / 140)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      // Subtle horizontal wave bands (probability field suggestion)
      for (let w = 0; w < 3; w++) {
        ctx.beginPath();
        const waveY = (canvas.height * (0.25 + w * 0.25));
        ctx.moveTo(0, waveY);
        for (let x = 0; x < canvas.width; x += 8) {
          const y = waveY + Math.sin(x * 0.006 + time * 0.012 + w * 1.2) * 18;
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(56, 189, 248, 0.03)`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      time += 1;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
        background: 'transparent',
      }}
      aria-hidden="true"
    />
  );
};

export default QuantumBackground;
