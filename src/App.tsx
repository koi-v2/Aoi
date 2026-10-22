import React, { useState, useEffect, useRef } from 'react';
import {
  Player,
  MapId,
  ChatMessage,
  FarmPlot,
  CaughtFish,
  CropType,
  AvatarConfig,
  PlayerAction,
} from './types/game';
import { INITIAL_AI_PLAYERS, CROP_CONFIG, FISH_CATALOG } from './data/gameData';
import { GameWorld } from './components/GameWorld';
import { ChatSystem } from './components/ChatSystem';
import { HudBar } from './components/HudBar';
import { TitleScreen } from './components/TitleScreen';
import { BoutiqueModal } from './components/BoutiqueModal';
import { FishingModal } from './components/FishingModal';
import { FarmModal } from './components/FarmModal';
import { InventoryModal } from './components/InventoryModal';
import { AiPhotoStudioModal } from './components/AiPhotoStudioModal';
import { ProfileModal } from './components/ProfileModal';
import { syncEngine } from './utils/multiplayerSync';
import { sounds } from './utils/audio';
import { resolveWalkPosition } from './utils/collision';

export default function App() {
  const [gameState, setGameState] = useState<'TITLE_SCREEN' | 'PLAYING'>('TITLE_SCREEN');
  const [currentMap, setCurrentMap] = useState<MapId>('taman_kota');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Modals state
  const [showBoutique, setShowBoutique] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showFishing, setShowFishing] = useState(false);
  const [showPhotoStudio, setShowPhotoStudio] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedFarmPlot, setSelectedFarmPlot] = useState<FarmPlot | null>(null);

  // Player state
  const [player, setPlayer] = useState<Player>({
    id: `player_${Math.random().toString(36).substring(2, 9)}`,
    name: 'AvatarSultan',
    x: 50,
    y: 68,
    direction: 'right',
    isMoving: false,
    map: 'taman_kota',
    currentAction: 'idle',
    bubble: null,
    level: 1,
    xu: 12500,
    luong: 50,
    energy: 100,
    avatar: {
      gender: 'male',
      skinColor: '#f5d0b0',
      hairStyle: 'messy',
      hairColor: '#171717',
      top: 'varsity_red',
      bottom: 'jeans_blue',
      hat: 'snapback',
      accessory: 'backpack',
      title: 'Warga Baru AOI',
    },
  });

  // Other online players (NPCs + real tabs)
  const [otherPlayers, setOtherPlayers] = useState<Player[]>(INITIAL_AI_PLAYERS);

  // Chat messages
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      senderId: 'sys',
      senderName: 'Pengumuman AOI',
      text: 'Selamat datang di Dunia Avatar Online Indonesia 2D! Selamat bernostalgia.',
      time: '00:00',
      channel: 'system',
      map: 'taman_kota',
    },
    {
      id: 'msg_1',
      senderId: 'bot_budi',
      senderName: 'Budi_Santuy',
      senderTitle: 'Anak Tongkrongan',
      text: 'Woy nongkrong di air mancur yok ramean wkwk',
      time: '00:01',
      channel: 'all',
      map: 'taman_kota',
    },
  ]);

  // Farming state (6 plots on Kebun)
  const [farmPlots, setFarmPlots] = useState<FarmPlot[]>([
    { id: 0, cropType: 'wortel', stage: 2, plantedAt: Date.now() - 8000, watered: true, growDurationSec: 15 },
    { id: 1, cropType: 'tomat', stage: 3, plantedAt: Date.now() - 30000, watered: true, growDurationSec: 25 },
    { id: 2, cropType: null, stage: 0, plantedAt: 0, watered: false, growDurationSec: 0 },
    { id: 3, cropType: 'jagung', stage: 1, plantedAt: Date.now() - 5000, watered: false, growDurationSec: 40 },
    { id: 4, cropType: null, stage: 0, plantedAt: 0, watered: false, growDurationSec: 0 },
    { id: 5, cropType: null, stage: 0, plantedAt: 0, watered: false, growDurationSec: 0 },
  ]);

  // Inventory state
  const [playerSeeds, setPlayerSeeds] = useState<Record<CropType, number>>({
    wortel: 5,
    tomat: 3,
    jagung: 2,
    stroberi: 1,
  });

  const [playerHarvest, setPlayerHarvest] = useState<Record<CropType, number>>({
    wortel: 2,
    tomat: 1,
    jagung: 0,
    stroberi: 0,
  });

  const [caughtFish, setCaughtFish] = useState<CaughtFish[]>([
    {
      id: 'fish_init_1',
      speciesId: 'cupang',
      name: 'Ikan Cupang Hias',
      weightKg: 0.15,
      price: 85,
      rarity: 'Biasa',
      caughtAt: '08:15',
    },
  ]);

  // Synchronize across tabs
  useEffect(() => {
    const unsubscribe = syncEngine.subscribe((event) => {
      if (event.type === 'PLAYER_UPDATE') {
        if (event.player.id === player.id) return;
        setOtherPlayers((prev) => {
          const exists = prev.some((p) => p.id === event.player.id);
          if (exists) {
            return prev.map((p) => (p.id === event.player.id ? event.player : p));
          } else {
            return [...prev, event.player];
          }
        });
      } else if (event.type === 'CHAT_MESSAGE') {
        setMessages((prev) => [...prev, event.message]);
        // Also show bubble on sender
        setOtherPlayers((prev) =>
          prev.map((p) =>
            p.id === event.message.senderId
              ? {
                  ...p,
                  bubble: {
                    text: event.message.text,
                    expiresAt: Date.now() + 6000,
                    emote: event.message.emote,
                  },
                }
              : p
          )
        );
      } else if (event.type === 'PLAYER_DISCONNECT') {
        setOtherPlayers((prev) => prev.filter((p) => p.id !== event.playerId));
      }
    });

    return () => {
      unsubscribe();
    };
  }, [player.id]);

  // Broadcast player position and status on change
  useEffect(() => {
    if (gameState === 'PLAYING') {
      syncEngine.broadcastPlayer(player);
    }
  }, [player.x, player.y, player.map, player.currentAction, gameState]);

  // Autonomous Bot movements and interactions
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const interval = setInterval(() => {
      setOtherPlayers((prev) =>
        prev.map((bot) => {
          if (!bot.isAiBot) return bot;

          // Occasionally walk slightly within map
          if (Math.random() < 0.35) {
            const dx = (Math.random() - 0.5) * 12;
            const dy = (Math.random() - 0.5) * 10;
            const proposedX = Math.max(10, Math.min(90, bot.x + dx));
            const proposedY = Math.max(25, Math.min(88, bot.y + dy));
            const resolved = resolveWalkPosition(bot.map, proposedX, proposedY, bot.x, bot.y);
            const newX = resolved.x;
            const newY = resolved.y;
            const newDir = newX < bot.x ? 'left' : 'right';

            return {
              ...bot,
              x: newX,
              y: newY,
              direction: newDir,
              currentAction: 'walk',
            };
          } else {
            return {
              ...bot,
              currentAction: bot.currentAction === 'dance' || bot.currentAction === 'fishing' ? bot.currentAction : 'idle',
            };
          }
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [gameState]);

  // Farm growth ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setFarmPlots((prev) =>
        prev.map((plot) => {
          if (!plot.cropType || plot.stage >= 3) return plot;
          const info = CROP_CONFIG[plot.cropType];
          const elapsed = (Date.now() - plot.plantedAt) / 1000;
          const effectiveDuration = plot.watered ? info.growSec * 0.75 : info.growSec;

          if (elapsed >= effectiveDuration) {
            return { ...plot, stage: 3 };
          } else if (elapsed >= effectiveDuration * 0.45) {
            return { ...plot, stage: 2 };
          }
          return plot;
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Keyboard navigation (WASD & Arrow Keys)
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in chat input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      let dx = 0;
      let dy = 0;
      let dir: 'left' | 'right' = player.direction;

      if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') dy -= 3;
      if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') dy += 3;
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
        dx -= 3.5;
        dir = 'left';
      }
      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
        dx += 3.5;
        dir = 'right';
      }

      if (dx !== 0 || dy !== 0) {
        e.preventDefault();
        sounds.playStep();
        setPlayer((prev) => {
          const next = resolveWalkPosition(
            currentMap,
            Math.max(8, Math.min(92, prev.x + dx)),
            Math.max(20, Math.min(90, prev.y + dy)),
            prev.x,
            prev.y,
          );
          return {
            ...prev,
            x: next.x,
            y: next.y,
            direction: dir,
            currentAction: 'walk',
          };
        });

        // Return to idle after movement stops
        setTimeout(() => {
          setPlayer((prev) => (prev.currentAction === 'walk' ? { ...prev, currentAction: 'idle' } : prev));
        }, 300);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, player.direction, currentMap]);

  // Movement handler from click
  const handleMovePlayer = (newX: number, newY: number) => {
    setPlayer((prev) => {
      const next = resolveWalkPosition(currentMap, newX, newY, prev.x, prev.y);
      return {
        ...prev,
        x: next.x,
        y: next.y,
        direction: next.x < prev.x ? 'left' : 'right',
        currentAction: 'walk',
      };
    });

    setTimeout(() => {
      setPlayer((prev) => (prev.currentAction === 'walk' ? { ...prev, currentAction: 'idle' } : prev));
    }, 450);
  };

  // Warp map handler
  const handleWarpMap = (targetMap: MapId) => {
    sounds.playLevelUp();
    setCurrentMap(targetMap);

    const spawnPositions: Record<MapId, { x: number; y: number; msg: string }> = {
      taman_kota: { x: 50, y: 65, msg: 'Kembali ke Taman Kota! 🏛️' },
      kebun: { x: 50, y: 74, msg: 'Waktunya berkebun & panen! 🌾' },
      pantai: { x: 38, y: 65, msg: 'Asiknya suasana pantai & laut! 🏖️' },
    };

    const spawn = spawnPositions[targetMap];

    setPlayer((prev) => ({
      ...prev,
      map: targetMap,
      x: spawn.x,
      y: spawn.y,
      currentAction: 'idle',
      bubble: { text: spawn.msg, expiresAt: Date.now() + 3500 },
    }));

    // System announce
    const warpMsg: ChatMessage = {
      id: `sys_${Date.now()}`,
      senderId: 'sys',
      senderName: 'Sistem AOI',
      text: `${player.name} berpindah ke ${
        targetMap === 'taman_kota' ? 'Taman Kota Jakarta' : targetMap === 'kebun' ? 'Kebun & Ternak Makmur' : 'Pantai Biru Pesisir'
      }.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      channel: 'system',
      map: targetMap,
    };
    setMessages((prev) => [...prev, warpMsg]);
  };

  // Chat message sending
  const handleSendMessage = (text: string, emote?: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msg: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      senderId: player.id,
      senderName: player.name,
      senderTitle: player.avatar.title,
      text,
      time,
      channel: 'all',
      map: currentMap,
      emote,
    };

    setMessages((prev) => [...prev, msg]);
    syncEngine.broadcastChat(msg);

    // Show bubble on player head
    setPlayer((prev) => ({
      ...prev,
      bubble: { text, expiresAt: Date.now() + 6500, emote },
    }));

    // Auto-clear bubble after timeout
    setTimeout(() => {
      setPlayer((prev) => (prev.bubble?.text === text ? { ...prev, bubble: null } : prev));
    }, 6500);

    // Smart conversational response from Indonesian NPC bots
    setTimeout(() => {
      const lower = text.toLowerCase();
      let botResponse = '';
      let botSender = otherPlayers.find((p) => p.map === currentMap && p.isAiBot);

      if (!botSender) return;

      if (lower.includes('halo') || lower.includes('sapa') || lower.includes('assalamualaikum')) {
        botResponse = `Halo juga ${player.name}! Salam kenal bro (≧◡≦)`;
      } else if (lower.includes('mancing') || lower.includes('ikan')) {
        botResponse = 'Yuk ke dermaga pantai! Tadi ada yg dapet Arowana Super Red lho!';
      } else if (lower.includes('koin') || lower.includes('xu') || lower.includes('sultan')) {
        botResponse = 'Wkwkwk mau jadi sultan? Rajin panen jagung sama mancing di pantai!';
      } else if (lower.includes('baju') || lower.includes('outfit') || lower.includes('keren')) {
        botResponse = 'Outfit lu kece parah bang! Beli di Butik Taman Kota ya?';
      } else if (lower.includes('wkwk') || lower.includes('haha') || lower.includes('lucu')) {
        botResponse = 'Wkwkwk ngakak abiezz! Seru emang nongkrong di AOI.';
      }

      if (botResponse) {
        const replyMsg: ChatMessage = {
          id: `msg_reply_${Date.now()}`,
          senderId: botSender.id,
          senderName: botSender.name,
          senderTitle: botSender.avatar.title,
          text: botResponse,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          channel: 'map',
          map: currentMap,
        };
        sounds.playPop();
        setMessages((prev) => [...prev, replyMsg]);
        setOtherPlayers((prev) =>
          prev.map((p) =>
            p.id === botSender!.id
              ? { ...p, bubble: { text: botResponse, expiresAt: Date.now() + 6000 } }
              : p
          )
        );
      }
    }, 1400);
  };

  // Trigger emote action
  const handleTriggerAction = (action: PlayerAction, emote?: string) => {
    setPlayer((prev) => ({
      ...prev,
      currentAction: action,
      bubble: emote ? { text: emote, expiresAt: Date.now() + 4000, emote } : prev.bubble,
    }));

    if (action === 'dance' || action === 'sit') {
      setTimeout(() => {
        setPlayer((prev) => ({ ...prev, currentAction: 'idle' }));
      }, 5000);
    }
  };

  // Farming actions
  const handlePlantSeed = (plotId: number, crop: CropType) => {
    if (playerSeeds[crop] <= 0) return;
    setPlayerSeeds((prev) => ({ ...prev, [crop]: prev[crop] - 1 }));
    setFarmPlots((prev) =>
      prev.map((p) =>
        p.id === plotId
          ? {
              ...p,
              cropType: crop,
              stage: 1,
              plantedAt: Date.now(),
              watered: false,
              growDurationSec: CROP_CONFIG[crop].growSec,
            }
          : p
      )
    );
  };

  const handleWaterPlot = (plotId: number) => {
    setFarmPlots((prev) => prev.map((p) => (p.id === plotId ? { ...p, watered: true } : p)));
  };

  const handleHarvestPlot = (plot: FarmPlot) => {
    if (!plot.cropType) return;
    const crop = plot.cropType;
    const cropInfo = CROP_CONFIG[crop];

    setPlayerHarvest((prev) => ({ ...prev, [crop]: (prev[crop] || 0) + 1 }));
    setPlayer((prev) => ({
      ...prev,
      xu: prev.xu + cropInfo.sellPrice,
      level: Math.floor((prev.xu + cropInfo.sellPrice) / 1000) + 1,
    }));

    setFarmPlots((prev) =>
      prev.map((p) => (p.id === plot.id ? { ...p, cropType: null, stage: 0, watered: false } : p))
    );
  };

  // Fishing catch
  const handleCatchFish = (fish: CaughtFish) => {
    setCaughtFish((prev) => [fish, ...prev]);
    setPlayer((prev) => ({
      ...prev,
      xu: prev.xu + Math.round(fish.price * 0.4),
      energy: Math.max(0, prev.energy - 5),
    }));
  };

  // Shop / Inventory
  const handleBuySeed = (crop: CropType, count: number) => {
    const cost = CROP_CONFIG[crop].seedPrice * count;
    if (player.xu < cost) return;
    setPlayer((prev) => ({ ...prev, xu: prev.xu - cost }));
    setPlayerSeeds((prev) => ({ ...prev, [crop]: (prev[crop] || 0) + count }));
  };

  const handleSellProduce = (crop: CropType, count: number) => {
    if ((playerHarvest[crop] || 0) < count) return;
    const earnings = CROP_CONFIG[crop].sellPrice * count;
    setPlayerHarvest((prev) => ({ ...prev, [crop]: prev[crop] - count }));
    setPlayer((prev) => ({ ...prev, xu: prev.xu + earnings }));
  };

  const handleSellFish = (fishId: string) => {
    const target = caughtFish.find((f) => f.id === fishId);
    if (!target) return;
    setPlayer((prev) => ({ ...prev, xu: prev.xu + target.price }));
    setCaughtFish((prev) => prev.filter((f) => f.id !== fishId));
  };

  const handleSellAllFish = () => {
    const total = caughtFish.reduce((acc, f) => acc + f.price, 0);
    setPlayer((prev) => ({ ...prev, xu: prev.xu + total }));
    setCaughtFish([]);
  };

  // Warung snack
  const handleBuySnack = () => {
    if (player.xu < 100) {
      alert('Koin Xu tidak cukup untuk beli kopi!');
      return;
    }
    sounds.playCoin();
    setPlayer((prev) => ({
      ...prev,
      xu: prev.xu - 100,
      energy: Math.min(100, prev.energy + 35),
      bubble: { text: 'Nyeruput Es Kopi & Gorengan hangat! Segar!', expiresAt: Date.now() + 4000 },
    }));
  };

  // Fountain wish
  const handleMakeWishFountain = () => {
    sounds.playSplash();
    const luckyReward = Math.random() > 0.4 ? 250 : 50;
    setPlayer((prev) => ({
      ...prev,
      xu: prev.xu + luckyReward,
      energy: Math.min(100, prev.energy + 15),
      bubble: { text: `✨ Hoki Air Mancur! Dapat 🪙 ${luckyReward} Xu & +15 Energi!`, expiresAt: Date.now() + 4500 },
    }));
  };

  if (gameState === 'TITLE_SCREEN') {
    return (
      <TitleScreen
        onStartGame={(name, avatar) => {
          setPlayer((prev) => ({ ...prev, name, avatar }));
          setGameState('PLAYING');
        }}
      />
    );
  }

  return (
    <div className="relative w-screen h-screen bg-slate-950 flex flex-col items-center justify-between overflow-hidden p-2 sm:p-4 font-sans">
      {/* Top HUD Status Bar */}
      <div className="w-full max-w-6xl">
        <HudBar
          player={player}
          currentMap={currentMap}
          soundEnabled={soundEnabled}
          onToggleSound={() => {
            setSoundEnabled(!soundEnabled);
            sounds.enabled = !soundEnabled;
          }}
          onWarpMap={handleWarpMap}
          onOpenBoutique={() => setShowBoutique(true)}
          onOpenInventory={() => setShowInventory(true)}
          onOpenPhotoStudio={() => setShowPhotoStudio(true)}
          onOpenProfile={() => setShowProfile(true)}
          onTriggerAction={handleTriggerAction}
        />
      </div>

      {/* Main Interactive 2D World Playfield */}
      <div className="relative w-full flex-1 flex items-center justify-center my-1">
        <GameWorld
          currentMap={currentMap}
          player={player}
          otherPlayers={otherPlayers}
          farmPlots={farmPlots}
          onMovePlayer={handleMovePlayer}
          onSelectPlayer={(p) => {
            sounds.playPop();
            setPlayer((prev) => ({
              ...prev,
              bubble: { text: `Menyapa ${p.name}! 👋`, expiresAt: Date.now() + 3000 },
            }));
          }}
          onInteractFarmPlot={(plot) => setSelectedFarmPlot(plot)}
          onStartFishing={() => setShowFishing(true)}
          onOpenBoutique={() => setShowBoutique(true)}
          onWarpMap={handleWarpMap}
          onMakeWishFountain={handleMakeWishFountain}
          onBuySnack={handleBuySnack}
          isFishingActive={showFishing}
        />
      </div>

      {/* Bottom Real-time Chat Bar */}
      <div className="w-full max-w-4xl z-20">
        <ChatSystem
          messages={messages}
          currentMap={currentMap}
          onSendMessage={handleSendMessage}
        />
      </div>

      {/* Modals */}
      {showBoutique && (
        <BoutiqueModal
          currentAvatar={player.avatar}
          playerXu={player.xu}
          onSaveAvatar={(newAvatar, cost) => {
            setPlayer((prev) => ({
              ...prev,
              avatar: newAvatar,
              xu: prev.xu - cost,
              bubble: { text: 'Tampil gaya baru di AOI! ✨', expiresAt: Date.now() + 4000 },
            }));
          }}
          onClose={() => setShowBoutique(false)}
        />
      )}

      {showInventory && (
        <InventoryModal
          items={[]}
          caughtFish={caughtFish}
          playerXu={player.xu}
          playerSeeds={playerSeeds}
          playerHarvest={playerHarvest}
          onBuySeed={handleBuySeed}
          onSellProduce={handleSellProduce}
          onSellFish={handleSellFish}
          onSellAllFish={handleSellAllFish}
          onClose={() => setShowInventory(false)}
        />
      )}

      {showFishing && (
        <FishingModal
          onCatchSuccess={handleCatchFish}
          onClose={() => setShowFishing(false)}
        />
      )}

      {selectedFarmPlot && (
        <FarmModal
          plot={selectedFarmPlot}
          playerSeeds={playerSeeds}
          onPlant={handlePlantSeed}
          onWater={handleWaterPlot}
          onHarvest={handleHarvestPlot}
          onClose={() => setSelectedFarmPlot(null)}
        />
      )}

      {showPhotoStudio && (
        <AiPhotoStudioModal onClose={() => setShowPhotoStudio(false)} />
      )}

      {showProfile && (
        <ProfileModal
          player={player}
          onUpdateName={(newName) => setPlayer((prev) => ({ ...prev, name: newName }))}
          onClose={() => setShowProfile(false)}
        />
      )}
    </div>
  );
}
