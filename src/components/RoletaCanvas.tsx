import React, { useEffect, useRef } from 'react';
import type { ItemRoleta } from '../types/roleta';

interface RoletaCanvasProps {
  itens: ItemRoleta[];
  anguloAtual: number; // Em radianos
  estaGirando: boolean;
}

export const RoletaCanvas: React.FC<RoletaCanvasProps> = ({ itens, anguloAtual }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centroX = width / 2;
    const centroY = height / 2;
    const raio = Math.min(width, height) / 2 - 20;

    ctx.clearRect(0, 0, width, height);

    if (itens.length === 0) {
      // Estado vazio
      ctx.beginPath();
      ctx.arc(centroX, centroY, raio, 0, 2 * Math.PI);
      ctx.fillStyle = '#1e293b'; // slate-800
      ctx.fill();
      ctx.strokeStyle = '#334155'; // slate-700
      ctx.lineWidth = 6;
      ctx.stroke();

      ctx.fillStyle = '#94a3b8'; // slate-400
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Adicione itens na roleta', centroX, centroY);
      return;
    }

    const totalFatias = itens.length;
    const anguloPorFatia = (2 * Math.PI) / totalFatias;

    ctx.save();

    // 1. Desenhar Sombra da Roleta
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 10;

    // 2. Desenhar as Fatias
    itens.forEach((item, index) => {
      const startAngle = anguloAtual + index * anguloPorFatia;
      const endAngle = startAngle + anguloPorFatia;

      ctx.beginPath();
      ctx.moveTo(centroX, centroY);
      ctx.arc(centroX, centroY, raio, startAngle, endAngle);
      ctx.closePath();

      ctx.fillStyle = item.cor || '#3b82f6';
      ctx.fill();

      ctx.lineWidth = 2;
      ctx.strokeStyle = '#0f172a'; // slate-900 para divisórias limpas
      ctx.stroke();
    });

    ctx.restore();

    // 3. Desenhar Textos dos Itens
    ctx.save();
    itens.forEach((item, index) => {
      const meioFatiaAngle = anguloAtual + index * anguloPorFatia + anguloPorFatia / 2;

      ctx.save();
      ctx.translate(centroX, centroY);
      ctx.rotate(meioFatiaAngle);

      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.7)';
      ctx.shadowBlur = 4;

      // Trunca o texto se for muito grande
      const textoLimpo = item.texto.length > 22 ? item.texto.substring(0, 20) + '...' : item.texto;
      ctx.fillText(textoLimpo, raio - 30, 0);

      ctx.restore();
    });
    ctx.restore();

    // 4. Desenhar Borda Externa Luxuosa
    ctx.beginPath();
    ctx.arc(centroX, centroY, raio, 0, 2 * Math.PI);
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#1e293b';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centroX, centroY, raio - 5, 0, 2 * Math.PI);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.stroke();

    // 5. Desenhar Centro Decorativo (Hub)
    ctx.beginPath();
    ctx.arc(centroX, centroY, 35, 0, 2 * Math.PI);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#3b82f6';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centroX, centroY, 15, 0, 2 * Math.PI);
    ctx.fillStyle = '#3b82f6';
    ctx.fill();

  }, [itens, anguloAtual]);

  return (
    <div className="relative flex items-center justify-center">
      {/* Ponteiro / Marcador Superior (Fixo no Topo -> 270 rad / -90 deg) */}
      <div className="absolute -top-3 z-20 flex flex-col items-center pointer-events-none drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
        <div className="w-8 h-10 bg-gradient-to-b from-yellow-300 to-amber-500 clip-pointer rounded-t-md border border-amber-200"></div>
      </div>

      {/* Canvas da Roleta */}
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className="w-full max-w-[420px] md:max-w-[480px] aspect-square transition-transform duration-75"
      />
    </div>
  );
};
