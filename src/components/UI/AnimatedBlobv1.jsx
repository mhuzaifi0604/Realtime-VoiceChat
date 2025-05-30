import React, { useState, useEffect } from 'react';

// Animated Blob Component
const AnimatedBlobv1 = ({ isListening }) => {
    const [points, setPoints] = useState([]);
    const [rotation, setRotation] = useState(0);

    useEffect(() => {
        const generatePoints = () => {
            const numPoints = 12;
            const radius = isListening ? 70 + Math.random() * 30 : 80;
            const newPoints = [];

            for (let i = 0; i < numPoints; i++) {
                const angle = (i / numPoints) * 2 * Math.PI;
                const variance = isListening ? Math.random() * 30 - 15 : 0;
                const x = Math.cos(angle) * (radius + variance);
                const y = Math.sin(angle) * (radius + variance);
                newPoints.push([x, y]);
            }

            setPoints(newPoints);
        };

        const interval = setInterval(() => {
            generatePoints();
            setRotation(prev => (prev + 1) % 360);
        }, 50);

        return () => clearInterval(interval);
    }, [isListening]);

    const pathData = points.length > 0
        ? `M ${points[0][0]},${points[0][1]} ` +
        points.map((point, i) => {
            const nextPoint = points[(i + 1) % points.length];
            const controlPoint1 = [
                (point[0] + nextPoint[0]) / 2 - (nextPoint[1] - point[1]) / 8,
                (point[1] + nextPoint[1]) / 2 + (nextPoint[0] - point[0]) / 8
            ];
            const controlPoint2 = [
                (point[0] + nextPoint[0]) / 2 + (nextPoint[1] - point[1]) / 8,
                (point[1] + nextPoint[1]) / 2 - (nextPoint[0] - point[0]) / 8
            ];
            return `C ${controlPoint1[0]},${controlPoint1[1]} ${controlPoint2[0]},${controlPoint2[1]} ${nextPoint[0]},${nextPoint[1]}`;
        }).join(' ') + ' Z'
        : '';

    return (
        <svg
            viewBox="-100 -100 200 200"
            className="w-64 h-64"
            style={{
                transform: `rotate(${rotation}deg)`,
                filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.2))',
                position: 'relative',
                zIndex: 50
            }}
        >
            <defs>
                <linearGradient id="blob-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#60A5FA' }} />
                    <stop offset="50%" style={{ stopColor: '#8B5CF6' }} />
                    <stop offset="100%" style={{ stopColor: '#EC4899' }} />
                </linearGradient>
                <filter id="blur">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
                </filter>
            </defs>
            <path
                d={pathData}
                fill="url(#blob-gradient)"
                filter="url(#blur)"
                className="transition-all duration-200"
            />
        </svg>
    );
};

export default AnimatedBlobv1