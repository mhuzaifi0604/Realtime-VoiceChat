import { useState, useRef, useEffect } from 'react';

const AudioWaveUI = ({ isListening, isSpeaking, isUserSpeaking, isBotSpeaking, isConnected }) => {
    const [animationTime, setAnimationTime] = useState(0);
    const [isTransformed, setIsTransformed] = useState(false);
    const [particles, setParticles] = useState([]);
    const animationRef = useRef();

    // Generate particles for enhanced visual effects
    useEffect(() => {
        const generateParticles = () => {
            const newParticles = [];
            for (let i = 0; i < 25; i++) {
                newParticles.push({
                    id: i,
                    x: Math.random() * 600,
                    y: Math.random() * 200,
                    size: Math.random() * 3 + 1,
                    speed: Math.random() * 0.5 + 0.2,
                    opacity: Math.random() * 0.5 + 0.2,
                    phase: Math.random() * Math.PI * 2
                });
            }
            setParticles(newParticles);
        };

        generateParticles();
    }, []);

    // High-performance animation loop
    useEffect(() => {
        const animate = () => {
            setAnimationTime(prev => prev + 0.08);
            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    // Transform trigger
    useEffect(() => {
        if (isConnected && !isTransformed) {
            setTimeout(() => {
                setIsTransformed(true);
            }, 800);
        }
    }, [isConnected, isTransformed]);

    // Determine current state
    const getWaveState = () => {
        if (isBotSpeaking) return 'bot-speaking';
        if (isUserSpeaking) return 'user-speaking';
        if (isListening) return 'listening';
        return 'idle';
    };

    const waveState = getWaveState();

    // Generate multiple wave layers for depth
    const generateWaveLayers = () => {
        const layers = [];
        const numLayers = 4;
        const width = 600;
        const height = 200;
        const centerY = height / 2;

        for (let layer = 0; layer < numLayers; layer++) {
            let path = `M 0 ${centerY}`;

            for (let x = 0; x <= width; x += 4) {
                let y = centerY;
                const progress = x / width;

                // Different wave patterns based on state and layer
                switch (waveState) {
                    case 'bot-speaking':
                        const botIntensity = 1.2 + Math.sin(animationTime * 3) * 0.4;
                        const botWave1 = Math.sin(animationTime * 4 + progress * 8 + layer) * (25 - layer * 4) * botIntensity;
                        const botWave2 = Math.sin(animationTime * 6 + progress * 12 + layer * 1.5) * (15 - layer * 2) * botIntensity;
                        const botWave3 = Math.sin(animationTime * 8 + progress * 16 + layer * 2) * (10 - layer) * botIntensity;
                        y = centerY + botWave1 + botWave2 * 0.7 + botWave3 * 0.4;
                        break;

                    case 'user-speaking':
                        const userIntensity = 1.0 + Math.sin(animationTime * 2.5) * 0.3;
                        const userWave1 = Math.sin(animationTime * 3 + progress * 6 + layer * 0.8) * (20 - layer * 3) * userIntensity;
                        const userWave2 = Math.cos(animationTime * 4.5 + progress * 10 + layer * 1.2) * (12 - layer * 2) * userIntensity;
                        y = centerY + userWave1 + userWave2 * 0.6;
                        break;

                    case 'listening':
                        const breatheIntensity = 0.6 + Math.sin(animationTime * 0.8) * 0.2;
                        const listenWave = Math.sin(animationTime * 1.5 + progress * 4 + layer * 0.5) * (8 - layer) * breatheIntensity;
                        const pulseWave = Math.sin(animationTime * 0.5 + layer) * (4 - layer) * breatheIntensity;
                        y = centerY + listenWave + pulseWave;
                        break;

                    default:
                        const idleWave = Math.sin(animationTime * 0.5 + progress * 2 + layer * 0.3) * (3 - layer * 0.5);
                        y = centerY + idleWave;
                }

                path += ` L ${x} ${y}`;
            }

            layers.push({
                path,
                layer,
                opacity: 0.9 - layer * 0.15,
                strokeWidth: 3 - layer * 0.4
            });
        }

        return layers;
    };

    const waveLayers = generateWaveLayers();

    // Professional and modern color scheme
    const getStateTheme = () => {
        switch (waveState) {
            case 'bot-speaking':
                return {
                    primary: '#0ea5e9',
                    secondary: '#0284c7',
                    accent: '#38bdf8',
                    gradient: ['#0c4a6e', '#075985', '#0369a1', '#0284c7', '#0ea5e9', '#38bdf8'],
                    glow: '#0ea5e9',
                    particles: '#7dd3fc'
                };
            case 'user-speaking':
                return {
                    primary: '#10b981',
                    secondary: '#059669',
                    accent: '#34d399',
                    gradient: ['#064e3b', '#065f46', '#047857', '#059669', '#10b981', '#34d399'],
                    glow: '#10b981',
                    particles: '#6ee7b7'
                };
            case 'listening':
                return {
                    primary: '#f59e0b',
                    secondary: '#d97706',
                    accent: '#fbbf24',
                    gradient: ['#78350f', '#92400e', '#b45309', '#d97706', '#f59e0b', '#fbbf24'],
                    glow: '#f59e0b',
                    particles: '#fde68a'
                };
            default:
                return {
                    primary: '#6366f1',
                    secondary: '#4f46e5',
                    accent: '#818cf8',
                    gradient: ['#312e81', '#3730a3', '#4338ca', '#4f46e5', '#6366f1', '#818cf8'],
                    glow: '#6366f1',
                    particles: '#a5b4fc'
                };
        }
    };

    const theme = getStateTheme();

    // Render initial pulsing orb (keeping your original design)
    if (!isTransformed) {
        return (
            <div className="relative flex items-center justify-center w-full h-64">
                {/* Background gradient */}
                <div
                    className="absolute inset-0 rounded-full blur-3xl opacity-30"
                    style={{
                        background: `radial-gradient(circle, ${theme.gradient[3]}40 0%, ${theme.gradient[2]}20 50%, transparent 100%)`
                    }}
                />

                {/* Main orb */}
                <div
                    className="relative w-32 h-32 rounded-full flex items-center justify-center"
                    style={{
                        background: `radial-gradient(circle at 30% 30%, ${theme.gradient[3]}80, ${theme.gradient[2]}60, ${theme.gradient[1]}40)`,
                        boxShadow: `0 0 50px ${theme.glow}60, inset 0 0 30px ${theme.gradient[3]}40`,
                        animation: 'pulse-orb 2s ease-in-out infinite'
                    }}
                >
                    {/* Inner glow */}
                    <div
                        className="w-20 h-20 rounded-full opacity-70"
                        style={{
                            background: `radial-gradient(circle, ${theme.gradient[3]}60, transparent 70%)`,
                            animation: 'pulse-inner 1.5s ease-in-out infinite alternate'
                        }}
                    />
                </div>

                {/* Status text */}
                <div className="absolute -bottom-8 text-center">
                    <div
                        className="text-sm font-medium"
                        style={{ color: theme.primary }}
                    >
                        Initializing Neural Link...
                    </div>
                </div>

                <style jsx>{`
                    @keyframes pulse-orb {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.05); }
                    }
                    @keyframes pulse-inner {
                        0% { opacity: 0.4; transform: scale(1); }
                        100% { opacity: 0.8; transform: scale(1.1); }
                    }
                `}</style>
            </div>
        );
    }

    // Main wave visualization
    return (
        <div className="relative flex items-center justify-center w-full">
            <svg
                viewBox="0 0 600 200"
                className="drop-shadow-2xl"
                style={{
                    width: '600px',
                    height: '200px',
                    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
            >
                <defs>
                    {/* Modern professional gradient for waves */}
                    <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{ stopColor: theme.gradient[1], stopOpacity: 0.6 }} />
                        <stop offset="25%" style={{ stopColor: theme.gradient[2], stopOpacity: 0.8 }} />
                        <stop offset="50%" style={{ stopColor: theme.primary, stopOpacity: 1 }} />
                        <stop offset="75%" style={{ stopColor: theme.gradient[2], stopOpacity: 0.8 }} />
                        <stop offset="100%" style={{ stopColor: theme.gradient[1], stopOpacity: 0.6 }} />
                    </linearGradient>

                    {/* Clean glow effects */}
                    <filter id="glow-effect" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    <filter id="strong-glow" x="-100%" y="-100%" width="300%" height="300%">
                        <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    {/* Subtle background pattern */}
                    <pattern id="audio-grid" width="40" height="20" patternUnits="userSpaceOnUse">
                        <path
                            d="M 0 10 L 40 10 M 20 0 L 20 20"
                            fill="none"
                            stroke={theme.gradient[1]}
                            strokeWidth="0.5"
                            opacity="0.3"
                        />
                    </pattern>
                </defs>

                {/* Background */}
                <rect width="100%" height="100%" fill="url(#audio-grid)" />

                {/* Background glow */}
                <rect
                    width="100%"
                    height="100%"
                    fill={`url(#wave-gradient)`}
                    opacity="0.05"
                />

                {/* Multiple wave layers for depth */}
                {waveLayers.map((layer, index) => (
                    <path
                        key={index}
                        d={layer.path}
                        fill="none"
                        stroke="url(#wave-gradient)"
                        strokeWidth={layer.strokeWidth}
                        opacity={layer.opacity}
                        filter={index === 0 ? "url(#strong-glow)" : "url(#glow-effect)"}
                        style={{
                            transition: 'all 0.3s ease-out'
                        }}
                    />
                ))}

                {/* Animated particles */}
                {particles.map((particle, index) => {
                    const x = particle.x + Math.sin(animationTime * particle.speed + particle.phase) * 20;
                    const y = particle.y + Math.cos(animationTime * particle.speed * 0.7 + particle.phase) * 10;
                    const opacity = particle.opacity * (waveState !== 'idle' ? 1 : 0.3);

                    return (
                        <circle
                            key={particle.id}
                            cx={x}
                            cy={y}
                            r={particle.size}
                            fill={theme.particles}
                            opacity={opacity}
                            filter="url(#glow-effect)"
                        />
                    );
                })}

                {/* Center frequency indicator */}
                <circle
                    cx="300"
                    cy="100"
                    r={waveState !== 'idle' ? (4 + Math.sin(animationTime * 4) * 2) : 2}
                    fill={theme.primary}
                    opacity="0.8"
                    filter="url(#strong-glow)"
                />

                {/* Scanner line */}
                {(waveState === 'bot-speaking' || waveState === 'user-speaking') && (
                    <line
                        x1={((animationTime * 60) % 600)}
                        y1="0"
                        x2={((animationTime * 60) % 600)}
                        y2="200"
                        stroke={theme.primary}
                        strokeWidth="1"
                        opacity="0.4"
                        filter="url(#glow-effect)"
                    />
                )}

                {/* Peak indicators */}
                {waveState !== 'idle' && (
                    <>
                        <circle
                            cx="150"
                            cy={100 + Math.sin(animationTime * 3) * 15}
                            r="3"
                            fill={theme.accent}
                            opacity="0.7"
                        />
                        <circle
                            cx="450"
                            cy={100 + Math.sin(animationTime * 2.5 + Math.PI) * 15}
                            r="3"
                            fill={theme.accent}
                            opacity="0.7"
                        />
                    </>
                )}
            </svg>

            {/* Status display */}
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
                <div className="flex items-center space-x-3">
                    {/* Status indicator */}
                    <div
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ backgroundColor: theme.primary }}
                    />

                    {/* Status text */}
                    <div
                        className="text-sm font-medium tracking-wide"
                        style={{ color: theme.primary }}
                    >
                        {(() => {
                            switch (waveState) {
                                case 'bot-speaking':
                                    return 'AI RESPONDING';
                                case 'user-speaking':
                                    return 'PROCESSING INPUT';
                                case 'listening':
                                    return 'LISTENING';
                                default:
                                    return 'STANDBY';
                            }
                        })()}
                    </div>

                    {/* Activity meter */}
                    {waveState !== 'idle' && (
                        <div className="flex space-x-1">
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-1 bg-current animate-pulse"
                                    style={{
                                        height: `${8 + Math.sin(animationTime * 4 + i) * 4}px`,
                                        color: theme.primary,
                                        animationDelay: `${i * 0.1}s`
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Ambient glow */}
            <div
                className="absolute inset-0 -z-10 blur-3xl opacity-20"
                style={{
                    background: `radial-gradient(ellipse at center, ${theme.primary}40 0%, transparent 70%)`
                }}
            />
        </div>
    );
};

export default AudioWaveUI;