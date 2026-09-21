/* ============================================
   THE HORROR EXPERIENCE - CORE JAVASCRIPT
   Cinematic Terror, Real Movie Ghosts & Audio
   ============================================ */

// ==========================================
// AUDIO ENGINE (Real Audio + Web Audio Synth)
// ==========================================
class HorrorSoundEngine {
    constructor() {
        this.ctx = null;
        this.initialized = false;
        
        // Real audio DOM elements
        this.screamAudio = null;
        this.jumpscareAudio = null;
        this.jokerAudio = null;
        this.laughAudio = null;
    }

    init() {
        if (this.initialized) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
            this.initialized = true;
        } catch (e) {
            console.warn("Web Audio API not supported", e);
        }

        // Cache elements
        this.screamAudio = document.getElementById('audio-scream');
        this.jumpscareAudio = document.getElementById('audio-jumpscare');
        this.jokerAudio = document.getElementById('audio-joker');
        this.laughAudio = document.getElementById('audio-laugh');

        // Prime audio files
        [this.screamAudio, this.jumpscareAudio, this.jokerAudio, this.laughAudio].forEach(a => {
            if (a) {
                a.volume = 1.0;
                a.load();
            }
        });
    }

    playAudioElement(el, volume = 1.0) {
        if (!el) return;
        try {
            el.currentTime = 0;
            el.volume = Math.min(1.0, Math.max(0.1, volume));
            const p = el.play();
            if (p && p.catch) p.catch(() => {});
        } catch (err) {
            // Fallback
        }
    }

    playScream() {
        this.playAudioElement(this.screamAudio, 1.0);
        this.synthScream(); // Layered synth scream for immense power
    }

    playJumpscare() {
        this.playAudioElement(this.jumpscareAudio, 1.0);
        this.playAudioElement(this.screamAudio, 0.85);
        this.subBassImpact();
    }

    playJokerLaugh() {
        this.playAudioElement(this.jokerAudio, 1.0);
    }

    playCreepyLaugh() {
        this.playAudioElement(this.laughAudio, 0.9);
    }

    // Web Audio Synthesizer Fallbacks & Atmosphere
    createGain(startTime, vol, duration) {
        if (!this.ctx) return null;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(vol, startTime + 0.05);
        gain.gain.setValueAtTime(vol, startTime + duration - 0.1);
        gain.gain.linearRampToValueAtTime(0, startTime + duration);
        gain.connect(this.ctx.destination);
        return gain;
    }

    subBassImpact() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(20, now + 0.8);
        gain.gain.setValueAtTime(1.0, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.85);
    }

    synthScream() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(2800, now);
        osc.frequency.linearRampToValueAtTime(900, now + 0.9);
        gain.gain.setValueAtTime(0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.9);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.95);
    }

    heartbeat(count = 3) {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        for (let i = 0; i < count; i++) {
            const t = now + i * 0.75;
            [65, 48].forEach((f, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const beatTime = t + idx * 0.18;
                osc.type = 'sine';
                osc.frequency.setValueAtTime(f, beatTime);
                osc.frequency.exponentialRampToValueAtTime(25, beatTime + 0.15);
                gain.gain.setValueAtTime(0.75, beatTime);
                gain.gain.exponentialRampToValueAtTime(0.01, beatTime + 0.15);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(beatTime);
                osc.stop(beatTime + 0.16);
            });
        }
    }

    whisper() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const dur = 2.5;
        const bufSize = this.ctx.sampleRate * dur;
        const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < bufSize; i++) {
            const t = i / this.ctx.sampleRate;
            data[i] = (Math.random() * 2 - 1) * 0.2 * Math.sin(t * Math.PI / dur);
        }
        const src = this.ctx.createBufferSource();
        src.buffer = buf;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1400, now);
        filter.Q.setValueAtTime(5, now);
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.35, now);
        src.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        src.start(now);
        src.stop(now + dur);
    }

    doorCreak() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(140, now + 0.4);
        osc.frequency.linearRampToValueAtTime(320, now + 0.9);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 1.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 1.15);
    }

    thunder() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const dur = 2.0;
        const bufSize = this.ctx.sampleRate * dur;
        const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < bufSize; i++) {
            const t = i / this.ctx.sampleRate;
            d[i] = (Math.random() * 2 - 1) * Math.exp(-t * 1.8);
        }
        const src = this.ctx.createBufferSource();
        src.buffer = buf;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, now);
        filter.frequency.exponentialRampToValueAtTime(70, now + dur);
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.9, now);
        src.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        src.start(now);
        src.stop(now + dur);
    }

    ambientDrone() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(55, now);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 8);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 8);
    }
}

const audio = new HorrorSoundEngine();

// ==========================================
// STATE & REPOSITORIES
// ==========================================
let isEntered = false;
let isJumpscareActive = false;
let lastScrollTime = Date.now();
let lastMouseMoveTime = Date.now();

const ghostImages = {
    screamer: 'images/screamer.jpg',
    kanchana: 'images/kanchana.jpg',
    annabelle: 'images/annabelle.jpg',
    joker: 'images/joker.jpg',
    evilClown: 'images/evil_clown.jpg',
    nun: 'images/nun.jpg',
    crawler: 'images/crawler.jpg',
    shadow: 'images/shadow_ghost.jpg'
};

const horrorWhispers = [
    "LOOK BEHIND YOU",
    "I CAN HEAR YOU BREATHING",
    "SHE IS UNDER YOUR DESK",
    "DON'T TURN AROUND",
    "DO NOT BLINK",
    "THEY ARE WATCHING YOU",
    "LOOK UP AT THE CEILING",
    "YOU CANNOT LEAVE",
    "SOMEONE IS STANDING BEHIND YOUR CHAIR"
];

// ==========================================
// ENTER SITE BUTTON
// ==========================================
document.getElementById('enter-btn').addEventListener('click', () => {
    audio.init();
    audio.playJumpscare(); // Visceral welcoming boom
    
    document.getElementById('enter-screen').classList.add('hidden');
    const main = document.getElementById('main-content');
    main.classList.remove('hidden-initially');
    main.classList.add('active-view');
    
    isEntered = true;

    // Start atmospheric loops
    startHorrorLoops();
    
    // Initial creepy greeting
    setTimeout(() => {
        showFloatingText("YOU SHOULD NOT HAVE ENTERED...");
        audio.whisper();
    }, 2000);
});

// ==========================================
// DYNAMIC FLASHLIGHT & DARK RED BLOOD TRAIL
// ==========================================
document.addEventListener('mousemove', (e) => {
    lastMouseMoveTime = Date.now();
    const x = e.clientX;
    const y = e.clientY;

    // Update flashlight vignette
    document.documentElement.style.setProperty('--mouse-x', x + 'px');
    document.documentElement.style.setProperty('--mouse-y', y + 'px');

    // Create subtle dark red blood drop trail
    if (isEntered && Math.random() < 0.22) {
        spawnBloodDot(x, y);
    }

    // Move Stalker Eyes pupil slightly
    const leftPupil = document.getElementById('left-pupil');
    const rightPupil = document.getElementById('right-pupil');
    if (leftPupil && rightPupil) {
        const dx = (x - window.innerWidth / 2) / 60;
        const dy = (y - window.innerHeight / 2) / 60;
        leftPupil.style.transform = `translate(${dx}px, ${dy}px)`;
        rightPupil.style.transform = `translate(${dx}px, ${dy}px)`;
    }
});

function spawnBloodDot(x, y) {
    const container = document.getElementById('cursor-trail-container');
    if (!container) return;
    const dot = document.createElement('div');
    dot.className = 'cursor-blood-dot';
    dot.style.left = (x + (Math.random() * 6 - 3)) + 'px';
    dot.style.top = (y + (Math.random() * 6 - 3)) + 'px';
    container.appendChild(dot);
    setTimeout(() => dot.remove(), 1200);
}

// ==========================================
// JUMPSCARE ENGINE
// ==========================================
function triggerJumpScare(customImg = null, customText = null, duration = 1800) {
    if (isJumpscareActive) return;
    isJumpscareActive = true;

    const overlay = document.getElementById('jumpscare-overlay');
    const imgEl = document.getElementById('jumpscare-img');
    const textEl = document.getElementById('jumpscare-text');

    const imageChoices = [ghostImages.screamer, ghostImages.kanchana, ghostImages.nun, ghostImages.evilClown];
    imgEl.src = customImg || imageChoices[Math.floor(Math.random() * imageChoices.length)];
    textEl.textContent = customText || horrorWhispers[Math.floor(Math.random() * horrorWhispers.length)];

    // Sound and flash
    audio.playJumpscare();
    flashScreen(true);

    overlay.classList.remove('jumpscare-hidden');
    overlay.classList.add('jumpscare-active');

    // Violent screen shake
    document.body.style.animation = 'screen-convulsion 0.08s infinite alternate';

    setTimeout(() => {
        overlay.classList.remove('jumpscare-active');
        overlay.classList.add('jumpscare-hidden');
        document.body.style.animation = '';
        isJumpscareActive = false;
    }, duration);
}

function flashScreen(isRed = false) {
    const flash = document.getElementById('flash-overlay');
    if (!flash) return;
    flash.className = isRed ? 'flash-red flash-active' : 'flash-active';
    setTimeout(() => {
        flash.className = '';
    }, 120);
}

// ==========================================
// RANDOM GHOST APPARITIONS
// 1. Left side hang
// 2. Right side hang
// 3. Ceiling stick
// 4. Floor crawl
// 5. Center pop-out
// ==========================================

function showGhostLeft() {
    const el = document.getElementById('ghost-left');
    const img = document.getElementById('ghost-left-img');
    if (!el || !img) return;

    const choices = [ghostImages.nun, ghostImages.shadow, ghostImages.kanchana];
    img.src = choices[Math.floor(Math.random() * choices.length)];

    el.classList.add('ghost-visible');
    audio.whisper();

    setTimeout(() => {
        el.classList.remove('ghost-visible');
    }, 4500 + Math.random() * 2000);
}

function showGhostRight() {
    const el = document.getElementById('ghost-right');
    const img = document.getElementById('ghost-right-img');
    if (!el || !img) return;

    const choices = [ghostImages.annabelle, ghostImages.joker, ghostImages.evilClown];
    img.src = choices[Math.floor(Math.random() * choices.length)];

    el.classList.add('ghost-visible');
    if (img.src.includes('joker') || img.src.includes('clown')) {
        audio.playCreepyLaugh();
    } else {
        audio.whisper();
    }

    setTimeout(() => {
        el.classList.remove('ghost-visible');
    }, 4500 + Math.random() * 2000);
}

function showGhostCeiling() {
    const el = document.getElementById('ghost-ceiling');
    const img = document.getElementById('ghost-ceiling-img');
    if (!el || !img) return;

    img.src = ghostImages.crawler;
    el.classList.add('ghost-visible');
    audio.ambientDrone();

    setTimeout(() => {
        el.classList.remove('ghost-visible');
    }, 4800);
}

function showGhostFloor() {
    const el = document.getElementById('ghost-floor');
    const img = document.getElementById('ghost-floor-img');
    if (!el || !img) return;

    img.src = ghostImages.screamer;
    el.classList.add('ghost-visible');
    audio.heartbeat(3);

    setTimeout(() => {
        el.classList.remove('ghost-visible');
    }, 4500);
}

function showGhostPopup() {
    const el = document.getElementById('ghost-popup');
    const img = document.getElementById('ghost-popup-img');
    if (!el || !img) return;

    const choices = [ghostImages.kanchana, ghostImages.nun, ghostImages.joker];
    img.src = choices[Math.floor(Math.random() * choices.length)];

    el.classList.add('ghost-visible');
    audio.playScream();

    setTimeout(() => {
        el.classList.remove('ghost-visible');
    }, 1800);
}

// ==========================================
// STALKER EYES IN THE CORNERS
// ==========================================
function spawnStalkerEyes() {
    const el = document.getElementById('stalker-eyes');
    if (!el) return;

    const positions = [
        { top: '15%', left: '8%' },
        { top: '22%', right: '10%' },
        { bottom: '20%', left: '12%' },
        { bottom: '25%', right: '8%' }
    ];
    const pos = positions[Math.floor(Math.random() * positions.length)];
    
    el.style.top = pos.top || 'auto';
    el.style.bottom = pos.bottom || 'auto';
    el.style.left = pos.left || 'auto';
    el.style.right = pos.right || 'auto';

    el.classList.remove('stalker-hidden');
    el.classList.add('stalker-visible');

    setTimeout(() => {
        el.classList.remove('stalker-visible');
        el.classList.add('stalker-hidden');
    }, 4000);
}

// ==========================================
// INTERACTIVE SECTION TRIGGERS
// ==========================================

// Door 1, 2, 3 in Corridor
function openDoor(num) {
    if (!isEntered) return;
    const door = document.getElementById('door-' + num);
    audio.doorCreak();

    if (num === 1) {
        door.style.transform = 'perspective(600px) rotateY(-50deg)';
        audio.whisper();
        showFloatingText("THEY ARE RIGHT BEHIND THIS DOOR...");
        setTimeout(() => {
            spawnStalkerEyes();
            door.style.transform = '';
        }, 3000);
    } else if (num === 2) {
        door.style.transform = 'perspective(600px) rotateY(-50deg)';
        audio.playJokerLaugh();
        showFloatingText("WHY SO SERIOUS? HAHAHAHA!");
        setTimeout(() => {
            door.style.transform = '';
        }, 3500);
    } else if (num === 3) {
        // Danger door! JUMPSCARE!
        door.style.transform = 'perspective(600px) rotateY(-75deg)';
        setTimeout(() => {
            triggerJumpScare(ghostImages.screamer, "WE WARNED YOU NOT TO OPEN!");
            door.style.transform = '';
        }, 400);
    }
}

// Kanchana Stage Click
function triggerKanchanaScare() {
    if (!isEntered) return;
    flashScreen(true);
    audio.playScream();
    showFloatingText("HER VENGEANCE IS UPON YOU!");
    
    const stage = document.getElementById('kanchana-stage');
    if (stage) {
        stage.style.transform = 'scale(1.15) rotate(-3deg)';
        setTimeout(() => { stage.style.transform = ''; }, 600);
    }
}

// Annabelle Stage Click
function triggerAnnabelleScare() {
    if (!isEntered) return;
    const cracks = document.getElementById('glass-cracks');
    if (cracks) cracks.style.opacity = '1';
    
    audio.doorCreak();
    audio.whisper();
    showFloatingText("DID YOU MISS ME?");

    // 40% chance of sudden jumpscare!
    if (Math.random() < 0.4) {
        setTimeout(() => {
            triggerJumpScare(ghostImages.annabelle, "I NEVER STAY IN MY CASE!");
        }, 600);
    }
}

// Joker Stage Click
function triggerJokerScare() {
    if (!isEntered) return;
    audio.playJokerLaugh();
    showFloatingText("WHY SO SERIOUS?! HAHAHA!");
    
    // Quick flash to evil clown image
    const img = document.getElementById('joker-img-element');
    if (img) {
        img.src = ghostImages.evilClown;
        setTimeout(() => {
            img.src = ghostImages.joker;
        }, 800);
    }
}

// Nun Stage Click
function triggerNunScare() {
    if (!isEntered) return;
    flashScreen(false);
    audio.thunder();
    audio.playScream();
    showFloatingText("PRAY FOR YOUR SOUL...");
    
    setTimeout(() => {
        if (Math.random() < 0.5) {
            triggerJumpScare(ghostImages.nun, "YOUR FAITH CANNOT SAVE YOU!");
        }
    }, 500);
}

// Crawler Showcase Triggers
function triggerCeilingCrawlerEvent() {
    if (!isEntered) return;
    showGhostCeiling();
}

function triggerFloorCrawlerEvent() {
    if (!isEntered) return;
    showGhostFloor();
}

// Escape Button (Evades cursor, then triggers final scare)
function evadeEscape() {
    const btn = document.getElementById('escape-btn');
    if (!btn) return;
    const x = (Math.random() - 0.5) * 220;
    const y = (Math.random() - 0.5) * 120;
    btn.style.transform = `translate(${x}px, ${y}px)`;
    audio.whisper();
}

function tryEscape() {
    if (!isEntered) return;
    triggerJumpScare(ghostImages.screamer, "THERE IS NO ESCAPING HELL!", 3000);
    setTimeout(() => {
        showFloatingText("YOU BELONG TO US NOW.");
        audio.playCreepyLaugh();
    }, 3200);
}

// ==========================================
// BLOODY FLOATING TEXT & HANDPRINTS
// ==========================================
function showFloatingText(msg = null) {
    const text = msg || horrorWhispers[Math.floor(Math.random() * horrorWhispers.length)];
    const container = document.getElementById('random-text-container');
    if (!container) return;

    const el = document.createElement('div');
    el.className = 'floating-horror-text';
    el.textContent = text;
    el.style.top = Math.random() * 60 + 20 + '%';
    el.style.left = Math.random() * 50 + 15 + '%';

    container.appendChild(el);
    setTimeout(() => el.remove(), 4000);
}

function spawnBloodyHandprint() {
    const container = document.getElementById('handprints-container');
    if (!container) return;

    const el = document.createElement('div');
    el.className = 'bloody-handprint';
    el.innerHTML = `
        <svg viewBox="0 0 100 120" width="100%" height="100%">
            <path d="M50 85 C35 85 25 70 25 55 C25 40 30 20 32 10 C33 7 37 7 38 10 C40 25 40 40 40 42 C40 30 42 12 44 4 C45 1 49 1 50 4 C52 15 52 35 52 40 C52 28 55 14 58 7 C59 4 63 4 64 7 C66 20 65 38 65 44 C67 36 70 25 73 18 C75 15 78 16 78 19 C78 32 75 50 72 60 C68 75 60 85 50 85 Z" fill="#600" opacity="0.8"/>
            <circle cx="50" cy="95" r="12" fill="#500" opacity="0.8"/>
            <path d="M48 100 Q50 120 49 130" stroke="#500" stroke-width="3" fill="none"/>
        </svg>
    `;
    el.style.top = Math.random() * 80 + 10 + '%';
    el.style.left = Math.random() * 85 + 5 + '%';
    el.style.transform = `rotate(${Math.random() * 60 - 30}deg)`;

    container.appendChild(el);
    setTimeout(() => el.remove(), 7000);
}

// ==========================================
// BACKGROUND HORROR LOOPS
// Periodic random events keeping user terrified
// ==========================================
function startHorrorLoops() {
    // 1. Random whispers
    setInterval(() => {
        if (!isEntered) return;
        if (Math.random() < 0.45) {
            showFloatingText();
            audio.whisper();
        }
    }, 11000);

    // 2. Random Side / Ceiling / Floor Apparitions
    setInterval(() => {
        if (!isEntered) return;
        const roll = Math.random();
        if (roll < 0.25) {
            showGhostLeft();
        } else if (roll < 0.50) {
            showGhostRight();
        } else if (roll < 0.72) {
            showGhostCeiling();
        } else if (roll < 0.90) {
            showGhostFloor();
        } else {
            showGhostPopup();
        }
    }, 16000);

    // 3. Stalker Eyes in corners
    setInterval(() => {
        if (!isEntered) return;
        if (Math.random() < 0.4) {
            spawnStalkerEyes();
        }
    }, 14000);

    // 4. Bloody Handprints
    setInterval(() => {
        if (!isEntered) return;
        if (Math.random() < 0.35) {
            spawnBloodyHandprint();
        }
    }, 12000);

    // 5. Inactivity trap (If user goes idle for 14 seconds)
    setInterval(() => {
        if (!isEntered) return;
        const now = Date.now();
        if (now - lastMouseMoveTime > 14000 && now - lastScrollTime > 14000) {
            lastMouseMoveTime = now; // reset
            audio.whisper();
            showFloatingText("I KNOW YOU ARE STILL THERE...");
            setTimeout(() => {
                if (Math.random() < 0.6) showGhostLeft();
                else showGhostCeiling();
            }, 1200);
        }
    }, 5000);

    // 6. Ambient heartbeat & drone
    setInterval(() => {
        if (!isEntered) return;
        audio.heartbeat(2);
    }, 24000);

    setInterval(() => {
        if (!isEntered) return;
        audio.ambientDrone();
    }, 32000);
}

// ==========================================
// SCROLL SCARE SENSORS
// ==========================================
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    if (!isEntered) return;
    lastScrollTime = Date.now();

    const currentScrollY = window.scrollY;
    const diff = Math.abs(currentScrollY - lastScrollY);
    lastScrollY = currentScrollY;

    // Fast scrolling increases fear!
    if (diff > 250 && Math.random() < 0.2) {
        flashScreen(false);
        audio.whisper();
        if (Math.random() < 0.35) showGhostFloor();
    }
}, { passive: true });

// Prevent context menu (punish user for right clicking!)
document.addEventListener('contextmenu', (e) => {
    if (!isEntered) return;
    e.preventDefault();
    audio.playCreepyLaugh();
    showFloatingText("DON'T TRY TO RIGHT CLICK!");
});

// Detect tab switching (punish user for looking away!)
document.addEventListener('visibilitychange', () => {
    if (!isEntered || document.hidden) return;
    setTimeout(() => {
        audio.whisper();
        showFloatingText("YOU THOUGHT YOU COULD HIDE?");
        setTimeout(() => {
            if (Math.random() < 0.5) triggerJumpScare(ghostImages.screamer, "WELCOME BACK TO HELL!");
            else showGhostRight();
        }, 1200);
    }, 600);
});

console.log('%c ☠️ DO NOT LOOK BEHIND YOU ☠️ ', 'background:#4a0000;color:#ff3333;font-size:24px;font-weight:bold;padding:12px;');
