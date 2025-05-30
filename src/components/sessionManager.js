const createVoiceChatSession = async (name, apikey, config = {}) => {
    if (!apikey) {
        throw new Error('OpenAI API key not found.');
    }

    // Default configuration values with fallbacks
    const defaultConfig = {
        model: 'gpt-4o-realtime-preview-2024-12-17',
        modalities: ['audio', 'text'],
        instructions: 'You are a helpful assistant.',
        voice: 'alloy',
        input_audio_format: 'pcm16',
        output_audio_format: 'pcm16',
        input_audio_transcription: {
            model: 'whisper-1'
        },
        turn_detection: {
            type: 'server_vad',
            threshold: 0.4,
            prefix_padding_ms: 200,
            silence_duration_ms: 400,
            create_response: true
        },
        temperature: 0.8,
        max_response_output_tokens: 'inf'
    };

    // Merge provided config with defaults
    const finalConfig = {
        ...defaultConfig,
        ...config,
        // Deep merge for nested objects
        input_audio_transcription: {
            ...defaultConfig.input_audio_transcription,
            ...(config.input_audio_transcription || {})
        },
        turn_detection: {
            ...defaultConfig.turn_detection,
            ...(config.turn_detection || {})
        }
    };

    // Prepare instructions with name if provided
    const instructions = name
        ? `Name: ${name}\n${finalConfig.instructions}`
        : finalConfig.instructions;

    const requestBody = {
        model: finalConfig.model,
        modalities: finalConfig.modalities,
        instructions,
        voice: finalConfig.voice,
        input_audio_format: finalConfig.input_audio_format,
        output_audio_format: finalConfig.output_audio_format,
        input_audio_transcription: finalConfig.input_audio_transcription,
        turn_detection: finalConfig.turn_detection,
        temperature: finalConfig.temperature,
        max_response_output_tokens: finalConfig.max_response_output_tokens
    };

    const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apikey}`,
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'realtime-1.0'
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI session creation failed: ${response.status} - ${errorText}`);
    }

    const sessionData = await response.json();

    return {
        clientSecret: {
            value: sessionData.client_secret?.value || sessionData.client_secret
        },
        userContext: instructions,
        sessionId: sessionData.id,
        expires_at: sessionData.expires_at,
        config: finalConfig // Return the merged config for use in the component
    };
};

export { createVoiceChatSession };