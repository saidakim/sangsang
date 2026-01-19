
export const Manager = {
    // 기본값 설정 (초기화 시 사용할 값들)
    defaultStats: { social: 10, vocab: 10, charm: 10, stress: 0 },
    stats: { social: 10, vocab: 10, charm: 10, stress: 0 },
    day: 1,
    affinity_flag: false,
    // [추가] 스텟 및 날짜 초기화 함수
    reset() {
        console.log("매니저 데이터 초기화");
        this.stats = { ...this.defaultStats }; // 복사본으로 초기화
        this.day = 1;
        this.updateUI();
    },

    // [추가] 데이터 강제 설정 함수 (로드용)
    setData(data) {
        if (data.stats) this.stats = { ...data.stats };
        if (data.day) this.day = data.day;
        this.updateUI();
    },

    updateUI() {
        // null 체크 추가 (UI가 없을 때 에러 방지)
        const sSocial = document.getElementById('stat-social');
        if (sSocial) sSocial.innerText = this.stats.social;
        
        const sVocab = document.getElementById('stat-vocab');
        if (sVocab) sVocab.innerText = this.stats.vocab;
        
        const sCharm = document.getElementById('stat-charm');
        if (sCharm) sCharm.innerText = this.stats.charm;
        
        const sStress = document.getElementById('stat-stress');
        if (sStress) sStress.innerText = this.stats.stress;
        
        const cDay = document.getElementById('current-day');
        if (cDay) cDay.innerText = `DAY ${this.day}`;
    },
    
    activities: [
        { name: "운동장 파이 외우기", effect: { vocab: 5, stress: -10 }, desc: "어휘력 상승, 스트레스 하강" },
        { name: "길냥이 밥 주기", effect: { charm: 5, social: 2 }, desc: "매력 상승, 사회성 조금 상승" },
        { name: "뻐끔", effect: { stress: -1 }, desc: "스트레스 소폭 감소" },
        { name: "동아리 면접 연습", effect: { social: 7, stress: 5 }, desc: "사회성 상승, 스트레스 상승" },
        { name: "스도쿠 풀기", effect: { charm: 7, stress: 5 }, desc: "매력 상승, 스트레스 상승" },
        { name: "길냥이 밥 뺏기", effect: { social: -5, stress: -10 }, desc: "사회성 하강, 스트레스 하강" },
        { name: "샤워실 풍차돌리기", effect: { stress: 20, social: -15 }, desc: "스트레스 대폭 증가, 사회성 급락" },
        { name: "지오데시 OST 완창", effect: { vocab: 3, stress: 5 }, desc: "뚠뚠뚠뚠! 리듬감과 어휘력 상승" },
        { name: "김주헌 계정 해킹 시도", effect: { charm: 10, stress: 15 }, desc: "복수심으로 지력 상승, 검거 위협에 스트레스 상승" },
        { name: "교수님께 냥코 설명하기", effect: { social: 10, charm: -10 }, desc: "사회성 상승, 교수님의 신뢰도 하강" },
        { name: "참새와 영공 대결", effect: { stress: -10, vocab: 2 }, desc: "스트레스 해소, 조류 어휘력 습득" }
        
    ],
    // manager.js

    showActivities() {
        console.log("활동하기 UI 출력 시도...");
        const choiceContainer = document.getElementById('choice-container');
        
        // 1. 기존 내용(비주얼 노벨 선택지 등) 완전히 비우기
        choiceContainer.innerHTML = "";
        
        // 2. 제목 추가
        const title = document.createElement('h2');
        title.className = "text-white text-2xl font-bold mb-6 drop-shadow-lg";
        title.innerText = "오늘의 활동 (3가지 추천)";
        choiceContainer.appendChild(title);

        // 3. 무작위 활동 3개 선정
        const shuffled = [...this.activities].sort(() => 0.5 - Math.random()).slice(0, 3);
        
        shuffled.forEach(act => {
            const btn = document.createElement('button');
            btn.className = "choice-btn w-[450px] mb-4 py-4 px-6 bg-indigo-900/90 border border-indigo-400 hover:bg-indigo-600 transition-all text-left flex flex-col";
            btn.innerHTML = `
                <span class="text-white font-bold text-lg">${act.name}</span>
                <span class="text-indigo-200 text-xs mt-1">${act.desc}</span>
            `;
            btn.onclick = (e) => {
                e.stopPropagation(); // 이벤트 전파 방지
                this.doActivity(act);
            };
            choiceContainer.appendChild(btn);
        });

        // 4. 취소 버튼 (선택 사항)
        const cancelBtn = document.createElement('button');
        cancelBtn.className = "mt-4 text-gray-400 hover:text-white text-sm underline";
        cancelBtn.innerText = "돌아가기";
        cancelBtn.onclick = () => {
            choiceContainer.classList.add('hidden');
            choiceContainer.style.display = "none";
        };
        choiceContainer.appendChild(cancelBtn);

        // 5. [핵심] 시각화
        choiceContainer.classList.remove('hidden');
        choiceContainer.style.display = "flex";
        
        console.log("UI 출력 완료 - 현재 컨테이너 상태:", choiceContainer.style.display);
    },

    doActivity(act) {
        console.log(`${act.name} 수행 완료`);
        // 스텟 계산
        for (let key in act.effect) {
            this.stats[key] = (this.stats[key] || 0) + act.effect[key];
        }
        
        // UI 닫기
        document.getElementById('choice-container').classList.add('hidden');
        document.getElementById('choice-container').style.display = "none";
        
        this.nextStep();
    },

// manager.js

    closePhone() {
        console.warn("--- closePhone 함수 진입 ---"); // 눈에 띄게 경고창으로 표시
        const phoneLayer = document.getElementById('phone-layer');
        
        if (!phoneLayer) {
            console.error("phone-layer를 찾을 수 없습니다!");
            return;
        }

        // UI 숨기기
        phoneLayer.classList.remove('active');
        phoneLayer.style.display = "none";
        
        console.log("폰 화면 닫기 완료");

        // 다음 단계 실행
        this.nextStep();
    },

    startPhoneComm() {
        console.log("폰 화면 열기");
        const phoneLayer = document.getElementById('phone-layer');
        const chat = document.getElementById('chat-content');
        chat.innerHTML = ""; // 이전 대화 비우기
        
        // 스텟에 따른 메시지 분기
        if (this.stats.social <= 10) {
            this.addChatMessage("나", "야이 씨발련아.");
            this.addChatMessage("장가희", "...?");
            if (this.Story.affinity != -100)
            {
                this.Story.affinity = -100;
                this.affinity_flag = true;
            } 
        }
        else if (this.stats.social > 10 && this.stats.vocab > 5 && this.stats.charm > 10 && (this.stats.social <= 25 || this.stats.vocab <= 20 || this.stats.charm <= 25)) {
            this.addChatMessage("나", "ㅇ");
            this.addChatMessage("장가희", "...?");
            if (this.Story.affinity != 10)
            {
                this.Story.affinity = 10;
                this.affinity_flag = true;
            } 
        } 
        else if (this.stats.social > 25 && this.stats.vocab > 20 && this.stats.charm > 25 && (this.stats.social <= 45 || this.stats.vocab <= 40 || this.stats.charm <= 45)) {
            this.addChatMessage("나", "ㅎㅇ");
            this.addChatMessage("장가희", "...?");
            if (this.Story.affinity != 20)
            {
                this.Story.affinity = 20;
                this.affinity_flag = true;
            } 
        } 
        else if (this.stats.social > 45 && this.stats.vocab > 40 && this.stats.charm > 45 && (this.stats.social <= 70 || this.stats.vocab <= 60 || this.stats.charm <= 70)) {
            this.addChatMessage("나", "ㅎㅇ");
            this.addChatMessage("장가희", "...ㅎㅇ?");
            if (this.Story.affinity != 30)
            {
                this.Story.affinity = 30;
                this.affinity_flag = true;
            } 
        } 
        else if (this.stats.social > 70 && this.stats.vocab > 60 && this.stats.charm > 70 && (this.stats.social <= 95 || this.stats.vocab <= 85 || this.stats.charm <= 95)) {
            this.addChatMessage("나", "하이");
            this.addChatMessage("장가희", "하이!");
            if (this.Story.affinity != 40)
            {
                this.Story.affinity = 40;
                this.affinity_flag = true;
            } 
        } 
        else if (this.stats.social > 95 && this.stats.vocab > 85 && this.stats.charm > 95 && (this.stats.social <= 120 || this.stats.vocab <= 110 || this.stats.charm <= 120)) {
            this.addChatMessage("나", "본인 방금 조졸하는 상상함 ㅋㅋ");
            this.addChatMessage("장가희", "하지만어립도 없지 ㅋㅋ");
            if (this.Story.affinity != 50)
            {
                this.Story.affinity = 50;
                this.affinity_flag = true;
            } 
        } 
        else if (this.stats.social > 120 && this.stats.vocab > 110 && this.stats.charm > 120 && (this.stats.social <= 145 || this.stats.vocab <= 135 || this.stats.charm <= 145)) {
            this.addChatMessage("나", "본인 방금 조졸하는 상상함 ㅋㅋ");
            this.addChatMessage("장가희", "하지만어립도 없지 ㅋㅋ");
            if (this.Story.affinity != 60)
            {
                this.Story.affinity = 60;
                this.affinity_flag = true;
            } 
        } 
        else if (this.stats.social > 145 && this.stats.vocab > 135 && this.stats.charm > 145 && (this.stats.social <= 170 || this.stats.vocab <= 160 || this.stats.charm <= 170)) {
            this.addChatMessage("나", "버거킹?");
            this.addChatMessage("장가희", "ㄱㄱㄱㄱ");
            if (this.Story.affinity != 70)
            {
                this.Story.affinity = 70;
                this.affinity_flag = true;
            } 
        } 
        else if (this.stats.social > 170 && this.stats.vocab > 160 && this.stats.charm > 170 && (this.stats.social <= 190 || this.stats.vocab <= 180 || this.stats.charm <= 190)) {
            this.addChatMessage("나", "저 방금 지메 세계에서 127번째로 어려운 맵 한국에서 26번째로 깸");
            this.addChatMessage("장가희", "어쩌라고 미친놈아");
            if (this.Story.affinity != 80)
            {
                this.Story.affinity = 80;
                this.affinity_flag = true;
            } 
        } 
        else if (this.stats.social > 190 && this.stats.vocab > 180 && this.stats.charm > 190 && (this.stats.social < 200 || this.stats.vocab < 200 || this.stats.charm < 200)) {
            this.addChatMessage("나", "(망충대장 치즈덕 이모티콘)");
            this.addChatMessage("장가희", "(곽철이 이모티콘)");
            if (this.Story.affinity != 90)
            {
                this.Story.affinity = 90;
                this.affinity_flag = true;
            } 
        } 
        else if (this.stats.social >= 200 && this.stats.vocab >= 200 && this.stats.charm >= 200) {
            this.addChatMessage("나", "님 오늘 축제 옴?");
            if (this.Story.affinity != 100)
            {
                this.Story.affinity = 100;
                this.affinity_flag = true;
            } 
        }
        // 폰 레이어 표시 (강제 스타일 적용)
        phoneLayer.classList.remove('hidden');
        phoneLayer.classList.add('active');
        phoneLayer.style.display = "flex";
        phoneLayer.style.opacity = "1";
        phoneLayer.style.visibility = "visible";
    },

    addChatMessage(sender, text) {
        const div = document.createElement('div');
        div.className = `p-2 rounded-lg max-w-[80%] ${sender === "나" ? "bg-yellow-200 self-end" : "bg-white self-start"}`;
        div.innerHTML = `<span class='text-[10px] block opacity-50'>${sender}</span>${text}`;
        document.getElementById('chat-content').appendChild(div);
    },

    nextStep() {
        this.day--;
        this.updateUI();

        if (this.day === 0) {
            this.day = 2;
            // UI.showNotice(메시지, 확인버튼클릭시_실행할_함수)
            if (this.stats.stress >= 50) {
                UI.showNotice("스트레스가 너무 쌓여 병원에 실려갑니다.\n모든 스텟이 감소합니다.", () => {
                    this.stats.social = Math.max(0, this.stats.social - 5);
                    this.stats.vocab = Math.max(0, this.stats.vocab - 5);
                    this.stats.charm = Math.max(0, this.stats.charm - 5);
                    this.stats.stress = Math.max(0, this.stats.stress - 20);
                    this.updateUI();
                    this.switchToStory("prologue", "start");
                });
            }
            else if(this.affinity_flag){
                this.affinity_flag = false;
                UI.showNotice("제상후에 스텟에 따라 호감도가 변화하였습니다.\n메인 스토리가 진행됩니다.", () => {
                    let storyNumber = this.Story.affinity / 10;
                    this.switchToStory("mainstory_" + storyNumber, "start");
                });
            }
            else{
            UI.showNotice("휴일이 종료되었습니다.\n학교로 돌아갑니다.", () => {
                // 1. 랜덤하게 이동할 챕터 목록
                const nextChapters = [ "proxy_class", "cat_war", "sparrow"];
                const randomIndex = Math.floor(Math.random() * nextChapters.length);
                const selectedChapter = nextChapters[randomIndex];
                const startScene = "start";

                console.log(`랜덤 선택된 챕터: ${selectedChapter}`);

                // 2. 챕터를 변경하며 스토리로 복귀 (비동기 처리 고려)
                this.switchToStory(selectedChapter, startScene);
            });
        }

        }
    },

// manager.js 내부
    async switchToStory(chapterKey, sceneId) {
        // 1. 육성 화면 숨기기
        const mgmtLayer = document.getElementById('management-layer');
        mgmtLayer.classList.remove('active');
        mgmtLayer.classList.add('hidden');
        mgmtLayer.style.display = "none";

        try {
            // 2. 새로운 챕터 파일 로드 (story.js의 함수 호출)
            await this.Story.loadChapter(chapterKey);
            
            // 3. 시작 장면 설정 및 게임 재시작
            this.Story.currentScene = sceneId;
            this.Story.startGame();
        } catch (e) {
            console.error("새로운 챕터를 불러오는 데 실패했습니다:", e);
            UI.showNotice("에러: 시나리오 파일을 찾을 수 없습니다.");
        }
    },
    switchToManagement() {
        console.log("육성 모드 진입");
        UI.hideAllOverlays(); // 일단 다 끄기
        
        // 1. 대화창 숨기기
        const uiLayer = document.getElementById('ui-layer');
        uiLayer.classList.add('hidden');

        // 2. 육성 레이어 켜기
        const mgmtLayer = document.getElementById('management-layer');
        mgmtLayer.classList.add('active');

        this.updateUI();
    },
};

window.Manager = Manager;