export type MapId = 'taman_kota' | 'kebun' | 'pantai';

export type Gender = 'male' | 'female';

export type HairStyle = 'messy' | 'buzz' | 'curls' | 'hijab' | 'twintails' | 'ponytail' | 'spiky';

export type TopOutfit =
  | 'hoodie_orange'
  | 'varsity_red'
  | 'gamer_yellow'
  | 'flannel_pink'
  | 'batik_modern'
  | 'denim_jacket';

export type BottomOutfit = 'jeans_blue' | 'cargo_dark' | 'skirt_green' | 'jogger_black';

export type Headwear = 'none' | 'snapback' | 'beanie' | 'bucket_hat' | 'crown' | 'headphones';

export type Accessory = 'none' | 'glasses' | 'backpack' | 'angel_wings' | 'demon_wings' | 'pet_cat';

export interface AvatarConfig {
  gender: Gender;
  skinColor: string; // e.g. '#f5d0b0', '#e0ac69', '#8d5524'
  hairStyle: HairStyle;
  hairColor: string;
  top: TopOutfit;
  bottom: BottomOutfit;
  hat: Headwear;
  accessory: Accessory;
  title: string;
}

export type PlayerAction = 'idle' | 'walk' | 'fishing' | 'farming' | 'dance' | 'sit';

export interface ChatBubble {
  text: string;
  expiresAt: number;
  emote?: string;
}

export interface Player {
  id: string;
  name: string;
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  targetX?: number;
  targetY?: number;
  direction: 'left' | 'right';
  isMoving: boolean;
  avatar: AvatarConfig;
  map: MapId;
  currentAction: PlayerAction;
  bubble: ChatBubble | null;
  isAiBot?: boolean;
  level: number;
  xu: number;
  luong: number;
  energy: number;
  statusText?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderTitle?: string;
  text: string;
  time: string;
  channel: 'all' | 'map' | 'whisper' | 'system';
  map: MapId;
  emote?: string;
}

export type CropType = 'wortel' | 'tomat' | 'jagung' | 'stroberi';

export interface FarmPlot {
  id: number;
  cropType: CropType | null;
  stage: number; // 0: empty, 1: seed, 2: growing, 3: ready to harvest
  plantedAt: number;
  watered: boolean;
  growDurationSec: number;
}

export interface FishSpecies {
  id: string;
  name: string;
  rarity: 'Biasa' | 'Langka' | 'Legendaris';
  icon: string;
  price: number;
  minWeight: number;
  maxWeight: number;
  description: string;
}

export interface CaughtFish {
  id: string;
  speciesId: string;
  name: string;
  weightKg: number;
  price: number;
  rarity: 'Biasa' | 'Langka' | 'Legendaris';
  caughtAt: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'bibit' | 'hasil_panen' | 'ikan' | 'pancingan' | 'pakaian';
  count: number;
  price: number;
  icon: string;
  description: string;
}
