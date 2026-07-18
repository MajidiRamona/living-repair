'use client';

import { useEffect, useRef } from 'react';
import type { Chart as ChartType } from 'chart.js';
import { fraunces, inter } from '@/lib/fonts';

export default function HeroChart({ timeline }: { timeline: { year: number; elements_with_climate_action: number }[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<ChartType | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { Chart, registerables } = await import('chart.js');
      if (cancelled || !canvasRef.current) return;
      Chart.register(...registerables);
      // Canvas font strings can't reference CSS custom properties, so use the resolved family name directly.
      Chart.defaults.font.family = inter.style.fontFamily;
      Chart.defaults.color = '#444';

      const ink = '#1a1a1a';
      const accent = '#c5572f';
      const ctx = canvasRef.current.getContext('2d')!;
      const gradient = ctx.createLinearGradient(0, 0, 0, 360);
      gradient.addColorStop(0, accent + 'aa');
      gradient.addColorStop(1, accent + '11');

      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: timeline.map((p) => p.year),
          datasets: [
            {
              data: timeline.map((p) => p.elements_with_climate_action),
              borderColor: ink,
              backgroundColor: gradient,
              borderWidth: 2.5,
              fill: true,
              tension: 0.35,
              pointBackgroundColor: timeline.map((_, i) => (i === timeline.length - 1 ? accent : ink)),
              pointBorderColor: timeline.map((_, i) => (i === timeline.length - 1 ? accent : ink)),
              pointRadius: timeline.map((_, i) => (i === timeline.length - 1 ? 8 : 4)),
              pointHoverRadius: 9,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 1400, easing: 'easeOutCubic' },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: ink,
              titleFont: { family: fraunces.style.fontFamily, size: 14 },
              bodyFont: { size: 12 },
              padding: 10,
              callbacks: { label: (c) => `${c.parsed.y} elements` },
            },
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { font: { size: 12 }, color: '#666' },
              border: { color: ink },
            },
            y: {
              beginAtZero: true,
              suggestedMax: 100,
              grid: { color: '#1a1a1a11', drawTicks: false },
              ticks: { font: { size: 12 }, color: '#666', stepSize: 20 },
              border: { display: false },
            },
          },
        },
      });
    })();

    return () => {
      cancelled = true;
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [timeline]);

  return <canvas ref={canvasRef} />;
}
