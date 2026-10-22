import React, { useState } from 'react';
import { AvatarConfig, TopOutfit, BottomOutfit, Headwear, Accessory, HairStyle } from '../types/game';
import { BOUTIQUE_CATALOG } from '../data/gameData';
import { AvatarRenderer } from './AvatarRenderer';
import { sounds } from '../utils/audio';

interface BoutiqueModalProps {
  currentAvatar: AvatarConfig;
  playerXu: number;
  onSaveAvatar: (newAvatar: AvatarConfig, cost: number) => void;
  onClose: () => void;
}

export const BoutiqueModal: React.FC<BoutiqueModalProps> = ({
  currentAvatar,
  playerXu,
  onSaveAvatar,
  onClose,
}) => {
  const [avatar, setAvatar] = useState<AvatarConfig>({ ...currentAvatar });
  const [activeTab, setActiveTab] = useState<'rambut' | 'baju' | 'celana' | 'topi' | 'aksesoris' | 'gelar'>('baju');
  const [totalCost, setTotalCost] = useState(0);

  const skinTones = [
    { label: 'Kuning Langsat', color: '#f5d0b0' },
    { label: 'Sawo Matang', color: '#c68642' },
    { label: 'Cerah', color: '#fce3ce' },
    { label: 'Eksotis Gelap', color: '#8d5524' },
  ];

  const hairColors = [
    { label: 'Hitam Alami', color: '#171717' },
    { label: 'Cokelat Gelap', color: '#382218' },
    { label: 'Pirang Emas', color: '#d97706' },
    { label: 'Merah Distro', color: '#b91c1c' },
    { label: 'Biru Cyan', color: '#0284c7' },
    { label: 'Pink Pastel', color: '#ec4899' },
  ];

  const hairStyles: { id: HairStyle; label: string }[] = [
    { id: 'messy', label: 'Anime Messy Bangs' },
    { id: 'spiky', label: 'Spiky Cool' },
    { id: 'buzz', label: 'Buzzcut Rapi' },
    { id: 'curls', label: 'Ikal Natural' },
    { id: 'hijab', label: 'Hijab Anggun' },
    { id: 'twintails', label: 'Twin Buns / Tails' },
    { id: 'ponytail', label: 'Kuncir Kuda' },
  ];

  const bottomList: { id: BottomOutfit; label: string; price: number }[] = [
    { id: 'jeans_blue', label: 'Jeans Biru Klasik', price: 0 },
    { id: 'cargo_dark', label: 'Celana Cargo Tactical', price: 400 },
    { id: 'skirt_green', label: 'Rok Lipit Hijau', price: 350 },
    { id: 'jogger_black', label: 'Jogger Hitam Strip', price: 500 },
  ];

  const handleSelectTop = (id: TopOutfit, price: number) => {
    sounds.playClick();
    setAvatar((prev) => ({ ...prev, top: id }));
    if (id !== currentAvatar.top) setTotalCost((prev) => prev + price);
  };

  const handleSelectHat = (id: Headwear, price: number) => {
    sounds.playClick();
    setAvatar((prev) => ({ ...prev, hat: id }));
    if (id !== currentAvatar.hat) setTotalCost((prev) => prev + price);
  };

  const handleSelectAccessory = (id: Accessory, price: number) => {
    sounds.playClick();
    setAvatar((prev) => ({ ...prev, accessory: id }));
    if (id !== currentAvatar.accessory) setTotalCost((prev) => prev + price);
  };

  const handleSave = () => {
    if (totalCost > playerXu) {
      alert('Koin Xu kamu tidak mencukupi untuk membeli pakaian ini!');
      return;
    }
    sounds.playCoin();
    onSaveAvatar(avatar, totalCost);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overscroll-contain bg-black/80 p-2 sm:p-4">
      <div className="relative flex h-[94vh] max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border-2 border-slate-700 bg-slate-900 shadow-2xl md:h-auto md:max-h-[90vh] md:flex-row">
        {/* Left Column: Live Character Showcase & Preview */}
        <div className="flex shrink-0 flex-col items-center justify-between gap-2 border-b border-slate-800 bg-gradient-to-b from-slate-950 to-slate-900 p-3 md:w-5/12 md:gap-4 md:border-b-0 md:border-r md:p-6">
          <div className="text-center w-full">
            <h2 className="text-lg font-bold text-amber-400">Butik & Salon AOI</h2>
            <p className="text-xs text-slate-400">Atur gayamu biar paling kece di tongkrongan!</p>
          </div>

          {/* Large Animated Avatar Stage */}
          <div className="relative my-1 flex h-24 w-24 items-center justify-center rounded-2xl border border-slate-700 bg-slate-800/60 shadow-inner md:my-4 md:h-56 md:w-44">
            <AvatarRenderer
              avatar={avatar}
              action="dance"
              direction="right"
              title={avatar.title}
              isCurrentPlayer={true}
              size="large"
            />
          </div>

          <div className="w-full bg-slate-950/80 rounded-xl p-3 border border-slate-800 text-xs space-y-1">
            <div className="flex justify-between text-slate-300">
              <span>Dompet Xu:</span>
              <span className="font-bold text-amber-400 tabular-nums">🪙 {playerXu.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Biaya Ganti:</span>
              <span className="font-bold text-yellow-400 tabular-nums">🪙 {totalCost.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Wardrobe Category Tabs & Selector */}
        <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden bg-slate-900 md:w-7/12 md:flex-none">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 p-2 bg-slate-950 border-b border-slate-800 overflow-x-auto text-xs font-semibold">
            {(['rambut', 'baju', 'celana', 'topi', 'aksesoris', 'gelar'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  sounds.playClick();
                }}
                className={`px-3 py-1.5 rounded-lg capitalize whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Options Content */}
          <div className="min-h-0 flex-1 space-y-4 overflow-y-scroll overscroll-y-contain p-3 touch-pan-y sm:p-4">
            {activeTab === 'rambut' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-2">Model Rambut</label>
                  <div className="grid grid-cols-2 gap-2">
                    {hairStyles.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          sounds.playClick();
                          setAvatar((prev) => ({ ...prev, hairStyle: item.id }));
                        }}
                        className={`p-2 rounded-lg border text-left text-xs font-semibold transition-all ${
                          avatar.hairStyle === item.id
                            ? 'border-amber-400 bg-amber-500/10 text-amber-300'
                            : 'border-slate-800 bg-slate-800/60 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-2">Warna Rambut</label>
                  <div className="flex flex-wrap gap-2">
                    {hairColors.map((hc) => (
                      <button
                        key={hc.color}
                        onClick={() => {
                          sounds.playClick();
                          setAvatar((prev) => ({ ...prev, hairColor: hc.color }));
                        }}
                        className={`w-8 h-8 rounded-full border-2 transition-transform ${
                          avatar.hairColor === hc.color ? 'scale-110 border-amber-400' : 'border-slate-700'
                        }`}
                        style={{ backgroundColor: hc.color }}
                        title={hc.label}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-2">Warna Kulit</label>
                  <div className="flex flex-wrap gap-2">
                    {skinTones.map((st) => (
                      <button
                        key={st.color}
                        onClick={() => {
                          sounds.playClick();
                          setAvatar((prev) => ({ ...prev, skinColor: st.color }));
                        }}
                        className={`w-8 h-8 rounded-full border-2 transition-transform ${
                          avatar.skinColor === st.color ? 'scale-110 border-amber-400' : 'border-slate-700'
                        }`}
                        style={{ backgroundColor: st.color }}
                        title={st.label}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'baju' && (
              <div className="grid grid-cols-2 gap-2">
                {BOUTIQUE_CATALOG.tops.map((top) => (
                  <button
                    key={top.id}
                    onClick={() => handleSelectTop(top.id as TopOutfit, top.price)}
                    className={`p-2.5 rounded-lg border text-left text-xs flex flex-col justify-between h-20 transition-all ${
                      avatar.top === top.id
                        ? 'border-amber-400 bg-amber-500/15 text-amber-300'
                        : 'border-slate-800 bg-slate-800/60 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-bold text-[13px]">{top.name}</span>
                    <span className="text-amber-400 font-semibold tabular-nums">🪙 {top.price.toLocaleString()} Xu</span>
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'celana' && (
              <div className="grid grid-cols-2 gap-2">
                {bottomList.map((bot) => (
                  <button
                    key={bot.id}
                    onClick={() => {
                      sounds.playClick();
                      setAvatar((prev) => ({ ...prev, bottom: bot.id }));
                    }}
                    className={`p-2.5 rounded-lg border text-left text-xs flex flex-col justify-between h-20 transition-all ${
                      avatar.bottom === bot.id
                        ? 'border-amber-400 bg-amber-500/15 text-amber-300'
                        : 'border-slate-800 bg-slate-800/60 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-bold text-[13px]">{bot.label}</span>
                    <span className="text-amber-400 font-semibold tabular-nums">
                      {bot.price === 0 ? 'Gratis' : `🪙 ${bot.price} Xu`}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'topi' && (
              <div className="grid grid-cols-2 gap-2">
                {BOUTIQUE_CATALOG.hats.map((hat) => (
                  <button
                    key={hat.id}
                    onClick={() => handleSelectHat(hat.id as Headwear, hat.price)}
                    className={`p-2.5 rounded-lg border text-left text-xs flex flex-col justify-between h-20 transition-all ${
                      avatar.hat === hat.id
                        ? 'border-amber-400 bg-amber-500/15 text-amber-300'
                        : 'border-slate-800 bg-slate-800/60 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-bold text-[13px]">{hat.name}</span>
                    <span className="text-amber-400 font-semibold tabular-nums">
                      {hat.price === 0 ? 'Gratis' : `🪙 ${hat.price} Xu`}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'aksesoris' && (
              <div className="grid grid-cols-2 gap-2">
                {BOUTIQUE_CATALOG.accessories.map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => handleSelectAccessory(acc.id as Accessory, acc.price)}
                    className={`p-2.5 rounded-lg border text-left text-xs flex flex-col justify-between h-20 transition-all ${
                      avatar.accessory === acc.id
                        ? 'border-amber-400 bg-amber-500/15 text-amber-300'
                        : 'border-slate-800 bg-slate-800/60 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-bold text-[13px]">{acc.name}</span>
                    <span className="text-amber-400 font-semibold tabular-nums">
                      {acc.price === 0 ? 'Gratis' : `🪙 ${acc.price} Xu`}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'gelar' && (
              <div className="grid grid-cols-2 gap-2">
                {BOUTIQUE_CATALOG.titles.map((t) => (
                  <button
                    key={t.title}
                    onClick={() => {
                      sounds.playClick();
                      setAvatar((prev) => ({ ...prev, title: t.title }));
                    }}
                    className={`p-2.5 rounded-lg border text-left text-xs flex flex-col justify-between h-20 transition-all ${
                      avatar.title === t.title
                        ? 'border-amber-400 bg-amber-500/15 text-amber-300'
                        : 'border-slate-800 bg-slate-800/60 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-bold text-[13px]">{t.title}</span>
                    <span className="text-amber-400 font-semibold tabular-nums">
                      {t.price === 0 ? 'Tersedia' : `🪙 ${t.price} Xu`}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="flex shrink-0 items-center justify-end gap-2 border-t border-slate-800 bg-slate-950 p-2 sm:p-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md transition-colors"
            >
              Simpan & Kenakan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
