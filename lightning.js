const bgLightningCanvas = document.getElementById("lightningBackground");
const bgLightningCtx = bgLightningCanvas.getContext("2d");

function resizeCanvas() {
  bgLightningCanvas.width = window.innerWidth;
  bgLightningCanvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Export the LightningBolt class for use in other files
window.LightningBolt = class LightningBolt {
  constructor(startX, startY, endX, endY, ctx) {
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
    this.ctx = ctx;
    this.segments = [];
    this.color = Math.random() < 0.5 ? "#800080" : "#FFA500"; // Purple or Orange
    this.width = Math.random() * 3 + 1;
    this.generateSegments();
  }

  generateSegments() {
    let x = this.startX;
    let y = this.startY;
    this.segments.push({ x, y });

    while (y < this.endY) {
      const newX = x + (Math.random() - 0.5) * 50;
      const newY = y + Math.random() * 50 + 10;
      this.segments.push({ x: newX, y: newY });
      x = newX;
      y = newY;
    }

    this.segments.push({ x: this.endX, y: this.endY });
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.moveTo(this.segments[0].x, this.segments[0].y);
    for (let i = 1; i < this.segments.length; i++) {
      this.ctx.lineTo(this.segments[i].x, this.segments[i].y);
    }
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.width;
    this.ctx.stroke();

    // Add glow effect
    this.ctx.shadowColor = this.color;
    this.ctx.shadowBlur = 20;
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;
  }
};

let lightningBolts = [];

function createLightning() {
  const startX = Math.random() * bgLightningCanvas.width;
  const endX = startX + (Math.random() - 0.5) * 200;
  const bolt = new LightningBolt(
    startX,
    0,
    endX,
    bgLightningCanvas.height,
    bgLightningCtx
  );
  lightningBolts.push(bolt);

  setTimeout(() => {
    const index = lightningBolts.indexOf(bolt);
    if (index > -1) {
      lightningBolts.splice(index, 1);
    }
  }, 200);
}

function animateLightning() {
  bgLightningCtx.clearRect(
    0,
    0,
    bgLightningCanvas.width,
    bgLightningCanvas.height
  );

  for (const bolt of lightningBolts) {
    bolt.draw();
  }

  if (Math.random() < 0.03) {
    createLightning();
  }

  requestAnimationFrame(animateLightning);
}

animateLightning();
