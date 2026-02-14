
import React, { useEffect, useState } from 'react';

export const Confetti: React.FC<{ active: boolean }> = ({ active }) => {
  const [pieces, setPieces] = useState<any[]>([]);

  useEffect(() => {
    if (active) {
      const newPieces = Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 3,
        size: 8 + Math.random() * 10,
        color: ['#ff4d8b', '#ff8fa3', '#ffd166', '#ef476f'][Math.floor(Math.random() * 4)],
        rotate: Math.random() * 360
      }));
      setPieces(newPieces);
    } else {
      setPieces([]);
    }
  }, [active]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.left}%`,
            top: '-20px',
            width: `${p.size}px`,
            height: `${p.size * 0.7}px`,
            backgroundColor: p.color,
            opacity: 0.8,
            borderRadius: '2px',
            transform: `rotate(${p.rotate}deg)`,
            animation: `fall ${p.duration}s linear ${p.delay}s forwards`
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
