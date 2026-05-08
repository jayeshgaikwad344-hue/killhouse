
const SOUNDS = {
  CLICK: 'https://cdn.pixabay.com/audio/2022/03/24/audio_79373d5267.mp3',
  HOVER: 'https://cdn.pixabay.com/audio/2022/03/15/audio_27ed90b2d3.mp3',
  SLIDE: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a73484.mp3',
  TOGGLE_ON: 'https://cdn.pixabay.com/audio/2022/11/15/audio_1e374092b7.mp3',
  TOGGLE_OFF: 'https://cdn.pixabay.com/audio/2022/11/15/audio_6590059c11.mp3',
};

class SoundService {
  private sounds: Map<string, HTMLAudioElement> = new Map();

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        Object.entries(SOUNDS).forEach(([key, url]) => {
          const audio = new Audio(url);
          audio.preload = 'auto';
          this.sounds.set(key, audio);
        });
      } catch (e) {
        console.error('SoundService initialization failed:', e);
      }
    }
  }

  play(soundKey: keyof typeof SOUNDS, volume: number = 0.2) {
    try {
      const audio = this.sounds.get(soundKey);
      if (audio) {
        const clone = audio.cloneNode() as HTMLAudioElement;
        clone.volume = volume;
        clone.play().catch(e => {
          // Normal behavior for browsers blocking autoplay
          if (e.name !== 'NotAllowedError') {
            console.warn(`Sound play for ${soundKey} failed:`, e);
          }
        });
      }
    } catch (e) {
      console.error(`SoundService.play(${soundKey}) error:`, e);
    }
  }
}

export const soundService = new SoundService();
