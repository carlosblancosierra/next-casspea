'use client';

import { useEffect, useState } from 'react';
import { ORDER_DEADLINE, COPY } from './content';
import { pad, timeLeft } from './countdown';

interface Props {
    /**
     * The server's clock when the page was rendered. The first client render
     * uses it too, so the HTML and the hydrated tree match; the live clock
     * takes over straight after.
     */
    serverNow: number;
    /** `boxes` is the hero card; `inline` is the one line above the final button. */
    layout: 'boxes' | 'inline';
}

function useNow(serverNow: number) {
    const [now, setNow] = useState(serverNow);
    useEffect(() => {
        setNow(Date.now());
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);
    return now;
}

export default function Countdown({ serverNow, layout }: Props) {
    const now = useNow(serverNow);
    const left = timeLeft(ORDER_DEADLINE.getTime(), now);

    if (layout === 'inline') {
        return (
            <p className="m-0 text-[15px] font-semibold text-primary dark:text-primary-text-light">
                {left.closed
                    ? COPY.lateOrders
                    : `${pad(left.days)} days ${pad(left.hours)} hrs ${pad(left.minutes)} mins left to order in time`}
            </p>
        );
    }

    const units: [number, string][] = [
        [left.days, 'days'],
        [left.hours, 'hours'],
        [left.minutes, 'mins'],
        [left.seconds, 'secs'],
    ];

    return (
        <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-lg dark:border-gray-700 dark:bg-gray-900">
            <p className="text-sm font-semibold text-primary dark:text-primary-light">
                {left.closed ? COPY.hero.countdownClosed : COPY.hero.countdownOpen}
            </p>
            {left.closed ? (
                <p className="text-sm text-gray-700 dark:text-gray-300">{COPY.lateOrders}</p>
            ) : (
                <>
                    {/* The ticking numbers are not announced every second;
                        the sentence underneath carries the deadline. */}
                    <div className="grid grid-cols-4 gap-2 text-center" aria-hidden="true">
                        {units.map(([value, label]) => (
                            <div key={label} className="rounded-lg bg-primary px-1 py-2.5 text-primary-text-light">
                                <div className="font-playfair text-[32px] font-bold leading-9">{pad(value)}</div>
                                <div className="text-xs">{label}</div>
                            </div>
                        ))}
                    </div>
                    <p className="sr-only">
                        {`${left.days} days, ${left.hours} hours and ${left.minutes} minutes left to order.`}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{COPY.hero.countdownNote}</p>
                </>
            )}
        </div>
    );
}
