document.addEventListener('DOMContentLoaded', function () { //switch to load if using images from api/3rd party
  const canvas = document.getElementById('canvas1');
  const ctx = canvas.getContext('2d');
  canvas.width = 500;
  canvas.height = 800;

  class Game {
    constructor(ctx, width, height) {
      this.ctx = ctx;
      this.width = width;
      this.height = height;
      this.enemies = [];
      this.#addNewEnemy();
      this.enemyInterval = 1000;
      this.enemyTimer = 0;
    }
    update(dt) {
      this.enemies = this.enemies.filter(obj => !obj.markedForDeletion);
      if (this.enemyTimer > this.enemyInterval) {
        this.#addNewEnemy();
        this.enemyTimer = 0;
        console.log(this.enemies);
      } else {
        this.enemyTimer += dt;
      }
      this.enemies.forEach(obj => obj.update());
    }
    draw() {
      this.enemies.forEach(obj => obj.draw(this.ctx));
    }
    #addNewEnemy() {
      this.enemies.push(new Enemy(this));
    }
  }

  class Enemy {
    constructor(game) {
      this.game = game;
      this.x = this.game.width;
      this.y = this.game.height * Math.random();
      this.width = 100;
      this.height = 100;
      this.markedForDeletion = false;
    }
    update() {
      this.x -= 1;

      if (this.x < 0 - this.width) {
        this.markedForDeletion = true;
      }
    }
    draw(ctx) {
      ctx.fillRect(this.x, this.y, this.width, this.height)
    }
  }

  const game = new Game(ctx, canvas.width, canvas.height);
  let lastTime = 1;
  function animate(timeStamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const dt = timeStamp - lastTime;
    lastTime = timeStamp;
    game.update(dt);
    game.draw();
    requestAnimationFrame(animate);
  }
  animate(0);
});