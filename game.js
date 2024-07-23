const BLOCK_SIZE = 30;
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

const SHAPES = [
  [[1, 1, 1, 1]],
  [
    [1, 1],
    [1, 1],
  ],
  [
    [1, 1, 1],
    [0, 1, 0],
  ],
  [
    [1, 1, 1],
    [1, 0, 0],
  ],
  [
    [1, 1, 1],
    [0, 0, 1],
  ],
  [
    [1, 1, 0],
    [0, 1, 1],
  ],
  [
    [0, 1, 1],
    [1, 1, 0],
  ],
];

const COLORS = [
  "#00FFFF",
  "#FFFF00",
  "#800080",
  "#FF0000",
  "#0000FF",
  "#00FF00",
  "#FFA500",
];

let board, currentPiece, currentX, currentY, currentColor;
let score, level, lines;

function newPiece() {
  const shapeIndex = Math.floor(Math.random() * SHAPES.length);
  currentPiece = SHAPES[shapeIndex];
  currentColor = COLORS[shapeIndex];
  currentX =
    Math.floor(BOARD_WIDTH / 2) - Math.floor(currentPiece[0].length / 2);
  currentY = 0;

  if (!isValidMove(0, 0)) {
    gameOver();
  }
}

function isValidMove(offsetX, offsetY, newPiece = currentPiece) {
  for (let y = 0; y < newPiece.length; y++) {
    for (let x = 0; x < newPiece[y].length; x++) {
      if (newPiece[y][x]) {
        let newX = currentX + x + offsetX;
        let newY = currentY + y + offsetY;
        if (
          newX < 0 ||
          newX >= BOARD_WIDTH ||
          newY >= BOARD_HEIGHT ||
          (newY >= 0 && board[newY][newX])
        ) {
          return false;
        }
      }
    }
  }
  return true;
}

function rotate() {
  let newPiece = currentPiece[0].map((val, index) =>
    currentPiece.map((row) => row[index]).reverse()
  );
  if (isValidMove(0, 0, newPiece)) {
    currentPiece = newPiece;
  }
}

function merge() {
  for (let y = 0; y < currentPiece.length; y++) {
    for (let x = 0; x < currentPiece[y].length; x++) {
      if (currentPiece[y][x]) {
        board[currentY + y][currentX + x] = currentColor;
      }
    }
  }
}

function clearLines() {
  let linesCleared = 0;
  for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
    if (board[y].every((cell) => cell !== 0)) {
      board.splice(y, 1);
      board.unshift(Array(BOARD_WIDTH).fill(0));
      linesCleared++;
      y++; // Check the new line that dropped down
      drawLightning();
    }
  }
  if (linesCleared > 0) {
    lines += linesCleared;
    score += calculateScore(linesCleared);
    level = Math.floor(lines / 10) + 1;
    updateHUD();
    adjustDifficulty();
  }
}

function calculateScore(linesCleared) {
  const linePoints = [40, 100, 300, 1200]; // Points for 1, 2, 3, 4 lines
  return linePoints[linesCleared - 1] * level;
}

function moveDown() {
  if (isValidMove(0, 1)) {
    currentY++;
  } else {
    merge();
    clearLines();
    newPiece();
  }
  draw();
}

function gameOver() {
  setGameState("gameover");
  alert(`Game Over! Your score: ${score}`);
  showStartMenu();
}

function initGame() {
  board = Array(BOARD_HEIGHT)
    .fill()
    .map(() => Array(BOARD_WIDTH).fill(0));
  score = 0;
  level = 1;
  lines = 0;
  updateHUD();
  newPiece();
}
