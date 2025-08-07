import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState, useMemo, useEffect } from "react";
import { Check, X, Play } from "lucide-react";

export interface Voice {
  id: string;
  name: string;
  gender: "Male" | "Female";
  avatar: string;
  age: string;
  language: string;
  tags: string[];
}

interface VoiceSelectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  voices: Voice[];
  value: string;
  onChange: (id: string) => void;
}

const genderIcon = (gender: "Male" | "Female") =>
  gender === "Male" ? (
    <svg className="inline w-4 h-4 text-blue-500 ml-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <circle cx="13" cy="13" r="5" />
      <path d="M19 5v4m0-4h-4m4 0l-7 7" />
    </svg>
  ) : (
    <svg className="inline w-4 h-4 text-pink-500 ml-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="5" />
      <path d="M12 13v6m-3 0h6" />
    </svg>
  );

// 增加更多日语声音
const EXTRA_JP_VOICES: Voice[] = [
  {
    id: "haruka",
    name: "Haruka",
    gender: "Female",
    avatar: "https://randomuser.me/api/portraits/women/70.jpg",
    age: "Young Adult",
    language: "Japanese",
    tags: ["Anime", "Energetic", "Cute"],
  },
  {
    id: "kenta",
    name: "Kenta",
    gender: "Male",
    avatar: "https://randomuser.me/api/portraits/men/36.jpg",
    age: "Teenager",
    language: "Japanese",
    tags: ["Anime", "Youthful", "Bright"],
  },
  {
    id: "miyu",
    name: "Miyu",
    gender: "Female",
    avatar: "https://randomuser.me/api/portraits/women/71.jpg",
    age: "Child",
    language: "Japanese",
    tags: ["Child", "Cute", "Narration"],
  },
  {
    id: "ryota",
    name: "Ryota",
    gender: "Male",
    avatar: "https://randomuser.me/api/portraits/men/37.jpg",
    age: "Adult",
    language: "Japanese",
    tags: ["Professional", "Calm", "Audiobook"],
  },
  {
    id: "yoshiko",
    name: "Yoshiko",
    gender: "Female",
    avatar: "https://randomuser.me/api/portraits/women/72.jpg",
    age: "Senior",
    language: "Japanese",
    tags: ["Senior", "Warm", "Storytelling"],
  },
  {
    id: "taro",
    name: "Taro",
    gender: "Male",
    avatar: "https://randomuser.me/api/portraits/men/38.jpg",
    age: "Middle-Aged",
    language: "Japanese",
    tags: ["News", "Speech", "Deep"],
  },
  {
    id: "ayumi",
    name: "Ayumi",
    gender: "Female",
    avatar: "https://randomuser.me/api/portraits/women/73.jpg",
    age: "Adult",
    language: "Japanese",
    tags: ["Narration", "Calm", "Audiobook"],
  },
];

export function VoiceSelectModal({ open, onOpenChange, voices, value, onChange }: VoiceSelectModalProps) {
  const [search, setSearch] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<"Male" | "Female" | null>(null);
  const [selectedAge, setSelectedAge] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // 合并日语声音
  const allVoices = useMemo(() => {
    const hasJapanese = voices.some(v => v.language === "Japanese");
    if (hasJapanese) {
      // 只在有日语时合并
      return [
        ...voices,
        ...EXTRA_JP_VOICES.filter(
          extra => !voices.some(v => v.id === extra.id)
        ),
      ];
    }
    return voices;
  }, [voices]);

  // 只显示当前 voices 里的语种（去重），与右侧参数设置区保持一致
  const languageOptions = useMemo(
    () => Array.from(new Set(allVoices.map(v => v.language))),
    [allVoices]
  );

  // 侧边栏传入 voices 只有一个语种时，自动选中该语种
  useEffect(() => {
    if (!selectedLanguage) {
      const langs = Array.from(new Set(voices.map(v => v.language)));
      if (langs.length === 1) {
        setSelectedLanguage(langs[0]);
      }
    }
    // eslint-disable-next-line
  }, [voices]);

  // 其余选项
  const genderOptions = ["Male", "Female"] as const;
  const ageOptions = useMemo(() => Array.from(new Set(allVoices.map(v => v.age))).sort(), [allVoices]);
  const tagOptions = useMemo(() => Array.from(new Set(allVoices.flatMap(v => v.tags))).sort(), [allVoices]);

  // 过滤逻辑
  const filtered = allVoices.filter(v => {
    if (search && !(
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.language.toLowerCase().includes(search.toLowerCase()) ||
      v.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
    )) {
      return false;
    }
    if (selectedLanguage && v.language !== selectedLanguage) return false;
    if (selectedGender && v.gender !== selectedGender) return false;
    if (selectedAge && v.age !== selectedAge) return false;
    if (selectedTags.length > 0 && !selectedTags.every(tag => v.tags.includes(tag))) return false;
    return true;
  });

  // 选项切换
  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-full p-0">
        <div className="flex flex-col h-[600px]">
          {/* 降低高度后的Header，只保留一个关闭按钮 */}
          <div className="flex items-center justify-between px-4 py-2 border-b relative">
            <DialogTitle className="text-lg font-semibold">Select Voice</DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="icon">
                <X className="w-5 h-5" />
              </Button>
            </DialogClose>
          </div>
          <div className="flex flex-1 overflow-hidden">
            {/* 左侧筛选栏 */}
            <div className="w-64 border-r p-6 flex flex-col gap-4 bg-gray-50">
              <Input
                placeholder="Search voices..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="mb-2"
              />
              {/* 语言筛选 */}
              <div>
                <div className="text-xs font-semibold text-gray-500 mb-1">语言</div>
                <div className="flex flex-wrap gap-2">
                  {languageOptions.map(lang => (
                    <button
                      key={lang}
                      type="button"
                      className={cn(
                        "px-2 py-0.5 rounded text-xs border",
                        selectedLanguage === lang
                          ? "bg-blue-100 border-blue-400 text-blue-700"
                          : "bg-white border-gray-200 text-gray-700 hover:bg-gray-100"
                      )}
                      onClick={() => setSelectedLanguage(selectedLanguage === lang ? null : lang)}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
              {/* 性别筛选 */}
              <div>
                <div className="text-xs font-semibold text-gray-500 mb-1">性别</div>
                <div className="flex flex-wrap gap-2">
                  {genderOptions.map(gender => (
                    <button
                      key={gender}
                      type="button"
                      className={cn(
                        "px-2 py-0.5 rounded text-xs border",
                        selectedGender === gender
                          ? "bg-blue-100 border-blue-400 text-blue-700"
                          : "bg-white border-gray-200 text-gray-700 hover:bg-gray-100"
                      )}
                      onClick={() => setSelectedGender(selectedGender === gender ? null : gender)}
                    >
                      {gender === "Male" ? "男" : "女"}
                    </button>
                  ))}
                </div>
              </div>
              {/* 年龄筛选 */}
              <div>
                <div className="text-xs font-semibold text-gray-500 mb-1">年龄</div>
                <div className="flex flex-wrap gap-2">
                  {ageOptions.map(age => (
                    <button
                      key={age}
                      type="button"
                      className={cn(
                        "px-2 py-0.5 rounded text-xs border",
                        selectedAge === age
                          ? "bg-blue-100 border-blue-400 text-blue-700"
                          : "bg-white border-gray-200 text-gray-700 hover:bg-gray-100"
                      )}
                      onClick={() => setSelectedAge(selectedAge === age ? null : age)}
                    >
                      {age}
                    </button>
                  ))}
                </div>
              </div>
              {/* 标签筛选 */}
              <div>
                <div className="text-xs font-semibold text-gray-500 mb-1">标签</div>
                <div className="flex flex-wrap gap-2">
                  {tagOptions.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      className={cn(
                        "px-2 py-0.5 rounded text-xs border",
                        selectedTags.includes(tag)
                          ? "bg-blue-100 border-blue-400 text-blue-700"
                          : "bg-white border-gray-200 text-gray-700 hover:bg-gray-100"
                      )}
                      onClick={() => handleTagToggle(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {/* 右侧卡片区 */}
            <div className="flex-1 overflow-auto p-6">
              <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                {filtered.map(v => (
                  <button
                    key={v.id}
                    className={cn(
                      "group relative flex flex-col items-start p-4 rounded-xl border transition focus:outline-none",
                      value === v.id
                        ? "border-blue-500 ring-2 ring-blue-200 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    )}
                    onClick={() => onChange(v.id)}
                    type="button"
                  >
                    <div className="flex items-center mb-2">
                      <img
                        src={v.avatar}
                        alt={v.name}
                        className="w-12 h-12 rounded-full object-cover border mr-3"
                        onError={e => ((e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(v.name))}
                      />
                      <div>
                        <div className="font-semibold text-lg flex items-center">
                          {v.name}
                          {genderIcon(v.gender)}
                        </div>
                        <div className="text-xs text-gray-500">{v.language} • {v.age}</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {v.tags.map(tag => (
                        <span key={tag} className="bg-gray-100 text-xs text-gray-700 px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Button variant="ghost" size="icon" className="absolute right-4 top-4">
                      <Play className="w-5 h-5 text-blue-500" />
                    </Button>
                    {value === v.id && (
                      <Check className="absolute right-4 bottom-4 text-blue-500 w-5 h-5" />
                    )}
                  </button>
                ))}
              </div>
              {filtered.length === 0 && (
                <div className="text-center text-gray-400 mt-12">No voices found.</div>
              )}
            </div>
          </div>
          {/* 降低footer高度 */}
          <div className="flex justify-end gap-4 border-t px-4 py-2 bg-white">
            <DialogClose asChild>
              <Button onClick={() => onOpenChange(false)}>OK</Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}