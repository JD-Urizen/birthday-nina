// Generate floating birthday-themed emojis
function createFloatingEmoji() {
    const emojis = [
        '🎂', '🎉', '🎈', '🎁', '🥂', '🍾', 
        '💝', '💖', '💗', '💕', '💓', '❤️',
        '🎊', '✨', '🌟', '⭐', '💫', '🎀',
        '🍰', '🧁', '🎂', '🍾', '🥳', '🎆',
        '🌸', '🌺', '🌹', '💐', '🦋', '🌈'
    ];
    
    const emoji = document.createElement('div');
    emoji.classList.add('floating-emoji');
    emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    emoji.style.left = Math.random() * 100 + '%';
    emoji.style.animationDuration = (Math.random() * 10 + 10) + 's';
    emoji.style.animationDelay = Math.random() * 5 + 's';
    emoji.style.fontSize = (Math.random() * 1.5 + 1.5) + 'em';
    
    document.getElementById('hearts').appendChild(emoji);

    // Remove emoji after animation completes
    setTimeout(() => {
        emoji.remove();
    }, parseFloat(emoji.style.animationDuration) * 1000 + parseFloat(emoji.style.animationDelay) * 1000);
}

// Initialize floating emojis
function initFloatingEmojis() {
    // Create initial batch
    for (let i = 0; i < 15; i++) {
        setTimeout(createFloatingEmoji, i * 300);
    }
    
    // Continuously create new emojis
    setInterval(createFloatingEmoji, 2000);
}

// Start floating emojis when page loads
window.addEventListener('load', initFloatingEmojis);

// Polaroid click effect with wiggle
document.addEventListener('DOMContentLoaded', function() {
    const polaroids = document.querySelectorAll('.polaroid');
    
    polaroids.forEach(polaroid => {
        polaroid.addEventListener('click', function() {
            // Add wiggle animation
            this.style.animation = 'wiggle 0.5s ease';
            
            setTimeout(() => {
                this.style.animation = '';
            }, 500);
        });
    });
});

// Add wiggle animation
const wiggleStyle = document.createElement('style');
wiggleStyle.textContent = `
    @keyframes wiggle {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(-5deg); }
        50% { transform: rotate(5deg); }
        75% { transform: rotate(-5deg); }
    }
`;
document.head.appendChild(wiggleStyle);

// Sparkle effect on mouse movement
let lastSparkleTime = 0;
const sparkleDelay = 200;

document.addEventListener('mousemove', function(e) {
    const currentTime = Date.now();
    
    if (currentTime - lastSparkleTime < sparkleDelay) return;
    lastSparkleTime = currentTime;
    
    // Random chance to create sparkle (30% chance)
    if (Math.random() > 0.7) {
        createSparkle(e.pageX, e.pageY);
    }
});

function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.style.position = 'absolute';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    sparkle.style.width = '6px';
    sparkle.style.height = '6px';
    sparkle.style.borderRadius = '50%';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '9999';
    sparkle.style.background = `linear-gradient(45deg, 
        ${['#ec4899', '#d946ef', '#a855f7', '#6366f1'][Math.floor(Math.random() * 4)]}, 
        white)`;
    sparkle.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.8)';
    sparkle.style.animation = 'sparkleFloat 1s ease-out forwards';
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => sparkle.remove(), 1000);
}

// Sparkle animation
const sparkleStyle = document.createElement('style');
sparkleStyle.textContent = `
    @keyframes sparkleFloat {
        0% {
            transform: translate(0, 0) scale(0);
            opacity: 1;
        }
        50% {
            transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(${Math.random() * 80 - 40}px, ${Math.random() * 80 - 40}px) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(sparkleStyle);

// Confetti burst when hovering over surprise button
const surpriseButton = document.querySelector('.surprise-button');
if (surpriseButton) {
    let isConfettiActive = false;
    
    surpriseButton.addEventListener('mouseenter', function() {
        if (!isConfettiActive) {
            isConfettiActive = true;
            createConfettiBurst(this);
            setTimeout(() => {
                isConfettiActive = false;
            }, 1000);
        }
    });
}

function createConfettiBurst(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const colors = ['#ec4899', '#d946ef', '#a855f7', '#6366f1', '#f472b6', '#c084fc'];
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = centerX + 'px';
            confetti.style.top = centerY + 'px';
            confetti.style.width = (Math.random() * 8 + 4) + 'px';
            confetti.style.height = (Math.random() * 8 + 4) + 'px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            confetti.style.opacity = '1';
            
            const angle = (Math.PI * 2 * i) / 20;
            const velocity = Math.random() * 100 + 50;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            let x = 0, y = 0;
            let opacity = 1;
            
            function animate() {
                x += vx * 0.016;
                y += vy * 0.016 + 2; // gravity
                opacity -= 0.02;
                
                confetti.style.transform = `translate(${x}px, ${y}px) rotate(${x * 2}deg)`;
                confetti.style.opacity = opacity;
                
                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    confetti.remove();
                }
            }
            
            document.body.appendChild(confetti);
            animate();
        }, i * 20);
    }
}

// Intersection Observer for timeline animations
const timelineMemories = document.querySelectorAll('.timeline-memory');
const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -100px 0px'
};

const timelineObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInMemory 0.6s ease-out forwards';
        }
    });
}, observerOptions);

timelineMemories.forEach((memory) => {
    timelineObserver.observe(memory);
});

// Parallax effect on scroll
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    
    // Parallax on header
    const header = document.querySelector('.header-page');
    if (header) {
        const headerOffset = header.offsetTop;
        if (scrolled > headerOffset - window.innerHeight) {
            header.style.transform = `translateY(${(scrolled - headerOffset) * 0.3}px) rotate(-0.5deg)`;
        }
    }
    
    // Parallax on stickers
    const stickers = document.querySelectorAll('.sticker');
    stickers.forEach((sticker, index) => {
        const speed = 0.1 + (index * 0.05);
        sticker.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Easter egg: Click on main title multiple times for celebration
let titleClickCount = 0;
const mainTitle = document.querySelector('.header-page h1');

if (mainTitle) {
    mainTitle.addEventListener('click', function() {
        titleClickCount++;
        
        // Add shake effect
        this.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
            this.style.animation = 'shimmer 3s infinite';
        }, 500);
        
        if (titleClickCount === 5) {
            createCelebration();
            titleClickCount = 0;
        }
    });
}

// Shake animation for title
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        50% { transform: translateX(10px); }
        75% { transform: translateX(-10px); }
    }
`;
document.head.appendChild(shakeStyle);

function createCelebration() {
    const celebrationEmojis = ['💝', '💖', '💗', '💕', '❤️', '🎉', '🎊', '✨', '🎂', '🎈'];
    
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const emoji = document.createElement('div');
            emoji.textContent = celebrationEmojis[Math.floor(Math.random() * celebrationEmojis.length)];
            emoji.style.position = 'fixed';
            emoji.style.left = Math.random() * 100 + '%';
            emoji.style.top = '-50px';
            emoji.style.fontSize = (Math.random() * 2 + 2) + 'em';
            emoji.style.pointerEvents = 'none';
            emoji.style.zIndex = '9999';
            emoji.style.animation = 'celebrationFall 3s ease-out forwards';
            
            document.body.appendChild(emoji);
            setTimeout(() => emoji.remove(), 3000);
        }, i * 100);
    }
}

// Celebration animation
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

// Add heart burst when clicking on polaroids
const polaroidCards = document.querySelectorAll('.polaroid');
polaroidCards.forEach(polaroid => {
    polaroid.addEventListener('click', function(e) {
        createHeartBurst(e.pageX, e.pageY);
    });
});

function createHeartBurst(x, y) {
    const hearts = ['💕', '💖', '💗', '💓', '💝'];
    
    for (let i = 0; i < 8; i++) {
        const heart = document.createElement('div');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.position = 'absolute';
        heart.style.left = x + 'px';
        heart.style.top = y + 'px';
        heart.style.fontSize = '1.5em';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '9999';
        
        const angle = (Math.PI * 2 * i) / 8;
        const distance = 50;
        const targetX = x + Math.cos(angle) * distance;
        const targetY = y + Math.sin(angle) * distance;
        
        heart.style.transition = 'all 0.8s ease-out';
        document.body.appendChild(heart);
        
        setTimeout(() => {
            heart.style.left = targetX + 'px';
            heart.style.top = targetY + 'px';
            heart.style.opacity = '0';
            heart.style.transform = 'scale(2)';
        }, 10);
        
        setTimeout(() => heart.remove(), 800);
    }
}

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Random sticker positions on page load for variety
window.addEventListener('load', function() {
    const stickers = document.querySelectorAll('.sticker');
    stickers.forEach(sticker => {
        const randomDelay = Math.random() * 2;
        sticker.style.animationDelay = randomDelay + 's';
    });
});