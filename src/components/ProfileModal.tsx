import React, { useState } from 'react';
import { Player } from '../types/game';
import { AvatarRenderer } from './AvatarRenderer';
import { sounds } from '../utils/audio';

interface ProfileModalProps {
  player: Player;
  onUpdateName: (newName: string) => void;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ player, onUpdateName, onClose }) => {
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(player.name);

  const handleSaveName = () => {
    if (nameInput.trim()) {
      sounds.playPop();
      onUpdateName(nameInput.trim());
      setEditingName(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 select-none">
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-slate-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <h3 className="text-base font-bold text-amber-400">Kartu Tanda Penduduk AOI</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-sm font-bold">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Avatar & Basic Info Card */}
          <div className="flex items-center gap-4 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <div className="w-20 h-24 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-700 overflow-hidden shadow-inner">
              <AvatarRenderer avatar={player.avatar} action="idle" size="medium" />
            </div>

            <div className="flex-1 space-y-1">
              {editingName ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    maxLength={15}
                    className="px-2 py-1 rounded bg-slate-800 border border-amber-400 text-xs text-white font-bold w-full"
                  />
                  <button
                    onClick={handleSaveName}
                    className="px-2 py-1 rounded bg-amber-500 text-slate-950 text-xs font-bold shrink-0"
                  >
                    Simpan
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold text-white">{player.name}</span>
                  <button
                    onClick={() => setEditingName(true)}
                    className="text-slate-400 hover:text-amber-400 text-xs"
                    title="Ganti Nama"
                  >
                    ✏️
                  </button>
                </div>
              )}

              <div className="text-xs font-bold text-amber-300">{player.avatar.title}</div>
              <div className="text-xs text-slate-400">
                Level: <strong className="text-white">Lv. {player.level}</strong> · Status: <span className="text-emerald-400">Online</span>
              </div>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Koin Dompet</span>
              <span className="text-sm font-black text-amber-400 tabular-nums">🪙 {player.xu.toLocaleString()} Xu</span>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Batu Permata</span>
              <span className="text-sm font-black text-purple-400 tabular-nums">💎 {player.luong} Lượng</span>
            </div>
          </div>

          {/* Achievements / Medals */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Lencana Prestasi AOI</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/40 border border-slate-700/60">
                <span className="text-xl">🚜</span>
                <div>
                  <div className="font-bold text-slate-200">Petani Berdikari</div>
                  <div className="text-[10px] text-slate-400">Panen sayuran segar</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/40 border border-slate-700/60">
                <span className="text-xl">🎣</span>
                <div>
                  <div className="font-bold text-slate-200">Mancing Mania</div>
                  <div className="text-[10px] text-slate-400">Tangkapan pesisir pantai</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/40 border border-slate-700/60">
                <span className="text-xl">👕</span>
                <div>
                  <div className="font-bold text-slate-200">Ikon Distro</div>
                  <div className="text-[10px] text-slate-400">Koleksi baju gaul AOI</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/40 border border-slate-700/60">
                <span className="text-xl">☕</span>
                <div>
                  <div className="font-bold text-slate-200">Tongkrongan Asik</div>
                  <div className="text-[10px] text-slate-400">Ngobrol di taman kota</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Tutup KTP
          </button>
        </div>
      </div>
    </div>
  );
};
