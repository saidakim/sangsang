
export const Manager = {
    // 기본값 설정 (초기화 시 사용할 값들)
    defaultStats: { social: 10, vocab: 10, charm: 10, stress: 0 },
    stats: { social: 10, vocab: 10, charm: 10, stress: 0 },
    day: 1,

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
        { name: "길냥이 밥 뺏기", effect: { social: -5, stress: -10 }, desc: "사회성 하강, 스트레스 하강" }
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
        let msg = "아";
        if (this.stats.social <= 5) msg = "야이 씨발련아";
        if (this.stats.social > 5) 
        {
            if (this.stats.vocab <= 15) msg = "어법.. 어법버.. 어.. ";
            if (this.stats.vocab > 15) msg = "안녕?";
        }
        this.addChatMessage("나", msg);
        
        this.addChatMessage("장가희", "북까");
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
                    this.switchToStory("prologue", "hospital_start");
                });}
            else if (this.stats.social >= 20 && this.stats.vocab >= 20 && this.stats.charm >= 20) {

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
        console.log("육성 모드로 전환합니다."); // 연결 확인용

        // 1. 대화창 레이어 숨기기
        const uiLayer = document.getElementById('ui-layer');
        uiLayer.classList.add('hidden');
        uiLayer.style.opacity = "0";

        // 2. 육성 모드 레이어 보이기
        const mgmtLayer = document.getElementById('management-layer');
        mgmtLayer.classList.remove('hidden');
        // 중요: 기존 CSS의 .full-overlay 스타일을 적용받기 위해 'active' 추가
        mgmtLayer.classList.add('active'); 

        // 3. UI 데이터 갱신
        this.updateUI();
    }
};

window.Manager = Manager;