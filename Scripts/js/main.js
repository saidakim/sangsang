// js/main.js
// manager.js 또는 전역 공통 함수로 추가
export const UI = {
    showNotice(text, onConfirm) {
        const modal = document.getElementById('notice-modal');
        const textEl = document.getElementById('notice-text');
        const btn = document.getElementById('notice-confirm-btn');

        textEl.innerText = text;
        modal.classList.add('active');

        // 기존 이벤트 제거 후 새로 등록
        btn.onclick = () => {
            modal.classList.remove('active');
            if (onConfirm) onConfirm();
        };
    },
    showHelp() {
        const helpModal = document.getElementById('help-modal');
        if (helpModal) {
            helpModal.classList.add('active');
        } else {
            console.error("help-modal 요소를 찾을 수 없습니다.");
        }
    }
};
// window 객체에 등록하여 어디서든 접근 가능하게 함
window.UI = UI;



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

