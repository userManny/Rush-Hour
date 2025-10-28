const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const carImg = new Image();
carImg.src = "redCar.png";

let carX, carY, enemies, score, gameRunning;

const carWidth = 100;
const carHeight = 100;
const enemyWidth = 40;
const enemyHeight = 80;

// UI Elements
const menu = document.getElementById("menu");
const instructionsBox = document.getElementById("instructions");
const gameOverScreen = document.getElementById("gameOver");
const finalScore = document.getElementById("finalScore");

// Buttons
document.getElementById("startBtn").onclick = startGame;
document.getElementById("instructionsBtn").onclick = () => {
  instructionsBox.classList.remove("hidden");
};
document.getElementById("backBtn").onclick = () => {
  instructionsBox.classList.add("hidden");
};
document.getElementById("quitBtn").onclick = () => window.close();
document.getElementById("restartBtn").onclick = startGame;
document.getElementById("backToMenuBtn").onclick = () => {
  gameOverScreen.classList.add("hidden");
  menu.classList.remove("hidden");
};

document.addEventListener("keydown", (e) => {
  if (!gameRunning) return;
  if (e.key === "a" || e.key === "ArrowLeft") carX -= 20;
  if (e.key === "d" || e.key === "ArrowRight") carX += 20;

  // Keep car inside road
  if (carX < 50) carX = 50;
  if (carX > 310) carX = 310;
});

function startGame() {
  menu.classList.add("hidden");
  gameOverScreen.classList.add("hidden");

  carX = 180;
  carY = 400;
  score = 0;
  enemies = [];
  gameRunning = true;

requestAnimationFrame(gameLoop);

}

function spawnEnemy() {
  const x = 50 + Math.random() * 260;
  enemies.push({ x: x, y: -enemyHeight });
}

function drawCar() {
  ctx.drawImage(carImg, carX, carY, carWidth, carHeight);
}

function drawEnemies() {
  ctx.fillStyle = "yellow";
  enemies.forEach((enemy) => {
    ctx.fillRect(enemy.x, enemy.y, enemyWidth, enemyHeight);
  });
}

function updateEnemies() {
  enemies.forEach((enemy) => (enemy.y += 5));
  enemies = enemies.filter((enemy) => enemy.y < canvas.height + 50);
}

function checkCollision() {
  for (let enemy of enemies) {
    if (
      carX < enemy.x + enemyWidth &&
      carX + carWidth > enemy.x &&
      carY < enemy.y + enemyHeight &&
      carY + carHeight > enemy.y
    ) {
      gameOver();
    }
  }
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 25);
}

function gameOver() {
  gameRunning = false;
  finalScore.textContent = `Your Score: ${score}`;
  gameOverScreen.classList.remove("hidden");
}

let frameCount = 0;
function gameLoop() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  frameCount++;
  if (frameCount % 60 === 0) {
    spawnEnemy();
  }

  drawCar();
  updateEnemies();
  drawEnemies();
  checkCollision();
  drawScore();

  // Increase score over time
  if (frameCount % 30 === 0) score++;

  requestAnimationFrame(gameLoop);
}
// ✅ Touch Controls for Mobile
let touchStartX = null;

canvas.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
});

canvas.addEventListener("touchmove", (e) => {
  if (!gameRunning) return;
  const touchX = e.touches[0].clientX;

  // Move car based on finger movement
  if (touchStartX !== null) {
    const diff = touchX - touchStartX;
    carX += diff * 0.2; // adjust sensitivity if needed
    if (carX < 50) carX = 50;
    if (carX > 310) carX = 310;
  }

  touchStartX = touchX;
});

canvas.addEventListener("touchend", () => {
  touchStartX = null;
});


