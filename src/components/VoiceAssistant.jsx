import React, { useState, useRef } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import axios from 'axios';

const VoiceAssistant = ({ config = {} }) => {
    const {
        apiKey,
        endpoint = 'https://vgynj1k6fi.execute-api.us-east-1.amazonaws.com/voice-process',
        onTranscriptionComplete,
        isDisabled = false
    } = config;

    const [isRecording, setIsRecording] = useState(false);
    const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
    const [error, setError] = useState(null);

    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);

    const playBase64Audio = (base64Audio) => {
        try {
            const binaryString = atob(base64Audio);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            const audioBlob = new Blob([bytes], { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.onplay = () => setIsWaitingForResponse(false);
            audio.play().catch(() => setIsWaitingForResponse(false));
        } catch (e) {
            setIsWaitingForResponse(false);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            chunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) chunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = async () => {
                setIsWaitingForResponse(true);
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });

                const reader = new FileReader();
                reader.readAsDataURL(audioBlob);
                reader.onloadend = async () => {
                    const base64Audio = reader.result.split(',')[1];

                    try {
                        const response = await axios.post(
                            endpoint,
                            { audio: base64Audio },
                            {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'x-api-key': apiKey
                                }
                            }
                        );

                        if (response.data?.transcription && onTranscriptionComplete) {
                            onTranscriptionComplete(response.data.transcription);
                        }

                        if (response.data?.audio) {
                            playBase64Audio(response.data.audio);
                        } else {
                            setIsWaitingForResponse(false);
                        }
                    } catch {
                        setError('Request failed.');
                        setIsWaitingForResponse(false);
                    }
                };

                stream.getTracks().forEach((track) => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setError(null);
        } catch (err) {
            setError('Mic access error.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleClick = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    return (
        <div className="relative">
            <button
                onClick={handleClick}
                disabled={isDisabled || isWaitingForResponse}
                className={`
          p-2 rounded-full text-white transition
          ${isDisabled || isWaitingForResponse
                        ? 'bg-gray-400 cursor-not-allowed'
                        : isRecording
                            ? 'bg-red-500 animate-pulse hover:bg-red-600'
                            : 'bg-blue-500 hover:bg-blue-600'
                    }
        `}
                style={{
                    boxShadow: isRecording
                        ? '0 0 15px rgba(239, 68, 68, 0.5)'
                        : '0 0 10px rgba(59, 130, 246, 0.3)'
                }}
            >
                {isWaitingForResponse ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : isRecording ? (
                    <Square className="h-5 w-5" />
                ) : (
                    <Mic className="h-5 w-5" />
                )}
            </button>

            {error && <div className="text-sm text-red-500 mt-2">{error}</div>}
        </div>
    );
};

export default VoiceAssistant;
