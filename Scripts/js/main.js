// js/main.js
import { Story } from "./story.js";
import { Save } from "./save.js";
import { assets } from "./assets.js";
import { AudioManager } from "./audio.js";
import { preloadImages } from "./preload.js";
import { Manager } from "./manager.js";
Story.audioManager = new AudioManager(assets.audio);
Save.story = Story;
Manager.Story = Story;
Story.Manager = Manager;
Story.init();
window.unlockAudioGate = function () {
  Story.audioManager.unlocked = true;


  const silent = new Audio();
  silent.src = "data:audio/mp3;base64,//uQZAAAAAAAAAAAAAAAAAAAA";
  silent.volume = 0;
  silent.play().catch(() => {});

  preloadImages(assets.images, () => {
    document.getElementById("audio-gate").classList.remove("active");
    Story.resetToMenu();
  });
};
window.Story = Story;
window.Save = Save;
window.Manager = Manager;

