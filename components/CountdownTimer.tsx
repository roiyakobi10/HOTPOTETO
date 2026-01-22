
import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  startTime: number;
  duration: number;
  paused?: boolean;
  onFinish?: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ startTime, duration, paused = false, onFinish }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    const updateTime = () => {
      const elapsed = Date.now() - startTime;
      const initialRemaining = Math.max(0, duration - elapsed);
      setTimeLeft(initialRemaining);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [startTime, duration]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onFinish?.();
    }
  }, [timeLeft <= 0]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (days > 0) {
      return (
        <div className="flex flex-row-reverse gap-2 items-baseline">
          <div className="flex flex-col items-center">
            <span className="text-4xl font-black">{days}</span>
            <span className="text-[10px] font-bold uppercase text-white/40">ימים</span>
          </div>
          <span className="text-2xl font-light opacity-30">:</span>
          <div className="flex flex-col items-center">
            <span className="text-4xl font-black">{String(hours).padStart(2, '0')}</span>
            <span className="text-[10px] font-bold uppercase text-white/40">שעות</span>
          </div>
          <span className="text-2xl font-light opacity-30">:</span>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black">{String(minutes).padStart(2, '0')}</span>
            <span className="text-[10px] font-bold uppercase text-white/40">דק'</span>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-row-reverse gap-2 items-baseline">
        <div className="flex flex-col items-center">
          <span className="text-5xl font-black">{String(hours).padStart(2, '0')}</span>
          <span className="text-[10px] font-bold uppercase text-white/40">שעות</span>
        </div>
        <span className="text-3xl font-light opacity-30">:</span>
        <div className="flex flex-col items-center">
          <span className="text-5xl font-black">{String(minutes).padStart(2, '0')}</span>
          <span className="text-[10px] font-bold uppercase text-white/40">דקות</span>
        </div>
        <span className="text-3xl font-light opacity-30">:</span>
        <div className="flex flex-col items-center">
          <span className="text-3xl font-black text-orange-500">{String(seconds).padStart(2, '0')}</span>
          <span className="text-[10px] font-bold uppercase text-orange-500/40">שניות</span>
        </div>
      </div>
    );
  };

  const percentage = (timeLeft / duration) * 100;

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className={`transition-all duration-500 ${paused ? 'opacity-40 grayscale' : ''}`}>
        {formatTime(timeLeft)}
      </div>
      
      <div className="w-full relative h-3 bg-white/5 rounded-full overflow-hidden border border-white/10 shadow-inner">
        <div 
          className={`h-full transition-all duration-1000 ease-linear rounded-full ${percentage < 15 ? 'bg-gradient-to-r from-red-600 to-orange-500 shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'bg-gradient-to-r from-orange-600 to-orange-400'}`}
          style={{ width: `${percentage}%` }}
        />
        {/* Progress markers */}
        <div className="absolute inset-0 flex justify-between px-1 pointer-events-none opacity-20">
          {[...Array(10)].map((_, i) => <div key={i} className="w-[1px] h-full bg-white"></div>)}
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
