'use client';

import { useEffect, useState } from 'react';

// Last order time for 1 December delivery: 26 Nov 2026, 12:00 UK time
// (GMT in November, so UTC). Change these two values for next year.
export const ORDER_DEADLINE = new Date('2026-11-26T12:00:00Z');
const DELIVERY_LABEL = '1st December';

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

function getTimeLeft(): TimeLeft | null {
    const diff = ORDER_DEADLINE.getTime() - Date.now();
    if (diff <= 0) return null;
    return {
        days: Math.floor(diff / 86_400_000),
        hours: Math.floor((diff % 86_400_000) / 3_600_000),
        minutes: Math.floor((diff % 3_600_000) / 60_000),
        seconds: Math.floor((diff % 60_000) / 1000),
    };
}

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * "Order by 26th November at noon for 1st December delivery" with a live
 * countdown. Renders nothing on the server (the time depends on the viewer's
 * clock) and nothing once the deadline has passed, so it can stay in the code.
 */
export default function ChristmasDeliveryCountdown({ className = '' }: { className?: string }) {
    const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setTimeLeft(getTimeLeft());
        const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
        return () => clearInterval(timer);
    }, []);

    if (!mounted || !timeLeft) return null;

    const units: [number, string][] = [
        [timeLeft.days, 'days'],
        [timeLeft.hours, 'hrs'],
        [timeLeft.minutes, 'min'],
        [timeLeft.seconds, 'sec'],
    ];

    return (
        <div
            className={`w-fit rounded-lg bg-red-700 text-white px-4 py-3 shadow-sm ${className}`}
            role="timer"
            aria-label={`Order by 26th November at noon for ${DELIVERY_LABEL} delivery`}
        >
            <p className="text-sm font-semibold">
                Order by 26th November at noon for {DELIVERY_LABEL} delivery
            </p>
            <div className="mt-2 flex gap-3">
                {units.map(([value, label]) => (
                    <div key={label} className="flex flex-col items-center min-w-[2.75rem] rounded-md bg-white/15 px-2 py-1">
                        <span className="font-mono text-lg font-bold leading-none tabular-nums">
                            {label === 'days' ? value : pad(value)}
                        </span>
                        <span className="text-[10px] uppercase tracking-wide opacity-80">{label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
