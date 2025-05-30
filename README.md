# 🎙️ React Voice Chat Assistant

[![npm version](https://badge.fury.io/js/realtime-voicechat.svg)](https://badge.fury.io/js/realtime-voicechat)
[![Downloads](https://img.shields.io/npm/dm/realtime-voicechat.svg)](https://npmjs.org/package/realtime-voicechat)

A powerful, fully configurable React component that provides instant voice chat functionality powered by OpenAI's Realtime API. Instead of building voice chat from scratch, simply import and configure this component to add natural, human-like voice conversations to your application.

## 🚀 Why Choose This Package?

- **🎯 Instant Integration**: Add voice chat to your app in minutes, not days
- **🔧 Fully Configurable**: Customize every aspect of the voice chat experience
- **🎭 Natural Conversations**: Built-in emotional expressions and human-like speech patterns
- **🎨 Multiple UI Variants**: Choose from 4 pre-built UI designs or create your own
- **⚡ Real-time Communication**: Powered by OpenAI's latest Realtime API
- **🛡️ Production Ready**: Comprehensive error handling and fallback mechanisms

## 📦 Installation

```bash
npm install realtime-voicechat
```

```bash
yarn add realtime-voicechat
```

## 🎬 Quick Start

```jsx
import React from 'react';
import { VoiceChatTrigger } from 'your-package-name';

function App() {
  const config = {
    instructions: "You are a helpful assistant that speaks naturally with emotions.",
    voice: 'verse',
    temperature: 0.8
  };

  return (
    <VoiceChatTrigger
      name="John"
      botType="rvc"
      uiVersion="v2"
      apikey="your-openai-api-key"
      config={config}
    />
  );
}
```

## 📚 Complete API Reference

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `name` | `string` | No | `undefined` | User's name for personalized greetings and responses |
| `botType` | `string` | Yes | - | Type of voice chat: `'rvc'` (RealTimeVoiceChat) or `'va'` (VoiceAssistant) |
| `uiVersion` | `string` | No | `'v1'` | UI variant: `'v1'`, `'v2'`, `'v3'`, `'v4'`, or `'custom'` |
| `customUI` | `object` | No | `undefined` | Custom UI configuration when `uiVersion='custom'` |
| `apikey` | `string` | Yes | - | Your OpenAI API key |
| `isDisabled` | `boolean` | No | `false` | Whether the voice chat is disabled |
| `config` | `object` | No | `{}` | Session configuration object (see below) |

### Configuration Object (`config`)

#### Model & Basic Settings

| Property | Type | Default | Allowed Values | Description |
|----------|------|---------|----------------|-------------|
| `model` | `string` | `'gpt-4o-realtime-preview-2024-12-17'` | `'gpt-4o-realtime-preview-2024-12-17'` | OpenAI Realtime model |
| `modalities` | `array` | `['audio', 'text']` | `['audio']`, `['text']`, `['audio', 'text']` | Supported interaction modes |
| `instructions` | `string` | Natural conversation prompt | Any string | AI personality and behavior instructions |

#### Voice & Response Settings

| Property | Type | Default | Allowed Values | Description |
|----------|------|---------|----------------|-------------|
| `voice` | `string` | `'alloy'` | `'alloy'`, `'ash'`, `'ballad'`, `'coral'`, `'echo'`, `'sage'`, `'shimmer'`, `'verse'` | Voice personality |
| `temperature` | `number` | `0.8` | `0.6` - `1.2` | Response creativity and randomness |
| `max_response_output_tokens` | `string\|number` | `'inf'` | `'inf'` or `1` - `4096` | Maximum response length |

#### Audio Configuration

| Property | Type | Default | Allowed Values | Description |
|----------|------|---------|----------------|-------------|
| `input_audio_format` | `string` | `'pcm16'` | `'pcm16'`, `'g711_ulaw'`, `'g711_alaw'` | Input audio format |
| `output_audio_format` | `string` | `'pcm16'` | `'pcm16'`, `'g711_ulaw'`, `'g711_alaw'` | Output audio format |
| `input_audio_transcription` | `object` | `{ model: 'whisper-1' }` | `{ model: 'whisper-1' }` | Transcription settings |

#### Turn Detection Settings

| Property | Type | Default | Range/Values | Description |
|----------|------|---------|--------------|-------------|
| `turn_detection.type` | `string` | `'server_vad'` | `'server_vad'`, `'none'` | Voice activity detection type |
| `turn_detection.threshold` | `number` | `0.5` | `0.0` - `1.0` | Voice detection sensitivity |
| `turn_detection.prefix_padding_ms` | `number` | `200` | `0` - `5000` | Audio padding before speech (ms) |
| `turn_detection.silence_duration_ms` | `number` | `400` | `0` - `20000` | Silence duration to trigger response (ms) |
| `turn_detection.create_response` | `boolean` | `true` | `true`, `false` | Auto-generate responses |

## 🎨 UI Versions

Choose from multiple pre-built UI designs:

### v1 - Classic Animated Blob
Classic animated blob with pulse effects
![UI Version 1](https://raw.githubusercontent.com/mhuzaifi0604/Realtime-VoiceChat/main/uiVersions/V1.png)

### v2 - Modern Gradient Blob  
Modern gradient blob with smooth animations
![UI Version 2](https://raw.githubusercontent.com/mhuzaifi0604/Realtime-VoiceChat/main/uiVersions/V2.png)

### v3 - Geometric Animated Shapes
Geometric animated shapes with color transitions
![UI Version 3](https://raw.githubusercontent.com/mhuzaifi0604/Realtime-VoiceChat/main/uiVersions/V3.png)

### v4 - Advanced Particle System
Advanced particle system with dynamic effects
![UI Version 4](https://raw.githubusercontent.com/mhuzaifi0604/Realtime-VoiceChat/main/uiVersions/V4.png)

### v5 - Advanced Wave Particle System
Advanced particle system with dynamic effects
![UI Version 5](https://raw.githubusercontent.com/mhuzaifi0604/Realtime-VoiceChat/main/uiVersions/V5.png)

###### This one is the best in my opionion 😁

### custom - Your Own Design
Use your own UI component by passing it to the `customUI` prop

## 🎵 Voice Personalities

| Voice | Characteristics | Best For |
|-------|----------------|----------|
| `alloy` | Neutral, balanced | General purpose, professional |
| `ash` | Smooth, sophisticated | Business presentations, formal conversations |
| `ballad` | Melodic, expressive | Storytelling, creative content |
| `coral` | Warm, friendly | Customer service, casual conversations |
| `echo` | Clear, crisp | Technical support, education |
| `sage` | Wise, calm | Healthcare, therapy, guidance |
| `shimmer` | Soft, gentle | Children's content, soothing interactions |
| `verse` | Rhythmic, engaging | Entertainment, dynamic conversations |

## 📖 Usage Examples

### Basic Configuration

```jsx
import { VoiceChatTrigger } from 'realtime-voicechat';

const BasicExample = () => {
  const basicConfig = {
    instructions: "You are a helpful customer service representative.",
    voice: "coral",
    temperature: 0.7
  };

  return (
    <VoiceChatTrigger
      name="Sarah"
      botType="rvc"
      uiVersion="v2"
      apikey={process.env.REACT_APP_OPENAI_API_KEY}
      config={basicConfig}
    />
  );
};
```

### Advanced Configuration

```jsx
const AdvancedExample = () => {
  const advancedConfig = {
    model: 'gpt-4o-realtime-preview-2024-12-17',
    modalities: ['audio', 'text'],
    instructions: `You are an enthusiastic fitness coach. Use natural expressions like "Oh wow!", "That's amazing!", and "Let's go!" to motivate users. Be encouraging and energetic.`,
    voice: 'nova',
    temperature: 0.9,
    max_response_output_tokens: 2048,
    turn_detection: {
      type: 'server_vad',
      threshold: 0.6,
      prefix_padding_ms: 300,
      silence_duration_ms: 500,
      create_response: true
    }
  };

  return (
    <VoiceChatTrigger
      name="Alex"
      botType="rvc"
      uiVersion="v4"
      apikey={process.env.REACT_APP_OPENAI_API_KEY}
      config={advancedConfig}
    />
  );
};
```

## 🔧 Environment Variables

For security, store your API key in environment variables:

```bash
# .env
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
```

```jsx
// Use in your component
apikey={import.meta.env.REACT_APP_OPENAI_API_KEY}
```

## 🎯 Turn Detection Tuning Guide

Fine-tune when the AI responds by adjusting these parameters:

### Sensitivity Settings
- **High Sensitivity** (threshold: 0.2-0.4): Responds to quieter speech, may pick up background noise
- **Medium Sensitivity** (threshold: 0.4-0.6): Balanced detection, good for most environments
- **Low Sensitivity** (threshold: 0.6-0.8): Requires clearer speech, filters out background noise

### Response Timing
- **Fast Response** (silence_duration_ms: 200-400): Quick interactions, may interrupt user
- **Normal Response** (silence_duration_ms: 400-600): Standard conversation timing
- **Thoughtful Response** (silence_duration_ms: 600-1000): Allows for pauses, better for complex topics

## 🚨 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| No audio playback | Check browser microphone permissions |
| Voice cuts out | Adjust `threshold` value (try 0.6-0.7) |
| AI interrupts user | Increase `silence_duration_ms` (try 600-800) |
| Delayed responses | Decrease `silence_duration_ms` (try 300-400) |
| Connection fails | Verify OpenAI API key and internet connection |

### Browser Compatibility

- ✅ Chrome 88+
- ✅ Firefox 84+
- ✅ Safari 14.1+
- ✅ Edge 88+

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you encounter any issues or have questions:

- 🐛 **Open an issue** on our [GitHub repository](https://github.com/your-username/realtime-voicechat/issues)
- 📧 **Contact directly**: [huzzaifaasim@gmail.com](mailto:huzzaifaasim@gmail.com)

---

Made with ❤️ for developers who want to add natural voice conversations to their applications.