/* 
   MASTERPIECE CONFIG 
   Refined for smoothness and user experience
*/
const CONFIG = {
    passcode: "1402", // เปลี่ยนรหัสตรงนี้ (วัน/เดือน)
    typingSpeed: 60,
    letter: "ถึงอ้วน,\n\nขอบคุณที่อยู่ข้างกันนะ  \n\nรักอ้วนที่สุดในโลก และจะรักแบบนี้ตลอดไปนะ ❤️"
};

// DOM Elements
const lockScreen = document.getElementById('lock-screen');
const mainContent = document.getElementById('main-content');
const pinDots = document.querySelectorAll('.pin-dot');
const keys = document.querySelectorAll('.key');
const bgMusic = document.getElementById('bg-music');
const visualizer = document.getElementById('visualizer');

let currentPin = "";

// 1. KEYPAD LOGIC
keys.forEach(key => {
    key.addEventListener('click', () => {
        const num = key.getAttribute('data-num');

        // Delete
        if (key.classList.contains('delete')) {
            currentPin = currentPin.slice(0, -1);
            updateDots();
            return;
        }

        // Add Number
        if (num !== null && currentPin.length < 4) {
            currentPin += num;
            updateDots();

            // Check Pin
            if (currentPin.length === 4) {
                setTimeout(() => checkPin(), 300);
            }
        }
    });
});

function updateDots() {
    pinDots.forEach((dot, index) => {
        if (index < currentPin.length) dot.classList.add('active');
        else dot.classList.remove('active');
    });
}

function checkPin() {
    if (currentPin === CONFIG.passcode) {
        unlockSuccess();
    } else {
        unlockError();
    }
}

function unlockError() {
    // Shake Animation
    const panel = document.querySelector('.lock-panel');
    panel.classList.add('shake');
    navigator.vibrate(200); // Phone vibrate

    setTimeout(() => {
        panel.classList.remove('shake');
        currentPin = "";
        updateDots();
    }, 500);
}

function unlockSuccess() {
    // 1. Confetti Explosion
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff4d6d', '#ffffff', '#c77dff']
    });

    // 2. Play Audio
    bgMusic.play().catch(e => console.log("Interaction required"));

    // 3. Transition
    lockScreen.classList.add('fade-out');
    setTimeout(() => {
        lockScreen.classList.add('hidden');
        mainContent.classList.add('visible');

        // Init Types & Swiper
        initSwiper();
        typeWriter();
    }, 800);
}

// 2. SWIPER GALLERY (Ultimate Config)
function initSwiper() {
    new Swiper(".gallery-slider", {
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: "auto",
        initialSlide: 2,
        coverflowEffect: {
            rotate: 20,
            stretch: 0,
            depth: 350,
            modifier: 1,
            slideShadows: true,
        },
        // Parallax feel
        speed: 600,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        on: {
            slideChange: function () {
                // Determine if we are at the end
                if (this.isEnd || this.activeIndex === this.slides.length - 1) {
                    revealSurprise();
                }
            },
            reachEnd: function () {
                revealSurprise();
            }
        }
    });
}

function revealSurprise() {
    const surprise = document.querySelector('.final-surprise');
    if (surprise && !surprise.classList.contains('show-surprise')) {
        surprise.classList.add('show-surprise');

        // One-time confetti
        confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.7 },
            colors: ['#FFD700', '#FF4D6D', '#FFFFFF']
        });
    }
}

// 3. TYPEWRITER (Natural Feel)
let idx = 0;
function typeWriter() {
    const el = document.getElementById("typewriter");
    if (idx < CONFIG.letter.length) {
        const char = CONFIG.letter.charAt(idx);

        if (char === '\n') {
            el.innerHTML += '<br>';
        } else {
            el.innerHTML += char;
        }

        idx++;
        // Randomize speed slightly for human feel
        const randomSpeed = CONFIG.typingSpeed + (Math.random() * 20 - 10);
        setTimeout(typeWriter, randomSpeed);
    }
}

// 4. CUSTOM CURSOR TRAIL (Sparkles)
document.addEventListener('mousemove', (e) => {
    const cursor = document.getElementById('cursor');
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';

    // Create Sparkle Trail
    if (Math.random() < 0.3) { // not every frame
        createSparkle(e.clientX, e.clientY);
    }
});

function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.classList.add('sparkle');
    document.body.appendChild(sparkle);

    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';

    setTimeout(() => {
        sparkle.remove();
    }, 1000);
}

// 5. MOBILE GYROSCOPE TILT DEFAULT (vanilla-tilt handles mouse)
// NOTE: vanilla-tilt.js automatically handles device orientation on supported devices!
