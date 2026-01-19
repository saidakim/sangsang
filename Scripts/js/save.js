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
                const affinityInfo = parsed.affinity ? `[진행도: ${parsed.affinity}] ` : "";
                slot.innerHTML = `<div><span class="text-indigo-400 font-bold text-xs mr-2">SLOT ${i}</span><span class="text-white text-sm">${affinityInfo}${parsed.sceneName}</span></div>`;
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

async loadFromSlot(slotIndex) {
        const saved = localStorage.getItem(`vn_ultimate_slot_${slotIndex}`);
        if (!saved) return;

        const d = JSON.parse(saved);

        try {
            // 1. 모든 팝업 및 메뉴 레이어 초기화 (가장 중요)
            // 타이틀 메뉴, 커스텀 모달, 엔딩 레이어 등을 모두 숨깁니다.
            document.querySelectorAll('.full-overlay').forEach(el => {
                el.classList.remove('active');
                el.style.display = "none"; 
            });

            // 2. 데이터 복구
            if (d.chapter) {
                await this.story.loadChapter(d.chapter);
            }

            this.story.currentScene = d.scene;
            this.story.affinity = d.affinity;

            // 3. 매니저(육성) 데이터 복구
            if (Manager.setData) {
                Manager.setData(d);
            } else {
                // setData가 없을 경우를 대비한 직접 할당
                Manager.stats = { ...d.stats };
                Manager.day = d.day;
                Manager.updateUI();
            }

            // 4. 장면 데이터 확인
            const sceneData = this.story.scenario[d.scene];

            // 5. 모드에 따른 실행 (핵심)
            // 만약 저장된 장면의 다음 단계가 육성 모드라면 바로 육성 모드로 진입
            if (sceneData && sceneData.next === "GOTO_MANAGEMENT") {
                console.log("육성 모드로 복구합니다.");
                Manager.switchToManagement();
            } else {
                console.log("스토리 모드로 복구합니다.");
                // startGame 내부에서 ui-layer를 보이게 처리하므로 호출
                this.story.startGame();
            }

            UI.showNotice("데이터를 성공적으로 불러왔습니다.");

        } catch (e) {
            console.error("로드 중 오류 발생:", e);
            UI.showNotice("데이터를 불러오는 데 실패했습니다.");
        }
    },
};