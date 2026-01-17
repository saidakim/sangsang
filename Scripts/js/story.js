// js/game.js
import { scenario } from "./scenario.js";
import { assets } from "./assets.js";
export const Story = {
    currentScene: "start",
    isTyping: false,
    typeTimeout: null,
    affinity: 0,
    isPlaying: false, 
    isPaused: false,
    audioManager: null,


  
  
  
    init() { 
      this.log = [];
      this.choices = [];
      this.queue = [];
      this.overlays = [];
      this.flags = {};
      document.getElementById('db-trigger').onclick = () => this.next();
      window.onkeydown = (e) => {
        if (e.code === "Space" || e.code === "Enter") this.next();
        if (e.code === "Escape" && this.isPlaying) this.togglePause();
      };
    },


    startGame() {
        this.isPlaying = true;
        this.isPaused = false;
        document.querySelectorAll('.full-overlay').forEach(el => el.classList.remove('active'));
        document.getElementById('ui-layer').classList.remove('hidden', 'opacity-0');
        this.renderScene();
    },

    renderScene() {
        const data = scenario[this.currentScene];
        if (!data) return;

        if (data.script) {
            this.currentScene = data.script(this);
            this.renderScene();
            return;
        }

        const bgLayer = document.getElementById('bg-layer');
        if (data.bg && assets.images[data.bg]) bgLayer.style.backgroundImage = `url('${assets.images[data.bg]}')`;

        if (this.isPlaying) {
            if (data.bgm) {
                this.audioManager.playBGM(data.bgm, { fadeIn: 800 });
            }
            if (data.sfx) this.audioManager.playSFX(data.sfx);
        }

        const charLayer = document.getElementById('character-layer');
        charLayer.innerHTML = ""; 

        const charList = data.chars || [];
        charList.forEach(char => {
            const charUnit = document.createElement('div');
            charUnit.className = `char-unit ${char.focus === false ? 'unfocused' : ''}`;
            
            const img = document.createElement('img');
            img.src = assets.images[char.image] || '';
            img.className = "char-img";
            
            if (char.eff) {
                const effClass = `eff-${char.eff}`;
                img.classList.add(effClass);
                img.onanimationend = () => img.classList.remove(effClass);
            }

            charUnit.appendChild(img);
            charLayer.appendChild(charUnit);
        });

        document.getElementById('speaker-name').innerText = data.speaker || "";
        this.typeText(data.text);

        const choiceBox = document.getElementById('choice-container');
        choiceBox.innerHTML = "";
        if (data.choices) {
            choiceBox.classList.remove('hidden');
            data.choices.forEach(c => {
                const b = document.createElement('button');
                b.className = "choice-btn";
                b.innerText = c.text;
                b.onclick = (e) => {
                    e.stopPropagation();
                    // play choice sfx if set
                    if (c.sfx) this.audioManager.playSFX(c.sfx);
                    this.affinity += (c.score || 0);
                    this.currentScene = c.next;
                    choiceBox.classList.add('hidden');
                    this.renderScene();
                };
                choiceBox.appendChild(b);
            });
        } else {
            choiceBox.classList.add('hidden');
        }
    },
  

    typeText(text) {
        this.isTyping = true;
        const target = document.getElementById('dialogue-text');
        const prompt = document.getElementById('click-prompt');
        prompt.classList.add('hidden');
        target.textContent = ""; 
        let i = 0;
        if (this.typeTimeout) clearInterval(this.typeTimeout);
        this.typeTimeout = setInterval(() => {
            target.textContent += text[i++];
            if (i >= text.length) {
                clearInterval(this.typeTimeout);
                this.isTyping = false;
                prompt.classList.remove('hidden');
            }
        }, 35);
    },

    next() {
        if (this.isPaused) return;
        const data = scenario[this.currentScene];
        if (!data || data.choices) return;
        if (this.isTyping) {
            clearInterval(this.typeTimeout);
            document.getElementById('dialogue-text').textContent = data.text;
            this.isTyping = false;
            document.getElementById('click-prompt').classList.remove('hidden');
            return;
        }
        if (data.isEnding) { this.showEnding(data); return; }
        if (data.next) { this.currentScene = data.next; this.renderScene(); }
    },

    showEnding(data) {
        const el = document.getElementById('ending-layer');
        document.getElementById('ending-title').innerText = data.title;
        document.getElementById('ending-desc').innerText = data.desc;
        document.getElementById('ui-layer').classList.add('opacity-0');
        el.classList.add('active');
        // optionally switch bgm for ending
        if (data.bgm) this.audioManager.playBGM(data.bgm, { fadeIn: 600 });
        else this.audioManager.stopBGM({ fadeOut: 600 });
    },

    togglePause() { this.isPaused = !this.isPaused; document.getElementById('pause-menu').classList.toggle('active'); },
    resetToMenu() {
      this.isPlaying = false;
      document.querySelectorAll('.full-overlay').forEach(el => el.classList.remove('active'));
      document.getElementById('main-menu').classList.add('active');
      document.getElementById('ui-layer').classList.add('hidden', 'opacity-0');

      this.audioManager.stopBGM();
      this.audioManager.playBGM("bgm_menu");
    },
    handleStartButton() { this.audioManager.playSFX("sfx_click");this.currentScene = "start"; this.affinity = 0; this.startGame(); }
};