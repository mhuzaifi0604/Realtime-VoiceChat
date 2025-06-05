import { useState } from "react";
import { AudioLines } from "lucide-react";
import RealTimeVoiceChat from "./RealTimeVoiceChat";
import VoiceAssistant from "./VoiceAssistant"; // assuming this is the other component

export const VoiceChatTrigger = ({
    botType, // 'rvc' or 'va'
    ...props // all other props like apiKey, onTranscriptionComplete, etc.
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpen = () => setIsModalOpen(true);
    const handleClose = () => setIsModalOpen(false);

    const renderVoiceComponent = () => {
        if (botType === "rvc") {
            return (
                <RealTimeVoiceChat
                    isOpen={isModalOpen}
                    onClose={handleClose}
                    {...props}
                />
            );
        } else if (botType === "va") {
            return (
                <VoiceAssistant
                    isOpen={isModalOpen}
                    onClose={handleClose}
                    {...props}
                />
            );
        } else {
            console.warn("Invalid botType provided:", botType);
            return null;
        }
    };

    return (
        <>
            {botType === 'rvc' && <button
                onClick={handleOpen}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200 w-max"
            >
                <AudioLines className="w-5 h-5 text-gray-600" />
            </button>}

            {renderVoiceComponent()}

            {/* Animation keyframes */}
            <style jsx global>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(30px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
        </>
    );
};

export default VoiceChatTrigger;
