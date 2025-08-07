import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Play, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { VoiceSelectModal } from "@/components/VoiceSelectModal";

const EN_VOICES = [
  {
    id: "amelia",
    name: "Amelia",
    gender: "Female" as const,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    age: "Young Adult",
    language: "English",
    tags: ["Speech", "News", "Energetic"],
  },
  {
    id: "benjamin",
    name: "Benjamin",
    gender: "Male" as const,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    age: "Middle-Aged",
    language: "English",
    tags: ["Speech", "News", "British Accent"],
  },
  {
    id: "charlotte",
    name: "Charlotte",
    gender: "Female" as const,
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    age: "Adult",
    language: "English",
    tags: ["Audiobook", "Professional", "Calm"],
  },
  {
    id: "chloe",
    name: "Chloe",
    gender: "Female" as const,
    avatar: "https://randomuser.me/api/portraits/women/66.jpg",
    age: "Adult",
    language: "English",
    tags: ["Audiobook", "Narration", "Energetic"],
  },
  {
    id: "clara",
    name: "Clara",
    gender: "Female" as const,
    avatar: "https://randomuser.me/api/portraits/women/67.jpg",
    age: "Adult",
    language: "English",
    tags: ["Professional", "Calm", "British Accent"],
  },
  {
    id: "daniel",
    name: "Daniel",
    gender: "Male" as const,
    avatar: "https://randomuser.me/api/portraits/men/33.jpg",
    age: "Young Adult",
    language: "English",
    tags: ["Speech", "Education", "Professional"],
  },
];

const JP_VOICES = [
  {
    id: "sakura",
    name: "Sakura",
    gender: "Female" as const,
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    age: "Adult",
    language: "Japanese",
    tags: ["Audiobook", "Calm"],
  },
  {
    id: "takashi",
    name: "Takashi",
    gender: "Male" as const,
    avatar: "https://randomuser.me/api/portraits/men/34.jpg",
    age: "Middle-Aged",
    language: "Japanese",
    tags: ["Speech", "News"],
  },
  {
    id: "yui",
    name: "Yui",
    gender: "Female" as const,
    avatar: "https://randomuser.me/api/portraits/women/69.jpg",
    age: "Young Adult",
    language: "Japanese",
    tags: ["Narration", "Energetic"],
  },
  {
    id: "hiroshi",
    name: "Hiroshi",
    gender: "Male" as const,
    avatar: "https://randomuser.me/api/portraits/men/35.jpg",
    age: "Adult",
    language: "Japanese",
    tags: ["Professional", "Calm"],
  },
];

const loudnessOptions = [
  { value: "loud", label: "Loud" },
  { value: "moderate", label: "Moderate" },
  { value: "soft", label: "Soft" },
  { value: "quiet", label: "Quiet" },
];

export default function TextToAudioPage() {
  const [text, setText] = useState("");
  const [lang, setLang] = useState<"en" | "jp">("en");
  const [voice, setVoice] = useState("amelia");
  const [expressive, setExpressive] = useState("medium");
  const [startSilence, setStartSilence] = useState([0]);
  const [sentenceSilence, setSentenceSilence] = useState([0]);
  const [paragraphSilence, setParagraphSilence] = useState([0]);
  const [speed, setSpeed] = useState([1]);
  const [loudness, setLoudness] = useState("moderate");
  const [loading, setLoading] = useState(false);
  const [canPlay, setCanPlay] = useState(false);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);

  const voices = useMemo(() => (lang === "en" ? EN_VOICES : JP_VOICES), [lang]);
  const selectedVoice = voices.find(v => v.id === voice) || voices[0];

  const charCount = text.length;

  const handleClear = () => setText("");

  const handleConvert = () => {
    setLoading(true);
    setCanPlay(false);
    setTimeout(() => {
      setLoading(false);
      setCanPlay(true);
    }, 1500);
  };

  return (
    <div className="flex flex-1 h-full relative">
      {/* 左侧输入内容区 */}
      <div className="flex flex-col w-2/3 pr-6">
        <label className="font-semibold mb-2">输入文本</label>
        <textarea
          className="flex-1 resize-none rounded-lg border border-gray-300 bg-white p-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="请输入要转换为语音的文本..."
          value={text}
          onChange={e => setText(e.target.value)}
          rows={12}
        />
        <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
          <span>字符数：{charCount}</span>
          <Button variant="outline" size="sm" onClick={handleClear} disabled={!text}>
            清空
          </Button>
        </div>
      </div>
      {/* 右侧参数配置区 */}
      <div className="flex flex-col w-1/3 min-w-64 bg-white rounded-xl shadow p-6 relative h-full">
        {/* 内容区可滚动，底部按钮不遮挡 */}
        <div className="flex-1 overflow-auto pb-24">
          {/* 语种选择 */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">语种</label>
            <Select value={lang} onValueChange={v => setLang(v as "en" | "jp")}>
              <SelectTrigger>
                <SelectValue placeholder="选择语种" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">英语</SelectItem>
                <SelectItem value="jp">日语</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* 声音选择 */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">声音</label>
            <Button
              variant="outline"
              className="w-full flex items-center justify-start gap-3"
              onClick={() => setVoiceModalOpen(true)}
            >
              <img
                src={selectedVoice.avatar}
                alt={selectedVoice.name}
                className="w-8 h-8 rounded-full object-cover border"
                onError={e => ((e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(selectedVoice.name))}
              />
              <span className="font-medium">{selectedVoice.name}</span>
              {selectedVoice.gender === "Male" ? (
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <circle cx="13" cy="13" r="5" />
                  <path d="M19 5v4m0-4h-4m4 0l-7 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <circle cx="12" cy="8" r="5" />
                  <path d="M12 13v6m-3 0h6" />
                </svg>
              )}
              <span className="ml-2 text-xs text-gray-500">{selectedVoice.language} • {selectedVoice.age}</span>
            </Button>
            <VoiceSelectModal
              open={voiceModalOpen}
              onOpenChange={setVoiceModalOpen}
              voices={voices}
              value={voice}
              onChange={id => setVoice(id)}
            />
          </div>
          {/* 表现力 */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">表现力 Expressive</label>
            <div className="flex space-x-2">
              {["high", "medium", "low"].map(level => (
                <Button
                  key={level}
                  variant={expressive === level ? "default" : "outline"}
                  size="sm"
                  onClick={() => setExpressive(level)}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Button>
              ))}
            </div>
          </div>
          {/* Silence */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">Slience 静音 (ms)</label>
            <div className="mb-2">
              <span className="text-xs text-gray-500">Start Silence</span>
              <Slider
                min={0}
                max={2000}
                step={10}
                value={startSilence}
                onValueChange={setStartSilence}
              />
              <span className="text-xs text-gray-400 ml-2">{startSilence[0]}ms</span>
            </div>
            <div className="mb-2">
              <span className="text-xs text-gray-500">Sentence Silence</span>
              <Slider
                min={0}
                max={2000}
                step={10}
                value={sentenceSilence}
                onValueChange={setSentenceSilence}
              />
              <span className="text-xs text-gray-400 ml-2">{sentenceSilence[0]}ms</span>
            </div>
            <div>
              <span className="text-xs text-gray-500">Paragraph Silence</span>
              <Slider
                min={0}
                max={2000}
                step={10}
                value={paragraphSilence}
                onValueChange={setParagraphSilence}
              />
              <span className="text-xs text-gray-400 ml-2">{paragraphSilence[0]}ms</span>
            </div>
          </div>
          {/* Prosody */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">Prosody 韵律</label>
            <div className="mb-2">
              <span className="text-xs text-gray-500">Speed</span>
              <Slider
                min={0.5}
                max={2.5}
                step={0.05}
                value={speed}
                onValueChange={setSpeed}
              />
              <span className="text-xs text-gray-400 ml-2">{speed[0].toFixed(2)}x</span>
            </div>
            <div>
              <span className="text-xs text-gray-500">Loudness</span>
              <Select value={loudness} onValueChange={setLoudness}>
                <SelectTrigger>
                  <SelectValue placeholder="选择响度" />
                </SelectTrigger>
                <SelectContent>
                  {loudnessOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        {/* 右侧底部操作栏 */}
        <div className="absolute left-0 right-0 bottom-0 flex justify-end items-center bg-white border-t px-8 py-4 space-x-4 rounded-b-xl">
          <Button
            onClick={handleConvert}
            disabled={loading || !text}
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Start Convert
          </Button>
          <Button
            variant="outline"
            disabled={!canPlay}
          >
            <Play className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}