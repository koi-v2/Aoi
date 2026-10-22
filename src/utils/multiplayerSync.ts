import { Player, ChatMessage } from '../types/game';

type SyncEvent =
  | { type: 'PLAYER_UPDATE'; player: Player }
  | { type: 'CHAT_MESSAGE'; message: ChatMessage }
  | { type: 'PLAYER_DISCONNECT'; playerId: string };

type SyncListener = (event: SyncEvent) => void;

class MultiplayerSync {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<SyncListener> = new Set();

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel('aoi_multiplayer_sync');
        this.channel.onmessage = (event) => {
          this.notify(event.data);
        };
      } catch (err) {
        console.warn('BroadcastChannel error, falling back to local storage', err);
      }
    }

    // Fallback using storage events across tabs
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === 'aoi_sync_event' && e.newValue) {
          try {
            const data = JSON.parse(e.newValue);
            this.notify(data);
          } catch {
            // ignore
          }
        }
      });
    }
  }

  public subscribe(listener: SyncListener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(event: SyncEvent) {
    this.listeners.forEach((listener) => listener(event));
  }

  public broadcastPlayer(player: Player) {
    const event: SyncEvent = { type: 'PLAYER_UPDATE', player };
    if (this.channel) {
      this.channel.postMessage(event);
    }
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('aoi_sync_event', JSON.stringify({ ...event, _t: Date.now() }));
      } catch {
        // ignore
      }
    }
  }

  public broadcastChat(message: ChatMessage) {
    const event: SyncEvent = { type: 'CHAT_MESSAGE', message };
    if (this.channel) {
      this.channel.postMessage(event);
    }
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('aoi_sync_event', JSON.stringify({ ...event, _t: Date.now() }));
      } catch {
        // ignore
      }
    }
  }

  public broadcastDisconnect(playerId: string) {
    const event: SyncEvent = { type: 'PLAYER_DISCONNECT', playerId };
    if (this.channel) {
      this.channel.postMessage(event);
    }
  }
}

export const syncEngine = new MultiplayerSync();
