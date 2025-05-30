import { useState, useRef, useEffect } from 'react';

const ChatGPTVoiceUI = ({ isListening, isSpeaking }) => {
    const [cloudPatterns, setCloudPatterns] = useState([]);
    const [animationTime, setAnimationTime] = useState(0);
    const animationRef = useRef();

    useEffect(() => {
        // Generate multiple cloud layers for depth
        const generateCloudPatterns = () => {
            const patterns = [];
            const numLayers = 8;

            for (let layer = 0; layer < numLayers; layer++) {
                const numClouds = 15 + layer * 2;
                const clouds = [];

                for (let i = 0; i < numClouds; i++) {
                    clouds.push({
                        id: `${layer}-${i}`,
                        x: (Math.random() - 0.5) * 140,
                        y: (Math.random() - 0.5) * 140,
                        baseX: (Math.random() - 0.5) * 140,
                        baseY: (Math.random() - 0.5) * 140,
                        size: Math.random() * 25 + 10 + layer * 2,
                        opacity: 0.1 + layer * 0.05,
                        speed: 0.3 + layer * 0.1,
                        phase: Math.random() * Math.PI * 2,
                        layer: layer
                    });
                }

                patterns.push({
                    id: layer,
                    clouds: clouds,
                    rotationSpeed: 0.2 + layer * 0.05
                });
            }

            setCloudPatterns(patterns);
        };

        generateCloudPatterns();
    }, []);

    useEffect(() => {
        const animate = () => {
            setAnimationTime(prev => prev + 0.02);

            const intensity = (isListening || isSpeaking) ? 1.5 : 0.3;

            setCloudPatterns(prev => prev.map(pattern => ({
                ...pattern,
                clouds: pattern.clouds.map(cloud => {
                    const waveX = Math.sin(animationTime * cloud.speed + cloud.phase) * intensity * 15;
                    const waveY = Math.cos(animationTime * cloud.speed * 0.7 + cloud.phase) * intensity * 10;
                    const sizeWave = Math.sin(animationTime * 2 + cloud.phase) * intensity * 3;
                    const opacityWave = Math.sin(animationTime * 1.5 + cloud.phase) * 0.02;

                    return {
                        ...cloud,
                        x: cloud.baseX + waveX,
                        y: cloud.baseY + waveY,
                        size: cloud.size + sizeWave,
                        opacity: Math.max(0, Math.min(0.4, cloud.opacity + opacityWave * intensity))
                    };
                })
            })));

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isListening, isSpeaking, animationTime]);

    const isActive = isListening || isSpeaking;
    const baseSize = 300;
    const pulseSize = isActive ? baseSize + Math.sin(animationTime * 3) * 15 : baseSize;

    return (
        <div className="relative flex items-center justify-center">
            <svg
                viewBox="-150 -150 300 300"
                className="drop-shadow-2xl"
                style={{
                    width: `${pulseSize}px`,
                    height: `${pulseSize}px`,
                    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
            >
                <defs>
                    {/* Main circle gradient - exactly like ChatGPT */}
                    <radialGradient id="main-circle-gradient" cx="30%" cy="30%" r="70%">
                        <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 0.95 }} />
                        <stop offset="25%" style={{ stopColor: '#e0f2fe', stopOpacity: 0.8 }} />
                        <stop offset="50%" style={{ stopColor: '#7dd3fc', stopOpacity: 0.6 }} />
                        <stop offset="75%" style={{ stopColor: '#0ea5e9', stopOpacity: 0.4 }} />
                        <stop offset="100%" style={{ stopColor: '#0369a1', stopOpacity: 0.2 }} />
                    </radialGradient>

                    {/* Cloud gradients for different layers */}
                    <radialGradient id="cloud-light" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 0.6 }} />
                        <stop offset="100%" style={{ stopColor: '#bfdbfe', stopOpacity: 0.1 }} />
                    </radialGradient>

                    <radialGradient id="cloud-medium" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" style={{ stopColor: '#dbeafe', stopOpacity: 0.4 }} />
                        <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 0.05 }} />
                    </radialGradient>

                    <radialGradient id="cloud-deep" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" style={{ stopColor: '#93c5fd', stopOpacity: 0.3 }} />
                        <stop offset="100%" style={{ stopColor: '#1d4ed8', stopOpacity: 0.02 }} />
                    </radialGradient>

                    {/* Soft glow filter */}
                    <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    {/* Mask for keeping clouds inside circle */}
                    <mask id="circle-mask">
                        <circle cx="0" cy="0" r="75" fill="white" />
                    </mask>
                </defs>

                {/* Main background circle */}
                <circle
                    cx="0"
                    cy="0"
                    r="75"
                    fill="url(#main-circle-gradient)"
                    filter="url(#soft-glow)"
                    className="transition-all duration-700 ease-out"
                    style={{
                        transform: isActive ? 'scale(1.05)' : 'scale(1)',
                        opacity: isActive ? 1 : 0.85
                    }}
                />

                {/* Cloud patterns inside the circle */}
                <g mask="url(#circle-mask)">
                    {cloudPatterns.map(pattern => (
                        <g
                            key={pattern.id}
                            style={{
                                transform: `rotate(${animationTime * pattern.rotationSpeed * 10}deg)`,
                                transformOrigin: '0 0'
                            }}
                        >
                            {pattern.clouds.map(cloud => {
                                // Use different gradients for different layers
                                let fillGradient = 'url(#cloud-light)';
                                if (cloud.layer > 2 && cloud.layer < 6) fillGradient = 'url(#cloud-medium)';
                                if (cloud.layer >= 6) fillGradient = 'url(#cloud-deep)';

                                return (
                                    <circle
                                        key={cloud.id}
                                        cx={cloud.x}
                                        cy={cloud.y}
                                        r={Math.abs(cloud.size)}
                                        fill={fillGradient}
                                        opacity={cloud.opacity}
                                        className="transition-opacity duration-300 ease-out"
                                        style={{
                                            filter: `blur(${cloud.layer * 0.5 + 1}px)`
                                        }}
                                    />
                                );
                            })}
                        </g>
                    ))}
                </g>

                {/* Subtle border/rim */}
                <circle
                    cx="0"
                    cy="0"
                    r="75"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth="0.5"
                    opacity={isActive ? 0.6 : 0.3}
                    className="transition-all duration-500"
                />
            </svg>
        </div>
    );
};

export default ChatGPTVoiceUI;