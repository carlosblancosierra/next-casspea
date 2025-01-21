'use client';

import dynamic from 'next/dynamic';
const Snowfall = dynamic(() => import('react-snowfall'), { ssr: false });

const HeartEffect = () => {
    // Create heart shape using an SVG
    const heart = document.createElement('img')
    heart.src = "data:image/svg+xml;base64," + btoa(`
        <svg viewBox="0 0 48 48" fill="#fda4af" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 42.7l-2.9-2.64C10.8 30.72 4 24.56 4 17 4 10.84 8.84 6 15 6c3.48 0 6.82 1.62 9 4.18C26.18 7.62 29.52 6 33 6c6.16 0 11 4.84 11 11 0 7.56-6.8 13.72-17.1 23.08L24 42.7z"/>
        </svg>
    `);

    return (
        <Snowfall
            style={{
                position: 'fixed',
                width: '100vw',
                height: '100vh',
                zIndex: 1000,
                opacity: 0.6,
                pointerEvents: 'none'
            }}
            snowflakeCount={20}
            speed={[0.5, 1.5]}
            wind={[-0.5, 0.5]}
            radius={[10, 16]}
            images={[heart]}
            rotationSpeed={[-1, 1]}
        />
    );
}

export default HeartEffect;
