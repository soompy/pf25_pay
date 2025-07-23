'use client';

import { useEffect, useRef, useCallback } from 'react';

interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  gravity: number;
  alpha: number;
  fade: number;
  trail: Array<{ x: number; y: number; alpha: number }>;
}

interface CanvasConfettiProps {
  active: boolean;
  duration?: number;
  particleCount?: number;
  containerRef?: React.RefObject<HTMLElement | null>;
}

export function CanvasConfetti({ 
  active, 
  duration = 5000, 
  containerRef
}: CanvasConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<ConfettiParticle[]>([]);
  const startTimeRef = useRef<number>(0);
  const fireworksCreated = useRef<boolean>(false);

  // const colors = [
  //   '#FFD700', '#FF6347', '#FF69B4', '#00CED1', '#32CD32',
  //   '#FF4500', '#DA70D6', '#00FA9A', '#FFB6C1', '#87CEEB'
  // ];


  // const createParticle = (): ConfettiParticle => {
  //   const bounds = getContainerBounds();
  //
  //   return {
  //     x: bounds.x + Math.random() * bounds.width,
  //     y: bounds.y - 10,
  //     vx: (Math.random() - 0.5) * 8,
  //     vy: Math.random() * 3 + 2,
  //     color: colors[Math.floor(Math.random() * colors.length)],
  //     size: Math.random() * 6 + 3,
  //     rotation: Math.random() * 360,
  //     rotationSpeed: (Math.random() - 0.5) * 6,
  //     gravity: 0.3 + Math.random() * 0.2,
  //     alpha: 1,
  //     fade: 0.01,
  //     trail: []
  //   };
  // };

  const updateParticle = (particle: ConfettiParticle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vy += particle.gravity;
    particle.rotation += particle.rotationSpeed;
    particle.vx *= 0.99;
    particle.alpha -= particle.fade;
  };

  const drawParticle = (ctx: CanvasRenderingContext2D, particle: ConfettiParticle) => {
    ctx.save();
    ctx.globalAlpha = particle.alpha;
    ctx.fillStyle = particle.color;
    
    // 간단한 원형 파티클
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  };

  const animate = useCallback((timestamp: number) => {
    const fireworkColors = [
      ['#FFD700', '#FFA500', '#FF4500'], // 황금색 폭죽
      ['#FF69B4', '#FF1493', '#DC143C'], // 핑크색 폭죽
      ['#00CED1', '#1E90FF', '#0000FF'], // 파란색 폭죽
      ['#32CD32', '#00FF00', '#228B22'], // 초록색 폭죽
      ['#DA70D6', '#9932CC', '#8B008B']  // 보라색 폭죽
    ];

    const getContainerBounds = () => {
      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        return {
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height
        };
      }
      return {
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight
      };
    };

    const createFireworkBurst = (x: number, y: number, colorPalette: string[]) => {
      const particles: ConfettiParticle[] = [];
      const particleCount = 20;
      
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        const speed = 5 + Math.random() * 3;
        
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: colorPalette[i % colorPalette.length],
          size: 2 + Math.random() * 3,
          rotation: 0,
          rotationSpeed: (Math.random() - 0.5) * 10,
          gravity: 0.1,
          alpha: 1,
          fade: 0.005,
          trail: []
        });
      }
      
      return particles;
    };

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const elapsed = timestamp - startTimeRef.current;
    
    // 지속시간이 지나면 애니메이션 중단
    if (elapsed > duration) {
      particlesRef.current = [];
      return;
    }

    // 캔버스 클리어
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 폭죽 효과 생성 (한 번만)
    if (!fireworksCreated.current && elapsed > 100) {
      const bounds = getContainerBounds();
      console.log('Creating fireworks at bounds:', bounds); // 디버깅
      fireworksCreated.current = true;
      
      // 여러 개의 폭죽 생성
      for (let i = 0; i < 3; i++) {
        const fireworkX = bounds.x + bounds.width * 0.2 + (i * bounds.width * 0.3);
        const fireworkY = bounds.y + bounds.height * 0.3;
        const colorPalette = fireworkColors[Math.floor(Math.random() * fireworkColors.length)];
        
        const newParticles = createFireworkBurst(fireworkX, fireworkY, colorPalette);
        console.log(`Firework ${i}: ${newParticles.length} particles at (${fireworkX}, ${fireworkY})`); // 디버깅
        particlesRef.current.push(...newParticles);
      }
      
      console.log('Total particles created:', particlesRef.current.length); // 디버깅
    }

    // 파티클 업데이트 및 그리기
    const bounds = getContainerBounds();
    particlesRef.current = particlesRef.current.filter(particle => {
      updateParticle(particle);
      
      // 알파값이 0 이하이거나 컨테이너 밖으로 나간 파티클 제거
      if (particle.alpha <= 0 ||
          particle.y > bounds.y + bounds.height + 100 || 
          particle.x < bounds.x - 50 || 
          particle.x > bounds.x + bounds.width + 50) {
        return false;
      }
      
      drawParticle(ctx, particle);
      return true;
    });

    // 파티클이 남아있거나 아직 지속시간이 남았으면 계속 애니메이션
    if (particlesRef.current.length > 0 || elapsed < duration) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [duration, containerRef]);

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  };

  useEffect(() => {
    if (active) {
      resizeCanvas();
      startTimeRef.current = 0;
      particlesRef.current = [];
      fireworksCreated.current = false; // 리셋
      animationRef.current = requestAnimationFrame(animate);

      const handleResize = () => resizeCanvas();
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    } else {
      // confetti 비활성화 시 정리
      particlesRef.current = [];
      fireworksCreated.current = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  }, [active, animate]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-40 transition-opacity duration-500"
      style={{ 
        width: '100vw', 
        height: '100vh',
        opacity: active ? 1 : 0
      }}
    />
  );
}