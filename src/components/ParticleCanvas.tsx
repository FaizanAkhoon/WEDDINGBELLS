import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  maxOpacity: number;
  fadeDirection: number;
  type: 'sparkle' | 'petal' | 'bubble';
  rotation: number;
  rotationSpeed: number;
  color: string;
}

export const ParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const colors = [
      'rgba(94, 234, 212, ', // mint turquoise
      'rgba(245, 208, 107, ', // pale gold
      'rgba(255, 255, 255, ', // crisp white
      'rgba(153, 246, 228, ', // soft aqua
    ];

    const particleCount = Math.min(65, Math.floor((width * height) / 18000));
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const typeRand = Math.random();
      const type = typeRand > 0.65 ? 'petal' : typeRand > 0.3 ? 'sparkle' : 'bubble';
      const maxOpacity = type === 'petal' ? 0.65 : 0.85;

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: type === 'petal' ? Math.random() * 5 + 3 : Math.random() * 2.5 + 1.2,
        speedX: (Math.random() - 0.4) * 0.4,
        speedY: type === 'bubble' ? -Math.random() * 0.5 - 0.2 : (Math.random() - 0.3) * 0.5,
        opacity: Math.random() * maxOpacity,
        maxOpacity,
        fadeDirection: Math.random() > 0.5 ? 0.008 : -0.008,
        type,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        p.opacity += p.fadeDirection;

        if (p.opacity >= p.maxOpacity) {
          p.fadeDirection = -Math.abs(p.fadeDirection);
        } else if (p.opacity <= 0.05) {
          p.fadeDirection = Math.abs(p.fadeDirection);
        }

        // Wrap around boundaries
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.type === 'petal') {
          // Delicate teardrop lily petal
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 1.5, p.size * 0.8, 0, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${p.opacity})`;
          ctx.fill();
        } else if (p.type === 'sparkle') {
          // Four-pointed star sparkle (Genshin / Fontaine signature aesthetic)
          ctx.beginPath();
          const s = p.size * 2;
          ctx.moveTo(0, -s);
          ctx.quadraticCurveTo(0, 0, s, 0);
          ctx.quadraticCurveTo(0, 0, 0, s);
          ctx.quadraticCurveTo(0, 0, -s, 0);
          ctx.quadraticCurveTo(0, 0, 0, -s);
          ctx.fillStyle = `${p.color}${p.opacity})`;
          ctx.fill();
        } else {
          // Ethereal luminous bubble
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${p.opacity * 0.4})`;
          ctx.fill();
          ctx.lineWidth = 0.8;
          ctx.strokeStyle = `${p.color}${p.opacity * 0.8})`;
          ctx.stroke();
        }

        ctx.restore();
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
      className="fixed inset-0 pointer-events-none z-10 w-full h-full"
    />
  );
};
