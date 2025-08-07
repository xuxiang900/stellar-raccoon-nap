import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Pause, Play, Loader2, User, User2, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const EN_VOICES = [
  { id: "en1", name: "Oliver", gender: "Male" },
  { id: "en2", name: "Sophia", gender: "Female" },
  { id: "en3", name: "Liam", gender: "Male" },
  { id: "en4", name: "Emma", gender: "Female" },
  { id: "en5", name: "Noah", gender: "Male" },
  { id: "en6", name: "Ava", gender: "Female" },
  { id: "en7", name: "Elijah", gender: "Male" },
  { id: "en8", name: "Mia", gender: "Female" },
  { id: "en9", name: "James", gender: "Male" },
  { id: "en10", name: "Charlotte", gender: "Female" },
  { id: "en11", name: "Benjamin", gender: "Male" },
  { id: "en12", name: "Amelia", gender: "Female" },
  { id: "en13", name: "Lucas", gender: "Male" },
  { id: "en14", name: "Harper", gender: "Female" },
  { id: "en15", name: "Henry", gender: "Male" },
];
const JP_VOICES = [
  { id: "jp1", name: "Sora", gender: "Male" },
  { id: "jp2", name: "Yui", gender: "Female" },
  { id: "jp3", name: "Haruto", gender: "Male" },
  { id: "jp4", name: "Hina", gender: "Female" },
  { id: "jp5", name: "Yuto", gender: "Male" },
  { id: "jp6", name: "Rin", gender: "Female" },
  { id: "jp7", name: "Kaito", gender: "Male" },
  { id: "jp8", name: "Saki", gender: "Female" },
  { id: "jp9", name: "Ren", gender: "Male" },
  { id: "jp10", name: "Mio", gender: "Female" },
  { id: "jp11", name: "Daiki", gender: "Male" },
  { id: "jp12", name: "Yuna", gender: "Female" },
  { id: "jp13", name: "Takumi", gender: "Male" },
  { id: "jp14", name: "Aoi", gender: "Female" },
  { id: "jp15", name: "Kota", gender: "Male" },
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
  const [voice, setVoice] = useState("en1");
  const [expressive, setExpressive] = useState("medium");
  const [startSilence, setStartSilence] = useState([0]);
  const [sentenceSilence, setSentenceSilence] = useState([0]);
  const [paragraphSilence, setParagraphSilence] = useState([0]);
  const [speed, setSpeed] = useState([1]);
  const [loudness, setLoudness] = useState("moderate");
  const [loading, setLoading] = useState(false);
  const [canPlay, setCanPlay] = useState(false);
  const [voiceDialogOpen, setVoiceDialogOpen] = useState(false);

  const voices = useMemo(() => (lang === "en" ? EN_VOICES : JP_VOICES), [lang]);
  const selectedVoice = voices.find(v => v.id === voice);

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
          {/* 声音选择（弹窗卡片） */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">声音</label>
            <Button
              variant="outline"
              className="w-full flex justify-between items-center"
              onClick={() => setVoiceDialogOpen(true)}
            >
              <div className="flex items-center">
                {selectedVoice?.gender === "Male" ? (
                  <User className="w-5 h-5 mr-2 text-blue-500" />
                ) : (
                  <User2 className="w-5 h-5 mr-2 text-pink-500" />
                )}
                <span>{selectedVoice?.name}</span>
                <span className="ml-2 text-xs text-gray-400">{selectedVoice?.gender === "Male" ? "男" : "女"}</span>
              </div>
              <span className="text-xs text-gray-400">点击选择</span>
            </Button>
            <Dialog open={voiceDialogOpen} onOpenChange={setVoiceDialogOpen}>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>选择声音</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                  {voices.map(v => (
                    <button
                      key={v.id}
                      className={cn(
                        "group relative rounded-xl border p-4 flex flex-col items-center transition focus:outline-none",
                        voice === v.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                      )}
                      onClick={() => {
                        setVoice(v.id);
                        setVoiceDialogOpen(false);
                      }}
                      type="button"
                    >
                      <div className="mb-2">
                        {v.gender === "Male" ? (
                          <User className="w-8 h-8 text-blue-500" />
                        ) : (
                          <User2 className="w-8 h-8 text-pink-500" />
                        )}
                      </div>
                      <div className="font-semibold">{v.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{v.gender === "Male" ? "男" : "女"}</div>
                      {voice === v.id && (
                        <span className="absolute top-2 right-2 text-blue-500">
                          <Check className="w-5 h-5" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                <DialogClose asChild>
                  <Button className="mt-6 w-full" variant="secondary">
                    关闭
                  </Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
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