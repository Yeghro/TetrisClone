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
  lightningCtx.strokeStyle = "rgba(128, 0, 128, 0.8)";
  lightningCtx.lineWidth = 2;
  lightningCtx.beginPath();
  lightningCtx.moveTo(Math.random() * lightningCanvas.width, 0);

  let y = 0;
  while (y < lightningCanvas.height) {
    let x = Math.random() * lightningCanvas.width;
    y += Math.random() * 50 + 50;
    lightningCtx.lineTo(x, y);
  }

  lightningCtx.stroke();

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
