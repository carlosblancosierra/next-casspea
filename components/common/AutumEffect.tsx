'use client';

import { useMemo } from 'react';

type LeafConfig = {
    id: number;
    leftVw: number;
    delayS: number;
    durationS: number;
    sizePx: number;
    driftPx: number;
    rotateDir: 1 | -1;
    symbol: string;
};

const AutumEffect = () => {
    const leaves = useMemo<LeafConfig[]>(() => {
        const symbols = ['🍁', '🍂', '🍃'];
        const leafCount = 15;
        const generated: LeafConfig[] = [];
        for (let i = 0; i < leafCount; i++) {
            generated.push({
                id: i,
                leftVw: Math.random() * 100,
                delayS: -Math.random() * 20,
                durationS: 12 + Math.random() * 14,
                sizePx: 16 + Math.random() * 18,
                driftPx: 24 + Math.random() * 56,
                rotateDir: Math.random() > 0.5 ? 1 : -1,
                symbol: symbols[Math.floor(Math.random() * symbols.length)]
            });
        }
        return generated;
    }, []);

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 0,
                pointerEvents: 'none'
            }}
            aria-hidden="true"
        >
            {leaves.map(leaf => (
                <span
                    key={leaf.id}
                    className="leaf"
                    style={{
                        left: `${leaf.leftVw}vw`,
                        fontSize: `${Math.round(leaf.sizePx)}px`,
                        animationDelay: `${leaf.delayS}s`,
                        // CSS variables
                        ['--duration' as any]: `${leaf.durationS}s`,
                        ['--drift' as any]: `${Math.round(leaf.driftPx)}px`,
                        ['--rotateDir' as any]: leaf.rotateDir
                    }}
                >
                    {leaf.symbol}
                </span>
            ))}

            <style jsx>{`
                .leaf {
                    position: absolute;
                    top: -10vh;
                    opacity: 0.35;
                    transform: translate3d(0, 0, 0);
                    animation-name: fall;
                    animation-duration: var(--duration);
                    animation-timing-function: linear;
                    animation-iteration-count: infinite;
                    will-change: transform;
                    user-select: none;
                }

                @keyframes fall {
                    0% {
                        transform: translate3d(0, -10vh, 0) rotate(0deg);
                    }
                    20% {
                        transform: translate3d(calc(var(--drift) * 0.5), 20vh, 0) rotate(calc(90deg * var(--rotateDir)));
                    }
                    40% {
                        transform: translate3d(calc(var(--drift) * -0.5), 40vh, 0) rotate(calc(180deg * var(--rotateDir)));
                    }
                    60% {
                        transform: translate3d(calc(var(--drift) * 0.6), 60vh, 0) rotate(calc(270deg * var(--rotateDir)));
                    }
                    80% {
                        transform: translate3d(calc(var(--drift) * -0.6), 80vh, 0) rotate(calc(360deg * var(--rotateDir)));
                    }
                    100% {
                        transform: translate3d(0, 110vh, 0) rotate(calc(450deg * var(--rotateDir)));
                    }
                }
            `}</style>
        </div>
    );
}

export default AutumEffect;
