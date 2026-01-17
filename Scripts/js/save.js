// save.js

import { scenario } from "./scenario.js";
import { Manager } from "./manager.js"; // [수정] Manager를 직접 임포트

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
                // 슬롯 이름에 현재 날짜 정보도 표시하면 더 좋음
                const dayInfo = parsed.day ? `[Day ${parsed.day}] ` : "";
                slot.innerHTML = `<div><span class="text-indigo-400 font-bold text-xs mr-2">SLOT ${i}</span><span class="text-white text-sm">${dayInfo}${parsed.sceneName}</span></div>`;
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

        const saveData = {
            scene: this.story.currentScene,
            affinity: this.story.affinity,
            sceneName: (data.text || "진행 중").substring(0, 15),
            // [추가] 스텟 및 날짜 저장
            stats: Manager.stats,
            day: Manager.day
        };

        localStorage.setItem(`vn_ultimate_slot_${slotIndex}`, JSON.stringify(saveData));
        console.log(`슬롯 ${slotIndex}에 데이터 저장 완료:`, saveData);
    }, 

    loadFromSlot(slotIndex) {
        const saved = localStorage.getItem(`vn_ultimate_slot_${slotIndex}`);
        if (saved) {
            const d = JSON.parse(saved);
            
            // 1. 스토리 정보 복구
            this.story.currentScene = d.scene;
            this.story.affinity = d.affinity;

            // 2. [수정] Manager의 안전한 데이터 설정 함수 호출
            Manager.setData(d);

            // 3. 게임 시작
            this.story.startGame();
            
            // [추가] 만약 육성 모드 중간에 저장했다면 육성 화면을 띄워줘야 할 수도 있음
            const currentData = scenario[d.scene];
            if (currentData && currentData.next === "GOTO_MANAGEMENT") {
                Manager.switchToManagement();
            }
            
            console.log("로드 완료:", d);
        }
    }
};