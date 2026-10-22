import React, { useRef } from 'react';
import { Player, MapId, FarmPlot } from '../types/game';
import { AvatarRenderer } from './AvatarRenderer';
import { sounds } from '../utils/audio';

// Direct ES imports for Vite guaranteed asset bundling
import tamanKotaImg from '../assets/images/aoi_taman_kota_map_1792663006899.jpg';
import kebunImg from '../assets/images/aoi_kebun_farm_map_1792663007687.jpg';
import pantaiImg from '../assets/images/aoi_pantai_beach_map_1792663007315.jpg';

const MAP_BACKGROUNDS: Record<MapId, string> = {
  taman_kota: tamanKotaImg,
  kebun: kebunImg,
  pantai: pantaiImg,
};

const MAP_NAMES: Record<MapId, { title: string; subtitle: string; icon: string }> = {
  taman_kota: { title: 'Taman Kota Jakarta', subtitle: 'Pusat Kota & Tongkrongan Warga', icon: '🏛️' },
  kebun: { title: 'Kebun & Ternak Makmur', subtitle: 'Lahan Pertanian & Peternakan Sapi', icon: '🌾' },
  pantai: { title: 'Pantai Biru Pesisir', subtitle: 'Dermaga Pancing & Resort Santai', icon: '🏖️' },
};

interface GameWorldProps {
  currentMap: MapId;
  player: Player;
  otherPlayers: Player[];
  farmPlots: FarmPlot[];
  onMovePlayer: (x: number, y: number) => void;
  onSelectPlayer: (player: Player) => void;
  onInteractFarmPlot: (plot: FarmPlot) => void;
  onStartFishing: () => void;
  onOpenBoutique: () => void;
  onWarpMap: (map: MapId) => void;
  onMakeWishFountain: () => void;
  onBuySnack: () => void;
  isFishingActive: boolean;
}

export const GameWorld: React.FC<GameWorldProps> = ({
  currentMap,
  player,
  otherPlayers,
  farmPlots,
  onMovePlayer,
  onSelectPlayer,
  onInteractFarmPlot,
  onStartFishing,
  onOpenBoutique,
  onWarpMap,
  onMakeWishFountain,
  onBuySnack,
  isFishingActive,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [clickMarker, setClickMarker] = React.useState<{ x: number; y: number } | null>(null);

  // Handle click on the map to walk
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    // Clamp coordinates so characters don't walk off map
    const clampedX = Math.max(5, Math.min(95, clickX));
    const clampedY = Math.max(18, Math.min(90, clickY));

    setClickMarker({ x: clampedX, y: clampedY });
    sounds.playStep();
    onMovePlayer(clampedX, clampedY);

    setTimeout(() => {
      setClickMarker(null);
    }, 700);
  };

  // Combine current player and visible players on this map
  const visiblePlayers = [
    player,
    ...otherPlayers.filter((p) => p.map === currentMap),
  ].sort((a, b) => a.y - b.y);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-slate-950 overflow-hidden select-none">
      {/* 16:9 Game Stage Container */}
      <div
        ref={mapRef}
        onClick={handleMapClick}
        className="relative w-full max-w-[1280px] aspect-[16/9] shadow-2xl rounded-2xl overflow-hidden cursor-crosshair border-2 border-slate-700 bg-slate-900"
      >
        {/* Background Map Artwork with Key for seamless re-render */}
        <img
          key={currentMap}
          src={MAP_BACKGROUNDS[currentMap]}
          alt={`${currentMap} map`}
          className="absolute inset-0 w-full h-full object-cover pixelated pointer-events-none transition-opacity duration-300"
          referrerPolicy="no-referrer"
        />

        {/* Ambient Map Vignette */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 via-transparent to-black/15" />

        {/* TOP HUD OVERLAY INSIDE MAP: Location Badge & Direct Warp Tabs */}
        <div className="absolute top-3 left-3 z-20 flex flex-wrap items-center gap-2 pointer-events-auto">
          {/* Active Map Title Badge */}
          <div className="px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-amber-500/50 shadow-lg flex items-center gap-2">
            <span className="text-base">{MAP_NAMES[currentMap].icon}</span>
            <div className="flex flex-col">
              <span className="text-[11px] font-black text-amber-300 leading-none">
                {MAP_NAMES[currentMap].title}
              </span>
              <span className="text-[9px] text-slate-400 leading-none mt-0.5">
                {MAP_NAMES[currentMap].subtitle}
              </span>
            </div>
          </div>

          {/* Quick Map Warp Buttons */}
          <div className="flex items-center gap-1 bg-slate-950/80 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 shadow-lg">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onWarpMap('taman_kota');
              }}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                currentMap === 'taman_kota'
                  ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>🏛️</span>
              <span>Kota</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onWarpMap('kebun');
              }}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                currentMap === 'kebun'
                  ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>🌾</span>
              <span>Kebun</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onWarpMap('pantai');
              }}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                currentMap === 'pantai'
                  ? 'bg-sky-500 text-slate-950 font-extrabold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>🏖️</span>
              <span>Pantai</span>
            </button>
          </div>
        </div>

        {/* Click Destination Ripple Marker */}
        {clickMarker && (
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
            style={{ left: `${clickMarker.x}%`, top: `${clickMarker.y}%` }}
          >
            <div className="w-6 h-6 rounded-full border-2 border-yellow-400 bg-yellow-400/25 animate-ping" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 absolute top-1.5 left-1.5" />
          </div>
        )}

        {/* ================= MAP 1: TAMAN KOTA HOTSPOTS ================= */}
        {currentMap === 'taman_kota' && (
          <>
            {/* Air Mancur Interaktif (Fountain at center) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMakeWishFountain();
              }}
              title="Lempar Koin ke Air Mancur Hoki"
              className="absolute left-[44%] top-[52%] w-[12%] h-[16%] rounded-full cursor-pointer transition-transform hover:scale-105 active:scale-95 group z-10 flex items-center justify-center"
            >
              <div className="hidden group-hover:flex absolute -top-8 px-2 py-1 rounded bg-slate-900/90 border border-sky-400 text-[10px] font-bold text-sky-300 whitespace-nowrap shadow-md">
                🪙 Lempar Koin Air Mancur
              </div>
            </button>

            {/* Warung Kopi Lestari (Top-left) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBuySnack();
              }}
              title="Warung Kopi Lestari - Beli Kopi & Gorengan"
              className="absolute left-[8%] top-[12%] w-[22%] h-[24%] cursor-pointer group z-10 flex items-center justify-center rounded-lg"
            >
              <div className="hidden group-hover:flex absolute -top-8 px-2 py-1 rounded bg-slate-900/90 border border-amber-400 text-[10px] font-bold text-amber-300 whitespace-nowrap shadow-md">
                ☕ Beli Kopi & Camilan (+Energi)
              </div>
            </button>

            {/* Butik & Salon Busana (Top-center) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenBoutique();
              }}
              title="Toko Butik Busana AOI"
              className="absolute left-[35%] top-[8%] w-[24%] h-[20%] cursor-pointer group z-10 flex items-center justify-center rounded-lg"
            >
              <div className="hidden group-hover:flex absolute -top-8 px-2 py-1 rounded bg-slate-900/90 border border-pink-400 text-[10px] font-bold text-pink-300 whitespace-nowrap shadow-md">
                🛍️ Butik Busana & Salon Avatar
              </div>
            </button>

            {/* Warp Portal Sign to Farm (Right) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onWarpMap('kebun');
              }}
              title="Ke Kebun & Pertanian"
              className="absolute right-4 top-[35%] z-20 px-3 py-1.5 rounded-xl bg-emerald-600/95 hover:bg-emerald-500 text-white font-extrabold text-[11px] shadow-xl border-2 border-emerald-300 flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105 active:scale-95 animate-pulse"
            >
              <span>Ke Kebun Pertanian</span>
              <span>🌾 ➡️</span>
            </button>

            {/* Warp Portal Sign to Beach (Bottom-Left) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onWarpMap('pantai');
              }}
              title="Ke Dermaga Pantai Biru"
              className="absolute left-4 bottom-5 z-20 px-3 py-1.5 rounded-xl bg-sky-600/95 hover:bg-sky-500 text-white font-extrabold text-[11px] shadow-xl border-2 border-sky-300 flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105 active:scale-95 animate-pulse"
            >
              <span>🏖️ ⬅️ Ke Pantai Biru</span>
            </button>
          </>
        )}

        {/* ================= MAP 2: KEBUN & TERNAK HOTSPOTS ================= */}
        {currentMap === 'kebun' && (
          <>
            {/* Warp Return Sign to City */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onWarpMap('taman_kota');
              }}
              title="Kembali ke Taman Kota"
              className="absolute right-4 top-4 z-20 px-3 py-1.5 rounded-xl bg-slate-950/90 border-2 border-amber-400 text-[11px] font-extrabold text-amber-300 shadow-xl hover:bg-slate-900 flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105"
            >
              <span>🏛️ Kembali ke Kota</span>
            </button>

            {/* Warp Portal Sign to Beach */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onWarpMap('pantai');
              }}
              title="Pergi ke Pantai Biru"
              className="absolute left-4 bottom-5 z-20 px-3 py-1.5 rounded-xl bg-sky-600/95 hover:bg-sky-500 text-white font-extrabold text-[11px] shadow-xl border-2 border-sky-300 flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105 active:scale-95"
            >
              <span>🏖️ Ke Pantai Biru ➡️</span>
            </button>

            {/* Interactive Farm Plots Grid */}
            <div className="absolute left-[36%] top-[51%] w-[29%] h-[24%] grid grid-cols-3 grid-rows-2 gap-1.5 z-10 p-1">
              {farmPlots.slice(0, 6).map((plot) => (
                <button
                  key={plot.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onInteractFarmPlot(plot);
                  }}
                  className="relative rounded-lg border border-amber-800/80 bg-amber-950/50 hover:bg-amber-900/60 flex flex-col items-center justify-center transition-transform hover:scale-105 active:scale-95 group shadow-inner"
                >
                  {plot.cropType ? (
                    <div className="flex flex-col items-center">
                      <span className="text-lg">
                        {plot.stage === 3 ? (
                          plot.cropType === 'wortel' ? '🥕' : plot.cropType === 'tomat' ? '🍅' : plot.cropType === 'jagung' ? '🌽' : '🍓'
                        ) : plot.stage === 2 ? (
                          '🌿'
                        ) : (
                          '🌱'
                        )}
                      </span>
                      {plot.stage === 3 && (
                        <span className="absolute -top-1.5 px-1 rounded bg-yellow-400 text-[8px] font-black text-slate-950 animate-bounce">
                          PANEN!
                        </span>
                      )}
                      {plot.stage < 3 && !plot.watered && (
                        <span className="text-[7.5px] font-bold text-sky-300 bg-sky-950/80 px-0.5 rounded leading-none">
                          💧 Butuh Air
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="text-[9px] font-bold text-amber-200/70 group-hover:text-amber-100 flex flex-col items-center">
                      <span>+ Tanam</span>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Livestock visual labels */}
            <div className="absolute left-[14%] top-[45%] w-[16%] h-[22%] z-10 flex items-center justify-center pointer-events-none">
              <span className="text-[9px] font-bold text-white bg-slate-950/80 px-1.5 py-0.5 rounded shadow border border-slate-700">
                🐔 Kandang Ayam
              </span>
            </div>
            <div className="absolute right-[12%] top-[48%] w-[20%] h-[28%] z-10 flex items-center justify-center pointer-events-none">
              <span className="text-[9px] font-bold text-white bg-slate-950/80 px-1.5 py-0.5 rounded shadow border border-slate-700">
                🐄 Peternakan Sapi
              </span>
            </div>
          </>
        )}

        {/* ================= MAP 3: PANTAI BIRU HOTSPOTS ================= */}
        {currentMap === 'pantai' && (
          <>
            {/* Warp Return Sign to City */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onWarpMap('taman_kota');
              }}
              title="Kembali ke Taman Kota"
              className="absolute right-4 top-4 z-20 px-3 py-1.5 rounded-xl bg-slate-950/90 border-2 border-amber-400 text-[11px] font-extrabold text-amber-300 shadow-xl hover:bg-slate-900 flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105"
            >
              <span>🏛️ Kembali ke Kota</span>
            </button>

            {/* Warp Sign to Farm */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onWarpMap('kebun');
              }}
              title="Pergi ke Kebun Pertanian"
              className="absolute left-4 bottom-5 z-20 px-3 py-1.5 rounded-xl bg-emerald-600/95 hover:bg-emerald-500 text-white font-extrabold text-[11px] shadow-xl border-2 border-emerald-300 flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105 active:scale-95"
            >
              <span>🌾 Ke Kebun ➡️</span>
            </button>

            {/* Wooden Pier Fishing Zone */}
            <div className="absolute left-[24%] top-[52%] w-[24%] h-[26%] z-10 flex flex-col items-center justify-center">
              {!isFishingActive ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartFishing();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-500 via-blue-500 to-sky-600 text-white font-black text-xs shadow-xl hover:scale-105 active:scale-95 transition-transform flex items-center gap-1.5 border-2 border-sky-300 cursor-pointer animate-pulse"
                >
                  <span>🎣 Lempar Pancingan</span>
                </button>
              ) : (
                <div className="px-3 py-1.5 rounded-xl bg-slate-950/90 text-sky-300 text-xs font-bold border border-sky-400 shadow-lg">
                  Sedang Memancing...
                </div>
              )}
            </div>
          </>
        )}

        {/* ================= PLAYERS & ENTITIES LAYER (Y-SORTED & SCALED) ================= */}
        <div className="absolute inset-0 pointer-events-none">
          {visiblePlayers.map((p) => {
            const isMe = p.id === player.id;
            return (
              <div
                key={p.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPlayer(p);
                }}
                className="absolute -translate-x-1/2 -translate-y-[80%] pointer-events-auto cursor-pointer transition-all duration-300 ease-out"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  zIndex: Math.floor(p.y * 10),
                }}
              >
                {/* Now rendered with size="world" for classic authentic AOI chibi size! */}
                <AvatarRenderer
                  avatar={p.avatar}
                  action={p.currentAction}
                  direction={p.direction}
                  bubble={p.bubble}
                  name={p.name}
                  title={p.avatar.title}
                  isCurrentPlayer={isMe}
                  size="world"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
