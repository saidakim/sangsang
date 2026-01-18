// save.js

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
        // 현재 로드된 시나리오 데이터를 통해 장면 텍스트 추출
        const currentData = this.story.scenario[this.story.currentScene];
        
        const saveData = {
            chapter: this.story.currentChapter, // [추가] 현재 어떤 챕터 파일인지 저장
            scene: this.story.currentScene,
            affinity: this.story.affinity,
            sceneName: (currentData.text || "진행 중").substring(0, 15),
            stats: Manager.stats,
            day: Manager.day,
            saveDate: new Date().toLocaleString() // [추가] 저장 일시 (UI 표시용)
        };

        localStorage.setItem(`vn_ultimate_slot_${slotIndex}`, JSON.stringify(saveData));
        UI.showNotice(`슬롯 ${slotIndex}에 저장되었습니다.`);
    }, 

    async loadFromSlot(slotIndex) { // [수정] async 추가
        const saved = localStorage.getItem(`vn_ultimate_slot_${slotIndex}`);
        if (!saved) return;

        const d = JSON.parse(saved);

        try {
            // 1. [핵심] 저장된 챕터 파일부터 먼저 로드한다.
            if (d.chapter) {
                await this.story.loadChapter(d.chapter);
            }

            // 2. 스토리 정보 복구
            this.story.currentScene = d.scene;
            this.story.affinity = d.affinity;

            // 3. 매니저(육성) 데이터 복구
            Manager.setData(d);

            // 4. UI 복구 및 시작
            // 만약 육성 모드 상태에서 저장했다면 육성 화면으로, 아니면 스토리로
            const sceneData = this.story.scenario[d.scene];
            if (sceneData && sceneData.next === "GOTO_MANAGEMENT") {
                Manager.switchToManagement();
            } else {
                this.story.startGame();
            }

            UI.showNotice("데이터를 성공적으로 불러왔습니다.");

        } catch (e) {
            console.error("로드 중 오류 발생:", e);
            UI.showNotice("데이터를 불러오는 데 실패했습니다.");
        }
    }
};