document.addEventListener('DOMContentLoaded', function () { //switch to load if using images from api/3rd party
  const canvas = document.getElementById('canvas1');
  const ctx = canvas.getContext('2d');
  canvas.width = 500;
  canvas.height = 800;

  class Game {
    constructor(ctx, width, height) {
      this.enemyTypes = ['worm', 'ghost', 'spider'];
      this.ctx = ctx;
      this.width = width;
      this.height = height;
      this.enemies = [];
      this.#addNewEnemy();
      this.enemyInterval = 500;
      this.enemyTimer = 0;
    }
    update(dt) {
      this.enemies = this.enemies.filter(obj => !obj.markedForDeletion);
      if (this.enemyTimer > this.enemyInterval) {
        this.#addNewEnemy();
        this.enemyTimer = 0;
      } else {
        this.enemyTimer += dt;
      }
      this.enemies.forEach(obj => obj.update(dt));
    }
    draw() {
      this.enemies.forEach(obj => obj.draw(this.ctx));
    }
    #addNewEnemy() {
      const randomEnemy = this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)];
      console.log(randomEnemy);
      if (randomEnemy == 'worm') this.enemies.push(new Worm(this));
      else if (randomEnemy == 'ghost') this.enemies.push(new Ghost(this));
      else if (randomEnemy == 'spider') this.enemies.push(new Spider(this));
      // this.enemies.sort((a, b) => a.y - b.y);
    }
  }

  class Enemy {
    constructor(game) {
      this.game = game;
      this.markedForDeletion = false;
      this.frameX;
      this.maxFrame = 5;
      this.frameInterval = 100;
      this.frameaTimer = 0;
    }
    update(dt) {
      this.x -= this.vx * dt;

      if (this.x < 0 - this.width) this.markedForDeletion = true;
      if (this.frameaTimer > this.frameInterval) {
        if (this.frameX < this.maxFrame) this.frameX++;
        else this.frameX = 0;
        this.frameaTimer = 0;
      } else {
        this.frameaTimer += dt;
      }
    }
    draw(ctx) {
      ctx.drawImage(this.image, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);

    }
  }

  class Worm extends Enemy {
    constructor(game) {
      super(game);
      this.spriteWidth = 229;
      this.spriteHeight = 171;
      this.width = this.spriteWidth * .5;
      this.height = this.spriteHeight * .5;
      this.x = this.game.width;
      this.y = this.game.height - this.height;
      this.image = worm;
      this.vx = Math.random() * .1 + .1;
    }
  }

  class Ghost extends Enemy {
    constructor(game) {
      super(game);
      this.spriteWidth = 261;
      this.spriteHeight = 209;
      this.width = this.spriteWidth * .5;
      this.height = this.spriteHeight * .5;
      this.x = this.game.width;
      this.y = this.game.height * Math.random() * .5;
      this.image = ghost;
      this.vx = Math.random() * .1 + .3;
      this.angle = 0;
      this.curve = Math.random() * 3;
    }
    update(dt) {
      super.update(dt);
      this.y += this.curve * Math.sin(this.angle);
      this.angle += .04;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = .7
      super.draw(ctx);
      ctx.restore();
    }
  }

  class Spider extends Enemy {
    constructor(game) {
      super(game);
      this.spriteWidth = 310;
      this.spriteHeight = 175;
      this.width = this.spriteWidth * .5;
      this.height = this.spriteHeight * .5;
      this.x = Math.random() * this.game.width;
      this.y = 0 - this.height;
      this.image = spider;
      this.vx = 0;
      this.vy = Math.random() * .1 + .1;
      this.maxLength = Math.random() * this.game.height;
    }
    update(dt) {
      super.update(dt);
      if (this.y < 0 - this.height * 2) this.markedForDeletion = true;
      this.y += this.vy * dt;
      if (this.y > this.maxLength) this.vy *= -1;
    }
    draw(ctx) {
      ctx.beginPath();
      ctx.moveTo(this.x + this.width/2, 0);
      ctx.lineTo(this.x + this.width/2, this.y + 10);
      ctx.stroke();
      super.draw(ctx);
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