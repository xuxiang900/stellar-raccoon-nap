import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { VoiceSelectModal, Voice } from "@/components/VoiceSelectModal";

// ... 其他 import 和页面逻辑

export default function TextToAudioPage() {
  // 假设你已有这些 state/变量
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>("");
  const [currentLanguage, setCurrentLanguage] = useState<string>("English");
  // 语种列表，和参数设置区保持一致
  const languageOptions = ["English", "Japanese"];
  // voices 数据
  const voices: Voice[] = [
    // ...你的声音数据
  ];

  // 语种变更回调
  const handleLanguageChange = (lang: string) => {
    setCurrentLanguage(lang);
    // 你可以在这里同步其他逻辑
  };

  return (
    <div>
      {/* ...其他页面内容 */}
      <Button onClick={() => setVoiceModalOpen(true)}>选择声音</Button>
      <VoiceSelectModal
        open={voiceModalOpen}
        onOpenChange={setVoiceModalOpen}
        voices={voices}
        value={selectedVoiceId}
        onChange={setSelectedVoiceId}
        languageOptions={languageOptions}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
      />
    </div>
  );
}