'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
const Snowfall = dynamic(() => import('react-snowfall'), { ssr: false });

// Santa hat: red cone, white fur brim and pompom
const SANTA_HAT_SVG = `
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 48 C14 30 24 14 40 10 C48 8 54 14 52 22 C50 18 46 17 43 19 C40 28 44 38 52 48 Z" fill="#c8102e"/>
    <path d="M40 10 C48 8 54 14 52 22 C50 18 46 17 43 19 Z" fill="#a50d26"/>
    <rect x="8" y="46" width="48" height="10" rx="5" fill="#ffffff"/>
    <circle cx="52" cy="24" r="6" fill="#ffffff"/>
</svg>`;

const ChristmasEffect = () => {
    const [hats, setHats] = useState<HTMLImageElement[] | null>(null);

    useEffect(() => {
        const img = new Image();
        img.src = 'data:image/svg+xml;base64,' + btoa(SANTA_HAT_SVG);
        setHats([img]);
    }, []);

    return (
        <>
            {/* Light snow, as before */}
            <Snowfall
                style={{
                    position: 'fixed',
                    width: '100vw',
                    height: '100vh',
                    zIndex: 1000,
                    opacity: 0.2,
                    pointerEvents: 'none'
                }}
                snowflakeCount={100}
                speed={[0.2, 0.5]}
                wind={[-0.5, 0.5]}
                radius={[0.5, 2]}
                color="white"
            />

            {/* A few Santa hats, very subtle */}
            {hats && (
                <Snowfall
                    style={{
                        position: 'fixed',
                        width: '100vw',
                        height: '100vh',
                        zIndex: 1000,
                        opacity: 0.35,
                        pointerEvents: 'none'
                    }}
                    snowflakeCount={8}
                    speed={[0.3, 0.8]}
                    wind={[-0.3, 0.3]}
                    radius={[8, 13]}
                    images={hats}
                    rotationSpeed={[-0.5, 0.5]}
                />
            )}
        </>
    );
};

export default ChristmasEffect;
