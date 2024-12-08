'use client';

import dynamic from 'next/dynamic';
const Snowfall = dynamic(() => import('react-snowfall'), { ssr: false });

const SnowEffect = () => {
    return (
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
    );
}

export default SnowEffect;
