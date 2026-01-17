
export const Manager = {
    stats: { social: 10, vocab: 10, charm: 10, stress: 0 },
    day: 1,
    Story: null,
    
    // 활동 데이터
    activities: [
        { name: "운동장 파이 외우기", effect: { vocab: 5, stress: 10 }, desc: "어휘력 상승, 스트레스 상승" },
        { name: "길냥이 밥 주기", effect: { charm: 5, social: 2 }, desc: "매력 상승, 사회성 조금 상승" },
        { name: "과방에서 잠자기", effect: { stress: -20 }, desc: "스트레스 대폭 감소" },
        { name: "동아리 면접 연습", effect: { social: 7, stress: 5 }, desc: "사회성 상승, 스트레스 상승" }
    ],

    updateUI() {
        document.getElementById('stat-social').innerText = this.stats.social;
        document.getElementById('stat-vocab').innerText = this.stats.vocab;
        document.getElementById('stat-charm').innerText = this.stats.charm;
        document.getElementById('stat-stress').innerText = this.stats.stress;
        document.getElementById('current-day').innerText = `DAY ${this.day}`;
    },

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
        let msg = "안녕 가희야, 뭐해?";
        if (this.stats.vocab > 30) msg = "장가희 씨, 혹시 시간 되시면 파이(π)의 소수점 100자리까지 같이 외워보실래요?";
        if (this.stats.stress > 50) msg = "아... 죽겠다... 냥코나 하러 갈까...";

        this.addChatMessage("나", msg);
        
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
        this.day++;
        this.updateUI();
        // 특정 날짜가 되면 스토리를 강제 진행
        if (this.day === 3) {
            this.switchToStory("chicken"); // Day 3에 치킨집 스토리 발생
        }
    },

    switchToStory(sceneId) {
        document.getElementById('management-layer').classList.add('hidden');
        this.Story.currentScene = sceneId;
        this.Story.startGame();
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