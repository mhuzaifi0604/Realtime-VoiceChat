declare module 'realtime-voicechat' {
  import React from 'react';

  interface VoiceChatTriggerProps {
    sessionEndpoint?: string;
    name?: string;
    voice?: string;
    botType?: string;
    uiVersion?: string;
    customUI?: boolean;
    [key: string]: any; // for extra props
  }

  export const VoiceChatTrigger: React.FC<VoiceChatTriggerProps>;
  // export other components similarly if needed
}
