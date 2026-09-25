import React, { useEffect, useRef } from 'react';

export default function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let particles = [];

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render subtle drifting ember background
      if (Math.random() > 0.7 && particles.length < 25) {
        particles.push({
          x: Math.random() * canvas.width,
          y: canvas.height + 5,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -(Math.random() * 1.2 + 0.5),
          size: Math.random() * 2 + 1,
          alpha: 0.7,
        });
      }

      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.003;

        ctx.fillStyle = `rgba(245, 158, 11, ${Math.max(0, p.alpha)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (p.alpha <= 0 || p.y < -10) {
          particles.splice(index, 1);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 pointer-events-none z-10 w-full h-full"
    />
  );
}
