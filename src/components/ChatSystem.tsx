import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, MapId } from '../types/game';
import { sounds } from '../utils/audio';

interface ChatSystemProps {
  messages: ChatMessage[];
  currentMap: MapId;
  onSendMessage: (text: string, emote?: string) => void;
  className?: string;
}

export const ChatSystem: React.FC<ChatSystemProps> = ({
  messages,
  currentMap,
  onSendMessage,
  className = '',
}) => {
  const [inputText, setInputText] = useState('');
  const [activeChannel, setActiveChannel] = useState<'all' | 'map' | 'system'>('all');
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredMessages = messages.filter((msg) => {
    if (activeChannel === 'map') return msg.map === currentMap;
    if (activeChannel === 'system') return msg.channel === 'system';
    return true;
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [filteredMessages.length]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    sounds.playPop();
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const quickPresets = [
    'Halo warga AOI! 👋',
    'Nongkrong di warung kopi yuk ☕',
    'Ada yang mau mabar mancing? 🎣',
    'Wkwkwk mantap! 😂',
    'Keren outfitnya bang! ✨',
    'Bagi koin dong sultan 🪙',
  ];

  return (
    <div className={`flex flex-col bg-slate-900/90 backdrop-blur border border-slate-700/80 rounded-xl overflow-hidden shadow-xl ${className}`}>
      {/* Top Header & Channels */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950/80 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveChannel('all')}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
              activeChannel === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setActiveChannel('map')}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
              activeChannel === 'map'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Map Ini
          </button>
          <button
            onClick={() => setActiveChannel('system')}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
              activeChannel === 'system'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sistem
          </button>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-slate-400 hover:text-white text-[11px] font-medium"
        >
          {isExpanded ? '▼ Kecilkan' : '▲ Perbesar'}
        </button>
      </div>

      {/* Message List */}
      <div
        ref={scrollRef}
        className={`px-3 py-2 overflow-y-auto space-y-1.5 transition-all duration-200 ${
          isExpanded ? 'h-52' : 'h-24'
        }`}
      >
        {filteredMessages.length === 0 ? (
          <div className="text-slate-500 text-xs text-center py-4">Belum ada obrolan. Mulai sapa teman-temanmu!</div>
        ) : (
          filteredMessages.map((msg) => (
            <div key={msg.id} className="text-xs leading-relaxed break-words">
              {msg.channel === 'system' ? (
                <div className="text-amber-400/90 font-medium">
                  📢 <span className="text-[10px] text-slate-400">[{msg.time}]</span> {msg.text}
                </div>
              ) : (
                <div className="text-slate-200">
                  <span className="text-[10px] text-slate-400 mr-1">[{msg.time}]</span>
                  {msg.senderTitle && (
                    <span className="text-[9px] font-semibold px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 mr-1">
                      {msg.senderTitle}
                    </span>
                  )}
                  <span className="font-bold text-sky-400 mr-1">{msg.senderName}:</span>
                  <span>{msg.text}</span>
                  {msg.emote && <span className="ml-1">{msg.emote}</span>}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Quick Presets Bar */}
      <div className="flex items-center gap-1.5 px-3 py-1 overflow-x-auto bg-slate-950/50 border-t border-slate-800/80 no-scrollbar">
        {quickPresets.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => {
              onSendMessage(preset);
              sounds.playPop();
            }}
            className="text-[10px] whitespace-nowrap px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border border-slate-700 shrink-0"
          >
            {preset}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="flex items-center gap-2 p-2 bg-slate-950 border-t border-slate-800">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ketik pesan chat di sini..."
          maxLength={100}
          className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400"
        />
        <button
          type="submit"
          className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-xs transition-colors shadow-sm shrink-0"
        >
          Kirim
        </button>
      </form>
    </div>
  );
};
