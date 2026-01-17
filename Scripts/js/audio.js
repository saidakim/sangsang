// js/core/audio.js
export class AudioManager {
  constructor(assets) {
    this.assets = assets;
    this.bgm = new Audio();
    this.bgm.loop = true;
    this.unlocked = false;
    this.sfxPool = [];
  }

  playBGM(name) {
    if (!this.unlocked) return;
    const data = this.assets[name];
    if (!data) return;
    this.bgm.src = data.url;
    this.bgm.volume = data.volume ?? 0.5;
    this.bgm.loop = data.loop ?? true;
    this.bgm.play().catch(()=>{});
  }

  stopBGM() {
    this.bgm.pause();
    this.bgm.currentTime = 0;
  }

  playSFX(name) {
    if (!this.unlocked) return;
    const data = this.assets[name];
    if (!data) return;
    const sfx = new Audio(data.url);
    sfx.volume = data.volume ?? 1;
    sfx.play().catch(()=>{});
  }
}
