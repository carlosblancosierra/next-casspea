/** Time left until the order deadline, split for the countdown boxes. */
export interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    closed: boolean;
}

export function timeLeft(deadlineMs: number, nowMs: number): TimeLeft {
    let ms = Math.max(0, deadlineMs - nowMs);
    const days = Math.floor(ms / 86_400_000);
    ms -= days * 86_400_000;
    const hours = Math.floor(ms / 3_600_000);
    ms -= hours * 3_600_000;
    const minutes = Math.floor(ms / 60_000);
    ms -= minutes * 60_000;
    const seconds = Math.floor(ms / 1000);
    return { days, hours, minutes, seconds, closed: deadlineMs - nowMs <= 0 };
}

export const pad = (n: number) => String(n).padStart(2, '0');
