import React from 'react';
import { FarmPlot, CropType } from '../types/game';
import { CROP_CONFIG } from '../data/gameData';
import { sounds } from '../utils/audio';

interface FarmModalProps {
  plot: FarmPlot;
  playerSeeds: Record<CropType, number>;
  onPlant: (plotId: number, crop: CropType) => void;
  onWater: (plotId: number) => void;
  onHarvest: (plot: FarmPlot) => void;
  onClose: () => void;
}

export const FarmModal: React.FC<FarmModalProps> = ({
  plot,
  playerSeeds,
  onPlant,
  onWater,
  onHarvest,
  onClose,
}) => {
  const cropInfo = plot.cropType ? CROP_CONFIG[plot.cropType] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 select-none">
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-emerald-500/80 rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center">
        <h3 className="text-base font-bold text-emerald-400 mb-1">Petak Kebun #{plot.id + 1}</h3>

        {/* Empty Plot -> Choose seed */}
        {!plot.cropType && (
          <div className="w-full mt-3">
            <p className="text-xs text-slate-400 mb-4">Pilih bibit dari kantongmu untuk ditanam di tanah subur ini:</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {(['wortel', 'tomat', 'jagung', 'stroberi'] as CropType[]).map((crop) => {
                const info = CROP_CONFIG[crop];
                const count = playerSeeds[crop] || 0;
                return (
                  <button
                    key={crop}
                    disabled={count <= 0}
                    onClick={() => {
                      sounds.playPop();
                      onPlant(plot.id, crop);
                      onClose();
                    }}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between h-24 transition-all ${
                      count > 0
                        ? 'border-emerald-700 bg-emerald-950/40 hover:border-emerald-400 cursor-pointer'
                        : 'border-slate-800 bg-slate-900/50 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{info.icon}</span>
                      <span className="text-xs font-bold text-slate-300">x{count}</span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{info.name}</div>
                      <div className="text-[10px] text-slate-400">Tumbuh: {info.growSec} dtk · Nilai: {info.sellPrice} Xu</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Planted Plot */}
        {plot.cropType && cropInfo && (
          <div className="w-full flex flex-col items-center my-4 space-y-3">
            <div className="text-5xl animate-bounce">{cropInfo.icon}</div>
            <div className="text-sm font-bold text-white">{cropInfo.name}</div>

            <div className="w-full bg-slate-800/80 rounded-lg p-3 text-xs space-y-1.5 text-left border border-slate-700">
              <div className="flex justify-between text-slate-300">
                <span>Status Tanaman:</span>
                <span className="font-bold text-amber-400">
                  {plot.stage === 3 ? 'Siap Dipanen! ✨' : plot.stage === 2 ? 'Sedang Tumbuh Subur' : 'Bibit Baru Bersemi'}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Kondisi Tanah:</span>
                <span className={plot.watered ? 'text-sky-400 font-bold' : 'text-amber-500 font-bold'}>
                  {plot.watered ? '💧 Lembab & Segar' : '☀️ Kering (Perlu Disiram)'}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Nilai Jual Panen:</span>
                <span className="text-amber-400 font-bold tabular-nums">🪙 {cropInfo.sellPrice} Xu</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 w-full pt-2">
              {plot.stage === 3 ? (
                <button
                  onClick={() => {
                    sounds.playCoin();
                    onHarvest(plot);
                    onClose();
                  }}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg animate-pulse"
                >
                  🧺 Panen Sekarang (+{cropInfo.xp} XP)
                </button>
              ) : !plot.watered ? (
                <button
                  onClick={() => {
                    sounds.playSplash();
                    onWater(plot.id);
                    onClose();
                  }}
                  className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-md"
                >
                  💧 Siram Air ke Petak
                </button>
              ) : (
                <div className="w-full py-2 rounded-xl bg-slate-800 text-slate-400 text-xs font-semibold">
                  🌱 Tunggu sampai panen tiba...
                </div>
              )}
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-2 text-xs font-semibold text-slate-400 hover:text-white"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};
