'use client';
import React, { useEffect, useState } from 'react';

function getTimeLeft(targetDate: Date) {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds };
}

const AdventCountdown = () => {
  const target = new Date('2025-10-15T23:59:59+01:00');
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(target));

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft(target)), 1000);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <div className="flex gap-4 text-lg font-bold text-white">
      <div>
        <span>{timeLeft.days}</span> days
      </div>
      <div>
        <span>{timeLeft.hours}</span> hours
      </div>
      <div>
        <span>{timeLeft.minutes}</span> min
      </div>
      <div>
        <span>{timeLeft.seconds}</span> sec
      </div>
    </div>
  );
};

export default AdventCountdown;
