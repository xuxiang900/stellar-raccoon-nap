import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";
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

export function VoiceSelectModal({ open, onOpenChange, voices, value, onChange }: VoiceSelectModalProps) {
  const [search, setSearch] = useState("");

  const filtered = voices.filter(
    v =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.language.toLowerCase().includes(search.toLowerCase()) ||
      v.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

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
              {/* 可扩展：语言、性别、标签筛选 */}
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