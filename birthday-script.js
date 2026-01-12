let audioContext;
let microphone;
let analyser;
let dataArray;
let isBlownOut = false;

const startBtn = document.getElementById('startBtn');
const instruction = document.getElementById('instruction');
const cakeContainer = document.getElementById('cakeContainer');
const flames = document.querySelectorAll('.candle-flame');
const messageContainer = document.getElementById('messageContainer');

function createFloatingEmojis() {
    const emojis = ['🎂', '🎉', '🎈', '🎁', '🎀', '🎊', '✨', '🌟', '💖', '🎀', '🧁', '🍰', '🌺', '🌸', '💕'];
    setInterval(() => {
        const emoji = document.createElement('div');
        emoji.className = 'floating-emoji';
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.position = 'absolute';
        emoji.style.left = Math.random() * 100 + '%';
        emoji.style.bottom = '-50px';
        emoji.style.fontSize = (Math.random() * 1.5 + 2) + 'em';
        emoji.style.opacity = '0';
        emoji.style.pointerEvents = 'none';
        emoji.style.animation = 'floatUpEmoji ' + (Math.random() * 5 + 8) + 's linear forwards';
        document.body.appendChild(emoji);
        setTimeout(() => emoji.remove(), 13000);
    }, 1000);
}

const floatStyle = document.createElement('style');
floatStyle.textContent = `
    @keyframes floatUpEmoji {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 0.8;
        }
        90% {
            opacity: 0.8;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(floatStyle);

function createConfetti() {
    const colors = ['#ff69b4', '#da70d6', '#ba55d3', '#ff1493', '#ffc0cb', '#dda0dd', '#ee82ee', '#ff00ff'];
    setInterval(() => {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-20px';
        confetti.style.width = (Math.random() * 12 + 6) + 'px';
        confetti.style.height = (Math.random() * 12 + 6) + 'px';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.pointerEvents = 'none';
        confetti.style.animation = 'confettiFall ' + (Math.random() * 3 + 4) + 's linear forwards';
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 9000);
    }, 250);
}

const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confettiFall {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(confettiStyle);

function createHearts() {
    const positions = [
        {top: '10%', left: '8%'},
        {top: '15%', right: '12%'},
        {bottom: '20%', left: '10%'},
        {bottom: '15%', right: '8%'},
        {top: '50%', left: '3%'},
        {top: '50%', right: '3%'},
        {top: '30%', left: '15%'},
        {top: '70%', right: '15%'}
    ];
    
    positions.forEach((pos, index) => {
        const heart = document.createElement('div');
        heart.textContent = ['💕', '💖', '💗', '💓'][index % 4];
        heart.style.position = 'absolute';
        heart.style.fontSize = '2.5em';
        heart.style.animation = 'heartPulse 3s infinite ease-in-out';
        heart.style.animationDelay = (index * 0.4) + 's';
        heart.style.filter = 'drop-shadow(0 0 20px rgba(255, 105, 180, 0.8))';
        Object.assign(heart.style, pos);
        document.body.appendChild(heart);
    });
}

const heartStyle = document.createElement('style');
heartStyle.textContent = `
    @keyframes heartPulse {
        0%, 100% {
            transform: scale(1);
            opacity: 0.6;
        }
        50% {
            transform: scale(1.4);
            opacity: 1;
        }
    }
`;
document.head.appendChild(heartStyle);

function createBalloons() {
    const balloonColors = ['#ff69b4', '#da70d6', '#ba55d3', '#ff1493', '#ffc0cb', '#ee82ee'];
    const positions = [
        {top: '15%', left: '5%'},
        {top: '25%', right: '8%'},
        {bottom: '30%', left: '4%'},
        {bottom: '25%', right: '12%'}
    ];

    positions.forEach((pos, index) => {
        const balloon = document.createElement('div');
        balloon.style.position = 'absolute';
        balloon.style.width = '80px';
        balloon.style.height = '100px';
        balloon.style.borderRadius = '50% 50% 50% 50% / 60% 60% 40% 40%';
        balloon.style.background = balloonColors[index];
        balloon.style.animation = 'balloonFloat 6s infinite ease-in-out';
        balloon.style.animationDelay = (index * 0.6) + 's';
        balloon.style.filter = `drop-shadow(0 10px 30px ${balloonColors[index]})`;
        Object.assign(balloon.style, pos);
        document.body.appendChild(balloon);
    });
}

const balloonStyle = document.createElement('style');
balloonStyle.textContent = `
    @keyframes balloonFloat {
        0%, 100% {
            transform: translateY(0) rotate(-5deg);
        }
        50% {
            transform: translateY(-30px) rotate(5deg);
        }
    }
`;
document.head.appendChild(balloonStyle);

createFloatingEmojis();
createConfetti();
createHearts();
createBalloons();

startBtn.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
            } 
        });
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        microphone = audioContext.createMediaStreamSource(stream);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;
        
        microphone.connect(analyser);
        
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        
        startBtn.style.transition = 'all 0.5s ease-out';
        startBtn.style.transform = 'scale(0)';
        startBtn.style.opacity = '0';
        
        setTimeout(() => {
            startBtn.style.display = 'none';
            cakeContainer.style.display = 'inline-block';
            instruction.textContent = '💨 Now blow into your microphone to blow out the candles! 💨';
            instruction.style.background = 'linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(255, 165, 0, 0.2))';
        }, 500);
        
        detectBlow();
        createSparkles();
    } catch (err) {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const errorMsg = isMobile 
            ? 'Please allow microphone access in your browser settings to blow out the candles! 🎤✨\n\nTip: Check your browser permissions for this site.'
            : 'Please allow microphone access to blow out the candles! 🎤✨';
        alert(errorMsg);
        console.error('Microphone error:', err);
    }
});

function detectBlow() {
    if (isBlownOut) return;
    
    analyser.getByteFrequencyData(dataArray);
    
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
    }
    const average = sum / dataArray.length;
    
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const threshold = isMobile ? 25 : 35;
    
    if (average > threshold) {
        blowOutCandles();
    } else {
        requestAnimationFrame(detectBlow);
    }
}

function blowOutCandles() {
    if (isBlownOut) return;
    isBlownOut = true;
    
    cakeContainer.style.animation = 'cakeShake 0.5s ease-in-out';
    
    flames.forEach((flame, index) => {
        setTimeout(() => {
            flame.style.transition = 'all 0.4s ease-out';
            flame.classList.add('blown-out');
            createSmoke(flame.parentElement);
            createSparkBurst(flame.parentElement);
        }, index * 250);
    });
    
    instruction.style.transition = 'all 0.8s ease-out';
    instruction.classList.add('hidden');
    
    setTimeout(() => {
        playBirthdayMusic();
        messageContainer.classList.add('show');
        createMassiveConfetti();
        createCelebrationBurst();
    }, 1500);
}

const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes cakeShake {
        0%, 100% { transform: translateX(0) rotate(0deg); }
        25% { transform: translateX(-10px) rotate(-2deg); }
        75% { transform: translateX(10px) rotate(2deg); }
    }
`;
document.head.appendChild(shakeStyle);

function createSmoke(candleHolder) {
    for (let i = 0; i < 4; i++) {
        setTimeout(() => {
            const smoke = document.createElement('div');
            smoke.className = 'smoke';
            smoke.style.left = (Math.random() * 10 - 5) + 'px';
            candleHolder.appendChild(smoke);
            setTimeout(() => smoke.remove(), 3000);
        }, i * 400);
    }
}

function createSparkBurst(candleHolder) {
    const rect = candleHolder.getBoundingClientRect();
    for (let i = 0; i < 8; i++) {
        const sparkle = document.createElement('div');
        sparkle.style.position = 'fixed';
        sparkle.style.left = rect.left + rect.width / 2 + 'px';
        sparkle.style.top = rect.top + 'px';
        sparkle.style.width = '4px';
        sparkle.style.height = '4px';
        sparkle.style.background = 'white';
        sparkle.style.borderRadius = '50%';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.boxShadow = '0 0 10px white';
        const angle = (Math.PI * 2 * i) / 8;
        const distance = 30;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        sparkle.style.animation = `sparkBurst${i} 1s ease-out forwards`;
        
        const sparkStyle = document.createElement('style');
        sparkStyle.textContent = `
            @keyframes sparkBurst${i} {
                0% {
                    transform: translate(0, 0) scale(0);
                    opacity: 1;
                }
                50% {
                    transform: translate(${tx/2}px, ${ty/2}px) scale(1.5);
                    opacity: 1;
                }
                100% {
                    transform: translate(${tx}px, ${ty}px) scale(0);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(sparkStyle);
        
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 1000);
    }
}

function createMassiveConfetti() {
    const colors = ['#ff69b4', '#da70d6', '#ba55d3', '#ff1493', '#ffc0cb', '#dda0dd', '#ee82ee', '#ff00ff'];
    for (let i = 0; i < 150; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = (Math.random() * 100) + '%';
            confetti.style.top = '-20px';
            confetti.style.width = (Math.random() * 18 + 10) + 'px';
            confetti.style.height = (Math.random() * 18 + 10) + 'px';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.opacity = Math.random() * 0.5 + 0.5;
            confetti.style.pointerEvents = 'none';
            confetti.style.animation = 'confettiFall ' + (Math.random() * 3 + 2.5) + 's linear forwards';
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 6000);
        }, i * 25);
    }
}

function createCelebrationBurst() {
    const emojis = ['🎉', '🎊', '✨', '🌟', '💖', '🎈'];
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const emoji = document.createElement('div');
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.style.position = 'fixed';
            emoji.style.left = (Math.random() * 100) + '%';
            emoji.style.top = '-50px';
            emoji.style.fontSize = (Math.random() * 1.5 + 2) + 'em';
            emoji.style.pointerEvents = 'none';
            emoji.style.animation = 'celebrationFall ' + (Math.random() * 3 + 3) + 's ease-out forwards';
            document.body.appendChild(emoji);
            setTimeout(() => emoji.remove(), 6000);
        }, i * 50);
    }
}

const celebrationStyle = document.createElement('style');
celebrationStyle.textContent = `
    @keyframes celebrationFall {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(celebrationStyle);

function createSparkles() {
    setInterval(() => {
        const sparkle = document.createElement('div');
        sparkle.style.position = 'absolute';
        sparkle.style.left = (Math.random() * 100) + '%';
        sparkle.style.top = (Math.random() * 100) + '%';
        sparkle.style.width = '4px';
        sparkle.style.height = '4px';
        sparkle.style.background = 'white';
        sparkle.style.borderRadius = '50%';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.boxShadow = '0 0 10px white';
        sparkle.style.animation = 'sparkleAnim 1s ease-out forwards';
        sparkle.style.animationDelay = (Math.random() * 0.3) + 's';
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 1000);
    }, 200);
}

const sparkleAnimStyle = document.createElement('style');
sparkleAnimStyle.textContent = `
    @keyframes sparkleAnim {
        0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
        }
        50% {
            transform: scale(1.5) rotate(180deg);
            opacity: 1;
        }
        100% {
            transform: scale(0) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(sparkleAnimStyle);

function playBirthdayMusic() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    const melody = [
        {freq: 523.25, time: 0.0, duration: 0.25},
        {freq: 523.25, time: 0.3, duration: 0.15},
        {freq: 587.33, time: 0.5, duration: 0.35},
        {freq: 523.25, time: 0.9, duration: 0.35},
        {freq: 698.46, time: 1.3, duration: 0.35},
        {freq: 659.25, time: 1.7, duration: 0.7},
        
        {freq: 523.25, time: 2.5, duration: 0.25},
        {freq: 523.25, time: 2.8, duration: 0.15},
        {freq: 587.33, time: 3.0, duration: 0.35},
        {freq: 523.25, time: 3.4, duration: 0.35},
        {freq: 783.99, time: 3.8, duration: 0.35},
        {freq: 698.46, time: 4.2, duration: 0.7},
        
        {freq: 523.25, time: 5.0, duration: 0.25},
        {freq: 523.25, time: 5.3, duration: 0.15},
        {freq: 1046.50, time: 5.5, duration: 0.35},
        {freq: 880.00, time: 5.9, duration: 0.35},
        {freq: 698.46, time: 6.3, duration: 0.35},
        {freq: 659.25, time: 6.7, duration: 0.35},
        {freq: 587.33, time: 7.1, duration: 0.7},
        
        {freq: 932.33, time: 7.9, duration: 0.25},
        {freq: 932.33, time: 8.2, duration: 0.15},
        {freq: 880.00, time: 8.4, duration: 0.35},
        {freq: 698.46, time: 8.8, duration: 0.35},
        {freq: 783.99, time: 9.2, duration: 0.35},
        {freq: 698.46, time: 9.6, duration: 0.7},
    ];
    
    melody.forEach(note => {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.frequency.value = note.freq;
        oscillator.type = 'triangle';
        
        const startTime = audioCtx.currentTime + note.time;
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.25, startTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + note.duration);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + note.duration);
    });
    
    const harmony = [
        {freq: 329.63, time: 0.0, duration: 0.7},
        {freq: 293.66, time: 1.3, duration: 0.7},
        {freq: 329.63, time: 2.5, duration: 0.7},
        {freq: 349.23, time: 3.8, duration: 0.7},
        {freq: 329.63, time: 5.0, duration: 0.7},
        {freq: 349.23, time: 6.3, duration: 0.7},
        {freq: 392.00, time: 7.9, duration: 0.7},
        {freq: 349.23, time: 9.2, duration: 0.7},
    ];
    
    harmony.forEach(note => {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.frequency.value = note.freq;
        oscillator.type = 'sine';
        
        const startTime = audioCtx.currentTime + note.time;
        gainNode.gain.setValueAtTime(0.08, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + note.duration);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + note.duration);
    });
    
    const bass = [
        {freq: 261.63, time: 0.0, duration: 2.5},
        {freq: 261.63, time: 2.5, duration: 2.5},
        {freq: 349.23, time: 5.0, duration: 2.9},
        {freq: 349.23, time: 7.9, duration: 2.5},
    ];
    
    bass.forEach(note => {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.frequency.value = note.freq;
        oscillator.type = 'sine';
        
        const startTime = audioCtx.currentTime + note.time;
        gainNode.gain.setValueAtTime(0.1, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + note.duration);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + note.duration);
    });
    
    setTimeout(() => {
        playBirthdayMusic();
    }, 10500);
}