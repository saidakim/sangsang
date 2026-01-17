
import { scenario } from "./scenario.js";

export const Save = {
    story: null,





    openSaveMenu() { this.showSlotMenu("저장할 슬롯을 선택하세요", (slotIndex) => this.saveToSlot(slotIndex)); },
    openLoadMenu() { this.showSlotMenu("불러올 슬롯을 선택하세요", (slotIndex) => this.loadFromSlot(slotIndex)); },
    showSlotMenu(title, callback) {
        const modal = document.getElementById('custom-modal');
        document.getElementById('modal-title').innerText = title;
        const slotList = document.getElementById('slot-list');
        slotList.innerHTML = "";
        for (let i = 1; i <= 3; i++) {
            const savedData = localStorage.getItem(`vn_ultimate_slot_${i}`);
            const slot = document.createElement('div');
            slot.className = "slot-item";
            if (savedData) {
                const parsed = JSON.parse(savedData);
                slot.innerHTML = `<div><span class="text-indigo-400 font-bold text-xs mr-2">SLOT ${i}</span><span class="text-white text-sm">${parsed.sceneName}</span></div>`;
            } else { slot.innerHTML = `<span class="text-gray-600 font-bold">SLOT ${i} EMPTY</span>`; }
            slot.onclick = () => { modal.classList.remove('active'); callback(i); };
            slotList.appendChild(slot);
        }
        const btnContainer = document.getElementById('modal-buttons');
        btnContainer.innerHTML = `<button class="text-gray-500" onclick="document.getElementById('custom-modal').classList.remove('active')">CANCEL</button>`;
        modal.classList.add('active');
    },
    saveToSlot(slotIndex) {
        const data = scenario[this.story.currentScene];
        localStorage.setItem(`vn_ultimate_slot_${slotIndex}`, JSON.stringify({ 
            scene: this.story.currentScene, affinity: this.story.affinity, sceneName: (data.text || "진행 중").substring(0, 15)
        }));
    }, 
    loadFromSlot(slotIndex) {
        const saved = localStorage.getItem(`vn_ultimate_slot_${slotIndex}`);
        if (saved) { const d = JSON.parse(saved); this.story.currentScene = d.scene; this.story.affinity = d.affinity; this.story.startGame(); }
    }
};