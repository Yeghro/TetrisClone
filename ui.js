const canvas = document.getElementById("tetrisCanvas");
const ctx = canvas.getContext("2d");
const lightningCanvas = document.getElementById("lightningCanvas");
const lightningCtx = lightningCanvas.getContext("2d");

function draw() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw board
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      if (board[y][x]) {
        ctx.fillStyle = board[y][x];
        ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        ctx.strokeStyle = "#000";
        ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      }
    }
  }

  // Draw current piece
  ctx.fillStyle = currentColor;
  for (let y = 0; y < currentPiece.length; y++) {
    for (let x = 0; x < currentPiece[y].length; x++) {
      if (currentPiece[y][x]) {
        ctx.fillRect(
          (currentX + x) * BLOCK_SIZE,
          (currentY + y) * BLOCK_SIZE,
          BLOCK_SIZE,
          BLOCK_SIZE
        );
        ctx.strokeStyle = "#000";
        ctx.strokeRect(
          (currentX + x) * BLOCK_SIZE,
          (currentY + y) * BLOCK_SIZE,
          BLOCK_SIZE,
          BLOCK_SIZE
        );
      }
    }
  }
}

function updateHUD() {
  document.getElementById("scoreDisplay").textContent = score;
  document.getElementById("levelDisplay").textContent = level;
  document.getElementById("linesDisplay").textContent = lines;
}

function drawLightning() {
  lightningCtx.clearRect(0, 0, lightningCanvas.width, lightningCanvas.height);

  const numBolts = Math.floor(Math.random() * 3) + 1;

  for (let i = 0; i < numBolts; i++) {
    const startX = Math.random() * lightningCanvas.width;
    const endX = startX + (Math.random() - 0.5) * 100;
    const bolt = new LightningBolt(
      startX,
      0,
      endX,
      lightningCanvas.height,
      lightningCtx
    );
    bolt.draw();
  }

  setTimeout(() => {
    lightningCtx.clearRect(0, 0, lightningCanvas.width, lightningCanvas.height);
  }, 100);
}

function showStartMenu() {
  gameState = "menu";
  document.getElementById("startMenu").style.display = "block";
  document.getElementById("pauseMenu").style.display = "none";
}

function showPauseMenu() {
  document.getElementById("pauseMenu").style.display = "block";
}

function hidePauseMenu() {
  document.getElementById("pauseMenu").style.display = "none";
}

function hideStartMenu() {
  document.getElementById("startMenu").style.display = "none";
}
