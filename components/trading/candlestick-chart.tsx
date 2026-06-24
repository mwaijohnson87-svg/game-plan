'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CandlestickSeries, HistogramSeries } from 'lightweight-charts';
import { cn } from '@/lib/utils';
import type { TimeFrame } from '@/lib/types';

interface CandlestickChartProps {
  data: {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }[];
  timeframe?: TimeFrame;
  onTimeframeChange?: (tf: TimeFrame) => void;
}

const TIMEFRAMES: TimeFrame[] = ['1D', '1W', '1M', '3M', '1Y'];

export function CandlestickChart({
  data,
  timeframe = '1D',
  onTimeframeChange,
}: CandlestickChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#0A0E1A' },
        textColor: '#8B9BB4',
      },
      grid: {
        vertLines: { color: '#1C2433' },
        horzLines: { color: '#1C2433' },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: '#2A3545',
          width: 1,
        },
        horzLine: {
          color: '#2A3545',
          width: 1,
        },
      },
      rightPriceScale: {
        borderColor: '#2A3545',
      },
      timeScale: {
        borderColor: '#2A3545',
        timeVisible: true,
        secondsVisible: false,
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#00D4A0',
      downColor: '#FF4D6A',
      borderDownColor: '#FF4D6A',
      borderUpColor: '#00D4A0',
      wickDownColor: '#FF4D6A',
      wickUpColor: '#00D4A0',
    });

    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: '#00D4A0',
      priceFormat: { type: 'volume' },
      priceScaleId: '',
    });

    volumeSeries.priceScale().applyOptions({
      scaleMargins: { top: 0.85, bottom: 0 },
    });

    const candleData = data.map((d) => ({
      time: d.time as any,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    }));

    const volumeData = data.map((d) => ({
      time: d.time as any,
      value: d.volume,
      color: d.close >= d.open ? 'rgba(0, 212, 160, 0.4)' : 'rgba(255, 77, 106, 0.4)',
    }));

    candlestickSeries.setData(candleData);
    volumeSeries.setData(volumeData);

    chart.timeScale().fitContent();
    setIsLoading(false);

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border">
        {TIMEFRAMES.map((tf) => (
          <button
            key={tf}
            onClick={() => onTimeframeChange?.(tf)}
            className={cn(
              'px-3 py-1.5 text-sm font-medium rounded transition-all duration-fast',
              timeframe === tf
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-muted hover:text-text-secondary'
            )}
          >
            {tf}
          </button>
        ))}
      </div>
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <div className="text-text-muted">Loading chart...</div>
          </div>
        )}
        <div ref={chartContainerRef} className="w-full h-[400px]" />
      </div>
    </div>
  );
}
