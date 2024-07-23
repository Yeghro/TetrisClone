let gameState = "menu"; // 'menu', 'playing', 'paused', 'gameover'
let lastTime = 0;
let dropCounter = 0;
let dropInterval = 1000; // 1 second

const keys = {
  left: { pressed: false, repeat: false, lastTime: 0 },
  right: { pressed: false, repeat: false, lastTime: 0 },
  down: false,
  up: false,
};

const DAS_DELAY = 200; // Initial delay before auto-repeat (milliseconds)
const DAS_INTERVAL = 100; // Time between auto-repeat moves (milliseconds)
const MOVE_INTERVAL = 100; // Minimum time between moves (milliseconds)

let lastMoveTime = 0;

function setGameState(newState) {
  gameState = newState;
  if (newState === "gameover") {
    cancelAnimationFrame(gameLoopId);
  }
}

function startGame() {
  initGame();
  setGameState("playing");
  hideStartMenu();
  hidePauseMenu();
  lastTime = 0;
  dropCounter = 0;
  lastMoveTime = 0;
  gameLoopId = requestAnimationFrame(gameLoop);
}

function pauseGame() {
  if (gameState === "playing") {
    setGameState("paused");
    showPauseMenu();
  }
}

function resumeGame() {
  if (gameState === "paused") {
    setGameState("playing");
    hidePauseMenu();
    lastTime = 0;
    gameLoopId = requestAnimationFrame(gameLoop);
  }
}

function adjustDifficulty() {
  dropInterval = Math.max(200, 1000 - (level - 1) * 50); // Slower decrease, min 200ms
}

function handleKeyState(currentTime) {
  if (currentTime - lastMoveTime < MOVE_INTERVAL) {
    return; // Don't allow moves more frequently than MOVE_INTERVAL
  }

  if (keys.left.pressed) {
    if (!keys.left.repeat) {
      if (isValidMove(-1, 0)) {
        currentX--;
        lastMoveTime = currentTime;
      }
      if (currentTime - keys.left.lastTime > DAS_DELAY) {
        keys.left.repeat = true;
      }
    } else if (currentTime - keys.left.lastTime > DAS_INTERVAL) {
      if (isValidMove(-1, 0)) {
        currentX--;
        lastMoveTime = currentTime;
      }
      keys.left.lastTime = currentTime;
    }
  }

  if (keys.right.pressed) {
    if (!keys.right.repeat) {
      if (isValidMove(1, 0)) {
        currentX++;
        lastMoveTime = currentTime;
      }
      if (currentTime - keys.right.lastTime > DAS_DELAY) {
        keys.right.repeat = true;
      }
    } else if (currentTime - keys.right.lastTime > DAS_INTERVAL) {
      if (isValidMove(1, 0)) {
        currentX++;
        lastMoveTime = currentTime;
      }
      keys.right.lastTime = currentTime;
    }
  }

  if (keys.down) {
    if (currentTime - lastMoveTime > MOVE_INTERVAL) {
      moveDown();
      lastMoveTime = currentTime;
    }
  }

  if (keys.up) {
    rotate();
    keys.up = false; // Prevent continuous rotation
    lastMoveTime = currentTime;
  }
}

let gameLoopId;

function gameLoop(time = 0) {
  if (gameState !== "playing") return;

  const deltaTime = time - lastTime;
  lastTime = time;

  dropCounter += deltaTime;
  if (dropCounter > dropInterval) {
    moveDown();
    dropCounter = 0;
  }

  handleKeyState(time);
  draw();

  gameLoopId = requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (event) => {
  if (gameState === "playing") {
    switch (event.keyCode) {
      case 37: // Left arrow
        if (!keys.left.pressed) {
          keys.left.pressed = true;
          keys.left.repeat = false;
          keys.left.lastTime = performance.now();
        }
        break;
      case 39: // Right arrow
        if (!keys.right.pressed) {
          keys.right.pressed = true;
          keys.right.repeat = false;
          keys.right.lastTime = performance.now();
        }
        break;
      case 40: // Down arrow
        keys.down = true;
        break;
      case 38: // Up arrow
        keys.up = true;
        break;
      case 80: // 'P' key
      case 27: // ESC key
        pauseGame();
        break;
    }
  } else if (gameState === "paused" && event.keyCode === 27) {
    // ESC key
    resumeGame();
  }
});

document.addEventListener("keyup", (event) => {
  if (gameState === "playing") {
    switch (event.keyCode) {
      case 37: // Left arrow
        keys.left.pressed = false;
        keys.left.repeat = false;
        break;
      case 39: // Right arrow
        keys.right.pressed = false;
        keys.right.repeat = false;
        break;
      case 40: // Down arrow
        keys.down = false;
        break;
      case 38: // Up arrow
        keys.up = false;
        break;
    }
  }
});

document.getElementById("startButton").addEventListener("click", startGame);
document.getElementById("resumeButton").addEventListener("click", resumeGame);
document.getElementById("restartButton").addEventListener("click", startGame);
document.getElementById("quitButton").addEventListener("click", showStartMenu);

showStartMenu();
