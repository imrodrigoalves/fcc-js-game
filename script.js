window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 1280;
  canvas.height = 720;

  ctx.fillStyle = "white";
  ctx.lineWidth = 2;
  ctx.strokeStyle = "white";
  class Player {
    constructor(game) {
      this.game = game;
      this.collisionX = this.game.width * 0.5; // Defines position on X axis
      this.collisionY = this.game.height * 0.5; // Defines position on Y axis
      this.collisionRadius = 30; // Defines size of object
      this.speedX = 0;
      this.speedY = 0;
      this.dx = 0; // Distance between mouse and player horizontally
      this.dy = 0; // Distance between mouse and player vertically
      this.speedModifier = 5;
    }

    draw(context) {
      context.beginPath();
      context.arc(
        this.collisionX,
        this.collisionY,
        this.collisionRadius,
        0,
        Math.PI * 2
      );

      // save() and restore() applies specific settings to selected shapes
      // without affecting other drawings

      context.save(); // Creates a snapshot of the current canvas status
      context.globalAlpha = 0.5; // Sets opacity of the shapes
      context.fill();
      context.restore(); // Restores previous status

      context.stroke();

      // new shape

      context.beginPath();
      context.moveTo(this.collisionX, this.collisionY); // draw starting points
      context.lineTo(this.game.mouse.x, this.game.mouse.y); // draw ending point
      context.stroke(); // draw the line
    }

    update() {
      // Technique 1:
      // Find diference between mouse position and player position. Divide to make it slower
      // Isn't a constant velocity because it decreases the closer it gets to the point
      // this.dx = this.game.mouse.x - this.collisionX;
      // this.dy = this.game.mouse.y - this.collisionY;
      // this.speedX = (this.dx) / 20;
      // this.speedY = (this.dy) / 20;

      // Technique 2:
      // Find hypotenuse (distance between teoria pitagoras)
      this.dx = this.game.mouse.x - this.collisionX;
      this.dy = this.game.mouse.y - this.collisionY;
      const distance = Math.hypot(this.dy, this.dx);

      if (distance > this.speedModifier) {
        this.speedX = this.dx / distance || 0;
        this.speedY = this.dy / distance || 0;
      } else {
        this.speedX = 0;
        this.speedY = 0;
      }

      this.collisionX += this.speedX * this.speedModifier;
      this.collisionY += this.speedY * this.speedModifier;
    }
  }

  class Obstacle {
    constructor(game) {
      this.game = game;
      this.collisionX = Math.random() * this.game.width;
      this.collisionY = Math.random() * this.game.height;
      this.collisionRadius = 100;
    }

    draw(context) {
      context.beginPath();
      context.arc(
        this.collisionX,
        this.collisionY,
        this.collisionRadius,
        0,
        Math.PI * 2
      );

      context.save();
      context.globalAlpha = 0.5;
      context.fill();
      context.restore();
      context.stroke();
    }
  }

  class Game {
    constructor(canvas) {
      this.canvas = canvas;
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.player = new Player(this);
      this.numberOfObstacles = 5;
      this.obstacles = [];
      this.mouse = {
        x: this.width * 0.5,
        y: this.height * 0.5,
        pressed: false,
      };

      // automatically register event listeners upon instantiating

      this.canvas.addEventListener("mousedown", (e) => {
        // automatically inherit reference to this from parent scope
        // console.log(e.x, e.y); // gives coordinates from the top left
        // console.log(e.offsetX, e.offsetY); // gives coordinates from the click on the target node
        this.mouse.x = e.offsetX;
        this.mouse.y = e.offsetY;
        this.mouse.pressed = true;
      });

      this.canvas.addEventListener("mouseup", (e) => {
        // automatically inherit reference to this from parent scope
        // console.log(e.x, e.y); // gives coordinates from the top left
        // console.log(e.offsetX, e.offsetY); // gives coordinates from the click on the target node
        this.mouse.x = e.offsetX;
        this.mouse.y = e.offsetY;
        this.mouse.pressed = false;
      });

      this.canvas.addEventListener("mousemove", (e) => {
        // automatically inherit reference to this from parent scope
        // console.log(e.x, e.y); // gives coordinates from the top left
        // console.log(e.offsetX, e.offsetY); // gives coordinates from the click on the target node
        if (this.mouse.pressed) {
          this.mouse.x = e.offsetX;
          this.mouse.y = e.offsetY;
        }
      });
    }

    init() {
      // for (let i = 0; i < this.numberOfObstacles; i++) {
      //   this.obstacles.push(new Obstacle(this));
      // }

      // circle packing algorith
      // it's a brute force algo, not smart that retries many times

      let attempts = 0;
      while (this.obstacles.length < this.numberOfObstacles && attempts < 500) {
        let testObstacle = new Obstacle(this);
        let overlap = false;

        this.obstacles.forEach((obstacle) => {
          // circle collision detection formula - calculate distance between center distance of two points

          const dx = testObstacle.collisionX - obstacle.collisionX; // horizontal distance
          const dy = testObstacle.collisionY - obstacle.collisionY; // vertical distance
          const distance = Math.hypot(dy, dx); // hypotenuse (pythagoras)

          const sumOfRadii =
            testObstacle.collisionRadius + obstacle.collisionRadius;

          if (distance < sumOfRadii) {
            overlap = true;
          }

        });
        
        if (!overlap) {
          this.obstacles.push(testObstacle);
        }
        
        attempts++;
      }
    }

    render(context) {
      this.player.draw(context);
      this.player.update();
      this.obstacles.forEach((obstacle) => {
        obstacle.draw(context);
      });
    }
  }

  const game = new Game(canvas);
  game.init();

  console.log(game);

  // Animation loop to draw and update game
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear old paint, prevents trails
    game.render(ctx);
    window.requestAnimationFrame(animate); // create endless loop
  }

  animate();
});
