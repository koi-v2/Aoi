import React, { useState } from 'react';
import { InventoryItem, CaughtFish, CropType } from '../types/game';
import { CROP_CONFIG } from '../data/gameData';
import { sounds } from '../utils/audio';

interface InventoryModalProps {
  items: InventoryItem[];
  caughtFish: CaughtFish[];
  playerXu: number;
  playerSeeds: Record<CropType, number>;
  playerHarvest: Record<CropType, number>;
  onBuySeed: (crop: CropType, count: number) => void;
  onSellProduce: (crop: CropType, count: number) => void;
  onSellFish: (fishId: string) => void;
  onSellAllFish: () => void;
  onClose: () => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  caughtFish,
  playerXu,
  playerSeeds,
  playerHarvest,
  onBuySeed,
  onSellProduce,
  onSellFish,
  onSellAllFish,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'panen' | 'ikan' | 'toko'>('panen');

  const totalFishValue = caughtFish.reduce((acc, f) => acc + f.price, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 select-none">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-slate-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-amber-400">Kantong & Pasar AOI</h2>
            <p className="text-xs text-slate-400">Kelola bibit, hasil panen, dan tangkapan ikanmu</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-bold text-amber-300 tabular-nums">
              🪙 {playerXu.toLocaleString()} Xu
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-sm font-bold px-2 py-1"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 px-6 py-2 bg-slate-950/60 border-b border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('panen')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'panen'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🌾 Hasil Panen & Bibit
          </button>
          <button
            onClick={() => setActiveTab('ikan')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'ikan'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🐟 Ember Ikan ({caughtFish.length})
          </button>
          <button
            onClick={() => setActiveTab('toko')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'toko'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🏪 Toko Bibit & Pupuk
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* TAB 1: PANEN & BIBIT */}
          {activeTab === 'panen' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Hasil Panen Siap Jual</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(['wortel', 'tomat', 'jagung', 'stroberi'] as CropType[]).map((crop) => {
                    const info = CROP_CONFIG[crop];
                    const count = playerHarvest[crop] || 0;
                    return (
                      <div
                        key={crop}
                        className="bg-slate-800/60 border border-slate-700 rounded-xl p-3 flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-3xl">{info.icon}</span>
                          <span className="text-xs font-bold text-white bg-slate-700 px-1.5 py-0.5 rounded">
                            x{count}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-slate-200">{info.name}</div>
                        <div className="text-[10px] text-amber-400 font-semibold mb-2">
                          🪙 {info.sellPrice} Xu/buah
                        </div>
                        <button
                          disabled={count <= 0}
                          onClick={() => {
                            sounds.playCoin();
                            onSellProduce(crop, 1);
                          }}
                          className={`w-full py-1.5 rounded text-xs font-bold transition-colors ${
                            count > 0
                              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer'
                              : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                          }`}
                        >
                          Jual 1 (+{info.sellPrice} Xu)
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Stok Bibit Milikmu</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(['wortel', 'tomat', 'jagung', 'stroberi'] as CropType[]).map((crop) => {
                    const info = CROP_CONFIG[crop];
                    const count = playerSeeds[crop] || 0;
                    return (
                      <div key={crop} className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3 flex items-center gap-3">
                        <span className="text-2xl">🌱</span>
                        <div>
                          <div className="text-xs font-bold text-slate-200">Bibit {info.name.split(' ')[0]}</div>
                          <div className="text-[11px] text-slate-400">Tersedia: <strong className="text-white">{count}</strong></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EMBER IKAN */}
          {activeTab === 'ikan' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">
                  Total tangkapan: <strong className="text-white">{caughtFish.length} ekor</strong> (Estimasi: <strong className="text-amber-400">🪙 {totalFishValue.toLocaleString()} Xu</strong>)
                </span>
                {caughtFish.length > 0 && (
                  <button
                    onClick={() => {
                      sounds.playCoin();
                      onSellAllFish();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow"
                  >
                    Jual Semua Ikan (🪙 {totalFishValue.toLocaleString()})
                  </button>
                )}
              </div>

              {caughtFish.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  Ember ikanmu masih kosong. Pergi ke Pantai Biru dan lempar pancinganmu!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {caughtFish.map((fish) => (
                    <div
                      key={fish.id}
                      className="bg-slate-800/70 border border-slate-700 rounded-xl p-3 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{fish.rarity === 'Legendaris' ? '✨' : '🐟'}</span>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>{fish.name}</span>
                            <span className={`text-[9px] px-1.5 py-0.2 rounded font-extrabold ${
                              fish.rarity === 'Legendaris' ? 'bg-amber-500 text-slate-950' : fish.rarity === 'Langka' ? 'bg-purple-600 text-white' : 'bg-sky-700 text-white'
                            }`}>
                              {fish.rarity}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Berat: {fish.weightKg} kg · Jam: {fish.caughtAt}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          sounds.playCoin();
                          onSellFish(fish.id);
                        }}
                        className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/50 text-xs font-bold transition-colors"
                      >
                        Jual 🪙 {fish.price}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TOKO BIBIT */}
          {activeTab === 'toko' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(['wortel', 'tomat', 'jagung', 'stroberi'] as CropType[]).map((crop) => {
                const info = CROP_CONFIG[crop];
                const canAfford = playerXu >= info.seedPrice;
                return (
                  <div
                    key={crop}
                    className="bg-slate-800/70 border border-slate-700 rounded-xl p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">🌱</span>
                      <div>
                        <div className="text-xs font-bold text-white">Bibit {info.name}</div>
                        <div className="text-[11px] text-slate-400">
                          Waktu panen: {info.growSec} detik · XP: +{info.xp}
                        </div>
                        <div className="text-xs font-bold text-amber-400">🪙 {info.seedPrice} Xu/bibit</div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <button
                        disabled={!canAfford}
                        onClick={() => {
                          sounds.playCoin();
                          onBuySeed(crop, 1);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          canAfford
                            ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                            : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                        }`}
                      >
                        Beli 1
                      </button>
                      <button
                        disabled={playerXu < info.seedPrice * 5}
                        onClick={() => {
                          sounds.playCoin();
                          onBuySeed(crop, 5);
                        }}
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                          playerXu >= info.seedPrice * 5
                            ? 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                            : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                        }`}
                      >
                        Beli 5
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
