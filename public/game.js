const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// UI Elements
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const hud = document.getElementById('hud');
const scoreDisplays = {
    current: document.getElementById('current-score'),
    final: document.getElementById('final-score')
};
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const submitScoreBtn = document.getElementById('submit-score-btn');
const playerNameInput = document.getElementById('player-name');
const startHighscores = document.getElementById('start-highscores');
const gameoverHighscores = document.getElementById('gameover-highscores');
const nameInputSection = document.getElementById('name-input-section');

// Game constants
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 600;
const ROAD_WIDTH = 260;
const ROAD_X = (CANVAS_WIDTH - ROAD_WIDTH) / 2;
const CAR_WIDTH = 30;
const CAR_HEIGHT = 50;
const BASE_SPEED = 5;

// Game State
let state = 'START'; // START, PLAYING, GAMEOVER
let score = 0;
let speed = BASE_SPEED;
let frameCount = 0;
let animationId;

// Game Objects
const player = {
    x: CANVAS_WIDTH / 2 - CAR_WIDTH / 2,
    y: CANVAS_HEIGHT - CAR_HEIGHT - 20,
    width: CAR_WIDTH,
    height: CAR_HEIGHT,
    color: '#00ffff',
    speed: 5,
    dx: 0
};

let obstacles = [];
let lines = [];

// Input handling
const keys = {
    ArrowLeft: false,
    ArrowRight: false,
    a: false,
    d: false
};

window.addEventListener('keydown', (e) => {
    if (keys.hasOwnProperty(e.key)) keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.key)) keys[e.key] = false;
});

// Initialization
function init() {
    fetchHighScores();
    
    // Setup initial road lines
    for (let i = 0; i < CANVAS_HEIGHT; i += 40) {
        lines.push({ y: i });
    }

    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);
    submitScoreBtn.addEventListener('click', submitScore);
}

function resetGame() {
    player.x = CANVAS_WIDTH / 2 - CAR_WIDTH / 2;
    player.dx = 0;
    obstacles = [];
    score = 0;
    speed = BASE_SPEED;
    frameCount = 0;
    scoreDisplays.current.innerText = score;
}

function startGame() {
    state = 'PLAYING';
    resetGame();
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    hud.classList.remove('hidden');
    loop();
}

function gameOver() {
    state = 'GAMEOVER';
    cancelAnimationFrame(animationId);
    hud.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');
    scoreDisplays.final.innerText = score;
    playerNameInput.value = '';
    nameInputSection.style.display = 'block';
    fetchHighScores();
}

// Logic updates
function update() {
    frameCount++;
    
    // Increase difficulty
    if (frameCount % 300 === 0) {
        speed += 0.5;
    }

    // Score update
    if (frameCount % 10 === 0) {
        score++;
        scoreDisplays.current.innerText = score;
    }

    // Player movement
    if (keys.ArrowLeft || keys.a) {
        player.x -= player.speed;
    }
    if (keys.ArrowRight || keys.d) {
        player.x += player.speed;
    }

    // Boundary collision
    if (player.x < ROAD_X) player.x = ROAD_X;
    if (player.x + player.width > ROAD_X + ROAD_WIDTH) player.x = ROAD_X + ROAD_WIDTH - player.width;

    // Road lines animation
    for (let i = 0; i < lines.length; i++) {
        lines[i].y += speed;
        if (lines[i].y >= CANVAS_HEIGHT) {
            lines[i].y -= CANVAS_HEIGHT;
        }
    }

    // Spawn obstacles
    if (frameCount % Math.max(20, Math.floor(80 - speed * 2)) === 0) {
        const obsWidth = CAR_WIDTH + Math.random() * 20;
        const maxPos = ROAD_WIDTH - obsWidth;
        obstacles.push({
            x: ROAD_X + Math.random() * maxPos,
            y: -CAR_HEIGHT,
            width: obsWidth,
            height: CAR_HEIGHT,
            color: Math.random() > 0.5 ? '#ff0055' : '#ffaa00'
        });
    }

    // Update and prune obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.y += speed;

        // Collision detection
        if (
            player.x < obs.x + obs.width &&
            player.x + player.width > obs.x &&
            player.y < obs.y + obs.height &&
            player.height + player.y > obs.y
        ) {
            gameOver();
            return;
        }

        // Remove offscreen obstacles
        if (obs.y > CANVAS_HEIGHT) {
            obstacles.splice(i, 1);
        }
    }
}

// Rendering
function draw() {
    // Clear canvas
    ctx.fillStyle = '#0a400a'; // Grass
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw Road
    ctx.fillStyle = '#333';
    ctx.fillRect(ROAD_X, 0, ROAD_WIDTH, CANVAS_HEIGHT);

    // Draw Road Borders
    ctx.fillStyle = '#fff';
    ctx.fillRect(ROAD_X - 5, 0, 5, CANVAS_HEIGHT);
    ctx.fillRect(ROAD_X + ROAD_WIDTH, 0, 5, CANVAS_HEIGHT);

    // Draw Center Dashed Line
    ctx.fillStyle = '#fff';
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].y % 40 < 20) {
            ctx.fillRect(CANVAS_WIDTH / 2 - 2, lines[i].y, 4, 20);
        }
    }

    // Draw Player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    // Draw wheels
    ctx.fillStyle = '#000';
    ctx.fillRect(player.x - 2, player.y + 5, 4, 10);
    ctx.fillRect(player.x + player.width - 2, player.y + 5, 4, 10);
    ctx.fillRect(player.x - 2, player.y + player.height - 15, 4, 10);
    ctx.fillRect(player.x + player.width - 2, player.y + player.height - 15, 4, 10);


    // Draw Obstacles
    for (let obs of obstacles) {
        ctx.fillStyle = obs.color;
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    }
}

// Main loop
function loop() {
    if (state !== 'PLAYING') return;
    update();
    draw();
    animationId = requestAnimationFrame(loop);
}

// API Interactions
async function fetchHighScores() {
    try {
        const response = await fetch('/api/scores');
        const scores = await response.json();
        
        let html = '';
        scores.forEach((s, i) => {
            html += `<li><span>${i+1}. ${s.name}</span> <span>${s.score}</span></li>`;
        });
        
        if (scores.length === 0) {
            html = '<li>No scores yet!</li>';
        }

        startHighscores.innerHTML = html;
        gameoverHighscores.innerHTML = html;
    } catch (err) {
        console.error('Failed to fetch scores', err);
    }
}

async function submitScore() {
    const name = playerNameInput.value.trim().substring(0, 10);
    if (!name) return alert('Please enter a name!');

    try {
        const response = await fetch('/api/scores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, score })
        });
        
        if (response.ok) {
            nameInputSection.style.display = 'none';
            fetchHighScores();
        } else {
            alert('Error saving score');
        }
    } catch (err) {
        console.error('Failed to save score', err);
    }
}

init();
