"use client";

import React, { useState, useEffect } from 'react';

interface PreorderCountdownProps {
  preorderFinishDate: Date | string;
}

const PreorderCountdown: React.FC<PreorderCountdownProps> = ({ preorderFinishDate }) => {
  const finishDate = typeof preorderFinishDate === 'string' 
    ? new Date(`${preorderFinishDate}T23:59:59+01:00`)
    : preorderFinishDate;
  
  const preorderFinishDateFormatted = finishDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long'
  });

  // Function to calculate remaining time until the finish date
  const calculateTimeLeft = () => {
    const difference = finishDate.getTime() - new Date().getTime();
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preorderFinishDate]);

  return (
    <div className="w-fit rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ring-primary/10 bg-primary text-white border border-primary">
      {/* Preorder tag with finish date */}
      <span>
        Preorder ends on {preorderFinishDateFormatted}
      </span>
      {/* Countdown */}
      <div className="flex gap-5">
        <div>
          <span className="countdown font-mono text-sm mr-1">
            <span 
              style={{ "--value": timeLeft.days } as React.CSSProperties} 
              aria-live="polite" 
              aria-label={`${timeLeft.days} days`}
            >
              {timeLeft.days}
            </span>
          </span>
          days
        </div>
        <div>
          <span className="countdown font-mono text-sm mr-1">
            <span 
              style={{ "--value": timeLeft.hours } as React.CSSProperties} 
              aria-live="polite" 
              aria-label={`${timeLeft.hours} hours`}
            >
              {timeLeft.hours}
            </span>
          </span>
          hours
        </div>
        <div>
          <span className="countdown font-mono text-sm mr-1">
            <span 
              style={{ "--value": timeLeft.minutes } as React.CSSProperties} 
              aria-live="polite" 
              aria-label={`${timeLeft.minutes} min`}
            >
              {timeLeft.minutes}
            </span>
          </span>
          min
        </div>
        <div>
          <span className="countdown font-mono text-sm mr-1">
            <span 
              style={{ "--value": timeLeft.seconds } as React.CSSProperties} 
              aria-live="polite" 
              aria-label={`${timeLeft.seconds} sec`}
            >
              {timeLeft.seconds}
            </span>
          </span>
          sec
        </div>
      </div>
    </div>
  );
};

export default PreorderCountdown;
