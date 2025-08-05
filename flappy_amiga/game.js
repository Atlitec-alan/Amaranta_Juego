const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Cargar imagen del personaje
const birdImg = new Image();
birdImg.src = "mi_amiga.jpg"; // ← nombre de tu imagen .jpg

const bird = {
  x: 80,
  y: canvas.height / 2,
  width: 60,
  height: 60,
  velocity: 0,
  gravity: 0.3, // cae más lento
  jump: -8      // salto más suave
};

let pipes = [];
let pipeGap = 200; // espacio más amplio entre tubos
let pipeWidth = 60;
let pipeSpeed = 1.5; // movimiento más lento de los tubos
let frame = 0;
let gameRunning = false;
let score = 0;

const startBtn = document.getElementById("startBtn");
const scoreDisplay = document.getElementById("scoreDisplay");
const gameOverMsg = document.getElementById("gameOverMsg");
const winMsg = document.getElementById("winMsg");

startBtn.addEventListener("click", startGame);
document.addEventListener("keydown", jump);
canvas.addEventListener("click", jump);

function startGame() {
  bird.y = canvas.height / 2;
  bird.velocity = 0;
  pipes = [];
  frame = 0;
  score = 0;
  gameRunning = true;
  gameOverMsg.style.display = "none";
  winMsg.style.display = "none";
  startBtn.style.display = "none";
  scoreDisplay.textContent = "Puntos: 0";
  requestAnimationFrame(update);
}

function jump(e) {
  if (e.code === "Space" || e.type === "click") {
    bird.velocity = bird.jump;
  }
}

function update() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  if (frame % 150 === 0) {
    const topHeight = Math.random() * (canvas.height - pipeGap - 100) + 20;
    pipes.push({ x: canvas.width, top: topHeight, passed: false });
  }

  pipes.forEach((pipe, i) => {
    pipe.x -= pipeSpeed;
    ctx.fillStyle = "green";
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    ctx.fillRect(pipe.x, pipe.top + pipeGap, pipeWidth, canvas.height - pipe.top - pipeGap);

    if (
      bird.x + bird.width > pipe.x &&
      bird.x < pipe.x + pipeWidth &&
      (bird.y < pipe.top || bird.y + bird.height > pipe.top + pipeGap)
    ) {
      endGame(false);
    }

    if (!pipe.passed && pipe.x + pipeWidth < bird.x) {
      pipe.passed = true;
      score += 10;
      scoreDisplay.textContent = "Puntos: " + score;
      if (score >= 100) {
        endGame(true);
      }
    }

    if (pipe.x + pipeWidth < 0) {
      pipes.splice(i, 1);
    }
  });

  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    endGame(false);
  }

  frame++;
  requestAnimationFrame(update);
}

function endGame(won) {
  gameRunning = false;
  startBtn.style.display = "block";
  if (won) {
    winMsg.style.display = "block";
  } else {
    gameOverMsg.style.display = "block";
  }
}

