// import { useEffect, useRef, useState } from 'react';
// import { X, Mic, MicOff } from 'lucide-react';
// import AnimatedBlobv1 from './UI/AnimatedBlobv1';
// import AnimatedBlobv2 from './UI/AnimatedBlobv2';
// import AnimatedBlobv3 from './UI/AnimatedBlobv3';
// import AnimatedBlobv4 from './UI/AnimatedBlobv4';
// import { createVoiceChatSession } from './sessionManager';
// import ReactDOM from 'react-dom';

// const RealTimeVoiceChat = ({
//     isOpen,
//     onClose,
//     name,
//     uiVersion = 'v1',
//     customUI,
//     theme = 'dark',
//     apikey,
//     config = {},
//     isDisabled = false
// }) => {
//     const [isConnected, setIsConnected] = useState(false);
//     const [isListening, setIsListening] = useState(false);
//     const [isSpeaking, setIsSpeaking] = useState(false);
//     const [isMuted, setIsMuted] = useState(false);
//     const [error, setError] = useState('');
//     const [status, setStatus] = useState('');

//     const peerConnectionRef = useRef(null);
//     const dataChannelRef = useRef(null);
//     const audioElementRef = useRef(null);
//     const mediaStreamRef = useRef(null);
//     const userContextRef = useRef(null);
//     const sessionConfigRef = useRef(null);

//     useEffect(() => {
//         if (isOpen && !isDisabled) {
//             initializeChat();
//         }

//         return cleanup;
//     }, [isOpen, isDisabled]);

//     useEffect(() => {
//         return () => {
//             if (mediaStreamRef.current) {
//                 mediaStreamRef.current.getTracks().forEach(track => track.stop());
//             }
//         };
//     }, []);

//     const toggleMute = () => {
//         if (mediaStreamRef.current) {
//             const audioTrack = mediaStreamRef.current.getAudioTracks()[0];
//             if (audioTrack) {
//                 audioTrack.enabled = !audioTrack.enabled;
//                 setIsMuted(!audioTrack.enabled);
//                 console.log(`Microphone ${audioTrack.enabled ? 'unmuted' : 'muted'}`);
//             }
//         }
//     };

//     const cleanup = () => {
//         if (mediaStreamRef.current) {
//             const tracks = mediaStreamRef.current.getTracks();
//             tracks.forEach(track => {
//                 console.log('Stopping track:', track.kind);
//                 track.stop();
//             });
//             mediaStreamRef.current = null;
//         }

//         if (audioElementRef.current && audioElementRef.current.srcObject) {
//             const tracks = audioElementRef.current.srcObject.getTracks();
//             tracks.forEach(track => track.stop());
//             audioElementRef.current.srcObject = null;
//         }

//         if (peerConnectionRef.current) {
//             peerConnectionRef.current.close();
//             peerConnectionRef.current = null;
//         }

//         if (dataChannelRef.current) {
//             dataChannelRef.current.close();
//             dataChannelRef.current = null;
//         }

//         setIsConnected(false);
//         setIsListening(false);
//         setIsSpeaking(false);
//         setIsMuted(false);
//         setStatus('');
//         setError('');
//     };

//     const initializeChat = async () => {
//         try {
//             setError('');
//             setStatus('Warming up my voice…');

//             // Create session with config
//             const sessionRes = await createVoiceChatSession(name, apikey, config);
//             const { clientSecret, userContext, config: finalConfig } = sessionRes;

//             userContextRef.current = userContext;
//             sessionConfigRef.current = finalConfig;

//             const pc = new RTCPeerConnection({
//                 iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
//             });
//             peerConnectionRef.current = pc;

//             const dc = pc.createDataChannel('oai-events');
//             dataChannelRef.current = dc;

//             pc.oniceconnectionstatechange = () => {
//                 console.log('ICE Connection State:', pc.iceConnectionState);
//             };

//             pc.onconnectionstatechange = () => {
//                 console.log('Connection State:', pc.connectionState);
//             };

//             dc.onopen = () => {
//                 console.log('Data channel opened');

//                 // Use configuration from sessionManager with the merged config
//                 const sessionUpdateConfig = {
//                     type: 'session.update',
//                     session: {
//                         modalities: finalConfig.modalities,
//                         instructions: userContext,
//                         input_audio_format: finalConfig.input_audio_format,
//                         output_audio_format: finalConfig.output_audio_format,
//                         input_audio_transcription: finalConfig.input_audio_transcription,
//                         turn_detection: finalConfig.turn_detection,
//                         voice: finalConfig.voice,
//                         temperature: finalConfig.temperature,
//                         max_response_output_tokens: finalConfig.max_response_output_tokens
//                     }
//                 };

//                 dc.send(JSON.stringify(sessionUpdateConfig));
//             };

//             dc.onmessage = handleDataChannelMessage;
//             dc.onerror = (error) => console.error('Data channel error:', error);
//             dc.onclose = () => console.log('Data channel closed');

//             const mediaStream = await navigator.mediaDevices.getUserMedia({
//                 audio: {
//                     echoCancellation: true,
//                     noiseSuppression: true,
//                     autoGainControl: true
//                 }
//             });
//             mediaStreamRef.current = mediaStream;

//             mediaStream.getTracks().forEach(track => {
//                 console.log('Adding track:', track);
//                 pc.addTransceiver(track, { direction: 'sendrecv' });
//             });

//             pc.ontrack = (event) => {
//                 console.log('Received track event:', event);
//                 const [track] = event.streams[0].getAudioTracks();
//                 const stream = new MediaStream([track]);

//                 if (audioElementRef.current) {
//                     audioElementRef.current.srcObject = stream;
//                     audioElementRef.current.volume = 1.0;

//                     audioElementRef.current.onplay = () => {
//                         console.log('Audio started playing');
//                         setIsSpeaking(true);
//                     };

//                     audioElementRef.current.onended = () => {
//                         console.log('Audio ended');
//                         setIsSpeaking(false);
//                     };

//                     audioElementRef.current.onpause = () => {
//                         console.log('Audio paused');
//                         setIsSpeaking(false);
//                     };

//                     audioElementRef.current.play()
//                         .then(() => {
//                             console.log('Audio playback started successfully');
//                             setStatus('Connected - Ready to chat');
//                             setIsListening(true);
//                         })
//                         .catch(err => {
//                             console.error('Audio playback error:', err);
//                             setError(`Audio playback failed: ${err.message}`);
//                         });
//                 }
//             };

//             const offer = await pc.createOffer();
//             await pc.setLocalDescription(offer);

//             setStatus('Connecting...');

//             // Use the model from config for the API endpoint
//             const model = finalConfig.model || 'gpt-4o-realtime-preview-2024-12-17';
//             const openAIRes = await fetch(`https://api.openai.com/v1/realtime?model=${model}`, {
//                 method: 'POST',
//                 body: offer.sdp,
//                 headers: {
//                     'Authorization': `Bearer ${clientSecret.value}`,
//                     'Content-Type': 'application/sdp'
//                 }
//             });

//             if (!openAIRes.ok) {
//                 const errorText = await openAIRes.text();
//                 throw new Error(`OpenAI API error: ${openAIRes.status} - ${errorText}`);
//             }

//             const answer = await openAIRes.text();
//             await pc.setRemoteDescription({ type: 'answer', sdp: answer });

//             setStatus('Connected - Ready to chat');
//             setIsConnected(true);
//             setIsListening(true);

//         } catch (err) {
//             console.error('Init error:', err);
//             setError(`Failed to initialize: ${err.message}`);
//             setStatus('');
//             cleanup();
//         }
//     };

//     const handleDataChannelMessage = (event) => {
//         try {
//             const msg = JSON.parse(event.data);
//             console.log('Received message:', {
//                 type: msg.type,
//                 hasData: msg.delta ? 'yes' : 'no',
//                 details: msg
//             });

//             switch (msg.type) {
//                 case 'session.created':
//                     console.log('Session created successfully');
//                     break;

//                 case 'session.updated':
//                     console.log('Session configuration updated');
//                     setStatus('Connected - Ready to chat');
//                     break;

//                 case 'input_audio_buffer.speech_started':
//                     console.log('Speech detected');
//                     setIsListening(true);
//                     setIsSpeaking(false);
//                     break;

//                 case 'input_audio_buffer.speech_stopped':
//                     console.log('Speech ended');
//                     setIsListening(false);
//                     break;

//                 case 'response.audio.delta':
//                     console.log('Receiving audio response chunk');
//                     setIsSpeaking(true);
//                     setIsListening(false);
//                     break;

//                 case 'response.audio.done':
//                     console.log('Audio response completed');
//                     setIsSpeaking(false);
//                     setIsListening(true);
//                     break;

//                 case 'response.done':
//                     console.log('Response completed');
//                     setIsSpeaking(false);
//                     setIsListening(true);
//                     break;

//                 case 'error':
//                     console.error('Error from server:', msg);
//                     setError(msg.error?.message || 'An error occurred');
//                     break;

//                 default:
//                     console.log('Unhandled message type:', msg.type);
//             }
//         } catch (err) {
//             console.error('Invalid message:', err);
//         }
//     };

//     const handleClose = () => {
//         cleanup();
//         onClose();
//     };

//     if (!isOpen || isDisabled) return null;

//     const renderUI = () => {
//         if (uiVersion === 'custom' && customUI) return customUI;
//         if (uiVersion === 'v2') return <AnimatedBlobv2 isListening={isListening && !isMuted} isSpeaking={isSpeaking} />;
//         if (uiVersion === 'v3') return <AnimatedBlobv3 isListening={isListening && !isMuted} isSpeaking={isSpeaking} />;
//         if (uiVersion === 'v4') return <AnimatedBlobv4 isListening={isListening && !isMuted} isSpeaking={isSpeaking} />
//         return <AnimatedBlobv1 isListening={isListening && !isMuted} isSpeaking={isSpeaking} />;
//     };

//     return ReactDOM.createPortal(
//         <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-md flex items-center justify-center">
//             {/* Modal */}
//             <div
//                 className="relative w-[600px] h-[500px] rounded-3xl shadow-2xl border border-gray-700 flex flex-col"
//                 style={{
//                     background: 'linear-gradient(to bottom right, #111827, #000000, #1f2937)'
//                 }}
//             >

//                 {/* Audio element */}
//                 <audio ref={audioElementRef} autoPlay className="hidden" />

//                 {/* Status Text */}
//                 <div className="flex justify-center pt-8 pb-4">
//                     {error ? (
//                         <div className="text-red-400 text-lg font-medium text-center px-4 py-2 bg-red-900/50 rounded-lg">
//                             {error}
//                         </div>
//                     ) : status ? (
//                         <div className="text-white text-lg font-medium text-center px-4 py-2 bg-gray-800/50 rounded-lg">
//                             {status}
//                         </div>
//                     ) : null}
//                 </div>

//                 {/* Animated Blob - CONTAINED */}
//                 <div className="flex-1 flex items-center justify-center px-8">
//                     <div className="w-[200px] h-[200px] flex items-center justify-center">
//                         {renderUI()}
//                     </div>
//                 </div>

//                 {/* Bottom Buttons */}
//                 <div className="flex justify-center items-center gap-6 pb-8 pt-4">
//                     {/* Mute Button */}
//                     <button
//                         onClick={toggleMute}
//                         className="w-14 h-14 bg-gray-600 hover:bg-red-500 rounded-full flex items-center justify-center text-white transition-all duration-200"
//                     >
//                         {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
//                     </button>

//                     {/* Close Button */}
//                     <button
//                         onClick={handleClose}
//                         className="w-14 h-14 bg-gray-600 hover:bg-red-500 rounded-full flex items-center justify-center text-white transition-all duration-200"
//                     >
//                         <X className="w-6 h-6" />
//                     </button>
//                 </div>

//                 {/* Mute Indicator */}
//                 {isMuted && (
//                     <div className="absolute left-6 top-1/2 transform -translate-y-1/2">
//                         <div className="bg-red-500 px-3 py-1 rounded-full text-white text-sm flex items-center gap-1">
//                             <MicOff className="w-3 h-3" />
//                             <span>MUTED</span>
//                         </div>
//                     </div>
//                 )}

//                 {/* Click outside to close */}
//                 <div
//                     className="fixed inset-0 -z-10"
//                     onClick={handleClose}
//                 />
//             </div>
//         </div>,
//         document.body
//     );
// };

// export default RealTimeVoiceChat;













import { useEffect, useRef, useState } from 'react';
import { X, Mic, MicOff } from 'lucide-react';
import AnimatedBlobv1 from './UI/AnimatedBlobv1';
import AnimatedBlobv2 from './UI/AnimatedBlobv2';
import AnimatedBlobv3 from './UI/AnimatedBlobv3';
import AnimatedBlobv4 from './UI/AnimatedBlobv4';
import AnimatedBlobv5 from './UI/AnimatedBlobv5';
import { createVoiceChatSession } from './sessionManager';
import ReactDOM from 'react-dom';

const RealTimeVoiceChat = ({
    isOpen,
    onClose,
    name,
    uiVersion = 'v1',
    customUI,
    theme = 'dark',
    apikey,
    config = {},
    isDisabled = false
}) => {
    const [isConnected, setIsConnected] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isUserSpeaking, setIsUserSpeaking] = useState(false); // New state for v5
    const [isBotSpeaking, setIsBotSpeaking] = useState(false); // New state for v5
    const [isMuted, setIsMuted] = useState(false);
    const [error, setError] = useState('');
    const [status, setStatus] = useState('');

    const peerConnectionRef = useRef(null);
    const dataChannelRef = useRef(null);
    const audioElementRef = useRef(null);
    const mediaStreamRef = useRef(null);
    const userContextRef = useRef(null);
    const sessionConfigRef = useRef(null);

    useEffect(() => {
        if (isOpen && !isDisabled) {
            initializeChat();
        }

        return cleanup;
    }, [isOpen, isDisabled]);

    useEffect(() => {
        return () => {
            if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const toggleMute = () => {
        if (mediaStreamRef.current) {
            const audioTrack = mediaStreamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsMuted(!audioTrack.enabled);
                console.log(`Microphone ${audioTrack.enabled ? 'unmuted' : 'muted'}`);
            }
        }
    };

    const cleanup = () => {
        if (mediaStreamRef.current) {
            const tracks = mediaStreamRef.current.getTracks();
            tracks.forEach(track => {
                console.log('Stopping track:', track.kind);
                track.stop();
            });
            mediaStreamRef.current = null;
        }

        if (audioElementRef.current && audioElementRef.current.srcObject) {
            const tracks = audioElementRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            audioElementRef.current.srcObject = null;
        }

        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }

        if (dataChannelRef.current) {
            dataChannelRef.current.close();
            dataChannelRef.current = null;
        }

        setIsConnected(false);
        setIsListening(false);
        setIsSpeaking(false);
        setIsUserSpeaking(false);
        setIsBotSpeaking(false);
        setIsMuted(false);
        setStatus('');
        setError('');
    };

    const initializeChat = async () => {
        try {
            setError('');
            setStatus('Initializing neural pathways...');

            // Validate API key
            if (!apikey || !apikey.trim()) {
                throw new Error('OpenAI API key is required');
            }

            // Create session with config
            const sessionRes = await createVoiceChatSession(name, apikey, config);
            const { clientSecret, userContext, config: finalConfig } = sessionRes;

            userContextRef.current = userContext;
            sessionConfigRef.current = finalConfig;

            const pc = new RTCPeerConnection({
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
            });
            peerConnectionRef.current = pc;

            const dc = pc.createDataChannel('oai-events');
            dataChannelRef.current = dc;

            pc.oniceconnectionstatechange = () => {
                console.log('ICE Connection State:', pc.iceConnectionState);
                if (pc.iceConnectionState === 'failed') {
                    setError('Network connection failed. Please check your internet connection.');
                }
            };

            pc.onconnectionstatechange = () => {
                console.log('Connection State:', pc.connectionState);
                if (pc.connectionState === 'failed') {
                    setError('Voice connection failed. Please try again.');
                }
            };

            dc.onopen = () => {
                console.log('Data channel opened');
                setStatus('Synchronizing voice protocols...');

                // Use configuration from sessionManager with the merged config
                const sessionUpdateConfig = {
                    type: 'session.update',
                    session: {
                        modalities: finalConfig.modalities,
                        instructions: userContext,
                        input_audio_format: finalConfig.input_audio_format,
                        output_audio_format: finalConfig.output_audio_format,
                        input_audio_transcription: finalConfig.input_audio_transcription,
                        turn_detection: finalConfig.turn_detection,
                        voice: finalConfig.voice,
                        temperature: finalConfig.temperature,
                        max_response_output_tokens: finalConfig.max_response_output_tokens
                    }
                };

                dc.send(JSON.stringify(sessionUpdateConfig));
            };

            dc.onmessage = handleDataChannelMessage;
            dc.onerror = (error) => {
                console.error('Data channel error:', error);
                setError('Communication channel error. Please restart the session.');
            };
            dc.onclose = () => console.log('Data channel closed');

            setStatus('Accessing microphone...');

            const mediaStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            }).catch(err => {
                if (err.name === 'NotAllowedError') {
                    throw new Error('Microphone access denied. Please allow microphone permissions and try again.');
                } else if (err.name === 'NotFoundError') {
                    throw new Error('No microphone found. Please connect a microphone and try again.');
                } else {
                    throw new Error(`Microphone error: ${err.message}`);
                }
            });

            mediaStreamRef.current = mediaStream;

            mediaStream.getTracks().forEach(track => {
                console.log('Adding track:', track);
                pc.addTransceiver(track, { direction: 'sendrecv' });
            });

            pc.ontrack = (event) => {
                console.log('Received track event:', event);
                const [track] = event.streams[0].getAudioTracks();
                const stream = new MediaStream([track]);

                if (audioElementRef.current) {
                    audioElementRef.current.srcObject = stream;
                    audioElementRef.current.volume = 1.0;

                    audioElementRef.current.onplay = () => {
                        console.log('Audio started playing');
                        setIsSpeaking(true);
                        setIsBotSpeaking(true);
                    };

                    audioElementRef.current.onended = () => {
                        console.log('Audio ended');
                        setIsSpeaking(false);
                        setIsBotSpeaking(false);
                    };

                    audioElementRef.current.onpause = () => {
                        console.log('Audio paused');
                        setIsSpeaking(false);
                        setIsBotSpeaking(false);
                    };

                    audioElementRef.current.play()
                        .then(() => {
                            console.log('Audio playback started successfully');
                            setStatus('Neural link established - Ready to chat!');
                            setIsListening(true);
                            setIsConnected(true);
                        })
                        .catch(err => {
                            console.error('Audio playback error:', err);
                            setError(`Audio setup failed: ${err.message}. Try refreshing the page.`);
                        });
                }
            };

            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            setStatus('Establishing neural link...');

            // Use the model from config for the API endpoint
            const model = finalConfig.model || 'gpt-4o-realtime-preview-2024-12-17';
            const openAIRes = await fetch(`https://api.openai.com/v1/realtime?model=${model}`, {
                method: 'POST',
                body: offer.sdp,
                headers: {
                    'Authorization': `Bearer ${clientSecret.value}`,
                    'Content-Type': 'application/sdp'
                }
            });

            if (!openAIRes.ok) {
                const errorText = await openAIRes.text();
                let errorMessage = `OpenAI API error (${openAIRes.status})`;

                if (openAIRes.status === 401) {
                    errorMessage = 'Invalid API key. Please check your OpenAI API key.';
                } else if (openAIRes.status === 429) {
                    errorMessage = 'Rate limit exceeded. Please try again in a moment.';
                } else if (openAIRes.status === 503) {
                    errorMessage = 'OpenAI service temporarily unavailable. Please try again later.';
                } else {
                    errorMessage += `: ${errorText}`;
                }

                throw new Error(errorMessage);
            }

            const answer = await openAIRes.text();
            await pc.setRemoteDescription({ type: 'answer', sdp: answer });

            setStatus('Neural link established - Ready to chat!');
            setIsConnected(true);
            setIsListening(true);

        } catch (err) {
            console.error('Init error:', err);
            setError(err.message || 'Failed to initialize voice chat');
            setStatus('');
            cleanup();
        }
    };

    const handleDataChannelMessage = (event) => {
        try {
            const msg = JSON.parse(event.data);
            console.log('Received message:', {
                type: msg.type,
                hasData: msg.delta ? 'yes' : 'no',
                details: msg
            });

            switch (msg.type) {
                case 'session.created':
                    console.log('Session created successfully');
                    break;

                case 'session.updated':
                    console.log('Session configuration updated');
                    setStatus('Neural link established - Ready to chat!');
                    break;

                case 'input_audio_buffer.speech_started':
                    console.log('Speech detected');
                    setIsListening(true);
                    setIsUserSpeaking(true); // User started speaking
                    setIsSpeaking(false);
                    setIsBotSpeaking(false);
                    break;

                case 'input_audio_buffer.speech_stopped':
                    console.log('Speech ended');
                    setIsListening(false);
                    setIsUserSpeaking(false); // User stopped speaking
                    break;

                case 'response.audio.delta':
                    console.log('Receiving audio response chunk');
                    setIsSpeaking(true);
                    setIsBotSpeaking(true); // Bot started speaking
                    setIsListening(false);
                    setIsUserSpeaking(false);
                    break;

                case 'response.audio.done':
                    console.log('Audio response completed');
                    setIsSpeaking(false);
                    setIsBotSpeaking(false); // Bot stopped speaking
                    setIsListening(true);
                    break;

                case 'response.done':
                    console.log('Response completed');
                    setIsSpeaking(false);
                    setIsBotSpeaking(false);
                    setIsListening(true);
                    break;

                case 'error':
                    console.error('Error from server:', msg);
                    const errorMsg = msg.error?.message || 'An unexpected error occurred';
                    setError(`Session error: ${errorMsg}`);
                    break;

                default:
                    console.log('Unhandled message type:', msg.type);
            }
        } catch (err) {
            console.error('Invalid message:', err);
            setError('Communication error: Invalid message received');
        }
    };

    const handleClose = () => {
        cleanup();
        onClose();
    };

    if (!isOpen || isDisabled) return null;

    const renderUI = () => {
        if (uiVersion === 'custom' && customUI) return customUI;
        if (uiVersion === 'v5') return (
            <AnimatedBlobv5
                isListening={isListening && !isMuted}
                isSpeaking={isSpeaking}
                isUserSpeaking={isUserSpeaking && !isMuted}
                isBotSpeaking={isBotSpeaking}
                isConnected={isConnected}
            />
        );
        if (uiVersion === 'v2') return <AnimatedBlobv2 isListening={isListening && !isMuted} isSpeaking={isSpeaking} />;
        if (uiVersion === 'v3') return <AnimatedBlobv3 isListening={isListening && !isMuted} isSpeaking={isSpeaking} />;
        if (uiVersion === 'v4') return <AnimatedBlobv4 isListening={isListening && !isMuted} isSpeaking={isSpeaking} />
        return <AnimatedBlobv1 isListening={isListening && !isMuted} isSpeaking={isSpeaking} />;
    };

    const isV5 = uiVersion === 'v5';

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-md flex items-center justify-center">
            {/* Modal */}
            <div
                className="relative w-[800px] h-[600px] rounded-3xl shadow-2xl border border-gray-700 flex flex-col"
                style={{background: 'linear-gradient(to bottom right, #0a0a0a, #1a1a1a, #0f0f0f)'}}
            >

                {/* Audio element */}
                <audio ref={audioElementRef} autoPlay className="hidden" />

                {/* Status Text */}
                <div className="flex justify-center pt-8 pb-4">
                    {error ? (
                        <div className="text-red-400 text-lg font-medium text-center px-6 py-3 bg-red-900/30 border border-red-600/50 rounded-xl backdrop-blur-sm max-w-md">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                                <span className="text-sm font-semibold text-red-300">Error</span>
                            </div>
                            <div className="text-sm text-red-200">{error}</div>
                        </div>
                    ) : status ? (
                        <div className="text-white text-lg font-medium text-center px-6 py-3 bg-gray-800/40 border border-gray-600/30 rounded-xl backdrop-blur-sm">
                            <div className="flex items-center gap-2 justify-center">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                <span>{status}</span>
                            </div>
                        </div>
                    ) : null}
                </div>

                {/* Animated UI - CONTAINED */}
                <div className="flex-1 flex items-center justify-center px-8">
                    <div className={isV5 ? "w-full h-full flex items-center justify-center" : "w-[200px] h-[200px] flex items-center justify-center"}>
                        {renderUI()}
                    </div>
                </div>

                {/* Bottom Buttons */}
                <div className="flex justify-center items-center gap-6 pb-8 pt-4">
                    {/* Mute Button */}
                    <button
                        onClick={toggleMute}
                        className="w-14 h-14 bg-gray-600/80 hover:bg-red-500 rounded-full flex items-center justify-center text-white transition-all duration-200 backdrop-blur-sm border border-gray-500/30"
                    >
                        {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                    </button>

                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className="w-14 h-14 bg-gray-600/80 hover:bg-red-500 rounded-full flex items-center justify-center text-white transition-all duration-200 backdrop-blur-sm border border-gray-500/30"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Mute Indicator */}
                {isMuted && (
                    <div className="absolute left-6 top-1/2 transform -translate-y-1/2">
                        <div className="bg-red-500/90 px-3 py-2 rounded-full text-white text-sm flex items-center gap-2 backdrop-blur-sm border border-red-400/50">
                            <MicOff className="w-4 h-4" />
                            <span className="font-medium">MUTED</span>
                        </div>
                    </div>
                )}

                {/* Click outside to close */}
                <div
                    className="fixed inset-0 -z-10"
                    onClick={handleClose}
                />
            </div>
        </div>,
        document.body
    );
};

export default RealTimeVoiceChat;