import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const heartEmojis = ['💕', '💖', '💗', '💝', '❤️'];

export function FloatingHearts({ count = 5, duration = 2500, onDone, variant = 'burst' }) {
  const [positions] = useState(() => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 300;
    return Array.from({ length: count }, () => ({
      left: Math.random() * width,
      emoji: variant === 'celebration' ? heartEmojis[Math.floor(Math.random() * heartEmojis.length)] : '💖',
      size: variant === 'celebration' ? Math.random() * 30 + 20 : 30,
    }));
  });

  useEffect(() => {
    const t = setTimeout(() => {
      onDone?.();
    }, duration);
    return () => clearTimeout(t);
  }, [duration, onDone]);

  const animDuration = variant === 'celebration' ? 3 : 2;
  const hearts = positions.map((pos, i) => (
    <div
      key={i}
      style={{
        position: 'fixed',
        left: `${pos.left}px`,
        bottom: 0,
        fontSize: `${pos.size}px`,
        pointerEvents: 'none',
        zIndex: 1000,
        animation: `floatUp ${animDuration}s ease-out forwards`,
        animationDelay: `${i * 0.1}s`,
      }}
    >
      {pos.emoji}
    </div>
  ));

  return createPortal(hearts, document.body);
}
