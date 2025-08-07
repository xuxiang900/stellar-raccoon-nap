import React, { useState } from "react";
import { VoiceSelectModal } from "@/components/VoiceSelectModal";
import { Button } from "@/components/ui/button"; // 修复 Button 未导入
// ... 其他 import

export default function TextToAudioPage() {
  // ... 你的其他状态和逻辑

  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("English");

  // 你的语音列表
  const voices = [
    // ...你的 voice 数据
  ];

  // 你的语种列表（参数设置区的语种列表，和右侧参数设置区保持一致）
  const languageOptions = ["English", "Japanese"];

  // VoiceSelectModal 的 onChange 需要同步语音和语种
  const handleVoiceModalChange = (id: string, language: string) => {
    setSelectedVoiceId(id);
    setSelectedLanguage(language);
  };

  return (
    <div>
      {/* ... 其他内容 */}
      <Button onClick={() => setVoiceModalOpen(true)}>选择声音</Button>
      <VoiceSelectModal
        open={voiceModalOpen}
        onOpenChange={setVoiceModalOpen}
        voices={voices}
        value={selectedVoiceId}
        onChange={handleVoiceModalChange}
        languageOptions={languageOptions}
        selectedLanguage={selectedLanguage}
      />
      {/* ... 其他内容 */}
    </div>
  );
}