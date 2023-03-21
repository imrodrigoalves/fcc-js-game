window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 1280;
  canvas.height = 720;

  ctx.fillStyle = "white";
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'white';
  class Player {
    constructor(game) {
      this.game = game;
      this.collisionX = this.game.width * 0.5; // Defines position on X axis
      this.collisionY = this.game.height * 0.5; // Defines position on Y axis
      this.collisionRadius = 30; // Defines size of object
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
    }
  }

  class Game {
    constructor(canvas) {
      this.canvas = canvas;
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.player = new Player(this);
      
      this.mouse = {
        x: this.width * 0.5,
        y: this.height * 0.5,
        pressed: false
      };
      
      // automatically register event listeners upon instantiating
      
      this.canvas.addEventListener('mousedown', (e) => { // automatically inherit reference to this from parent scope
        // console.log(e.x, e.y); // gives coordinates from the top left
        // console.log(e.offsetX, e.offsetY); // gives coordinates from the click on the target node
        this.mouse.x = e.offsetX;
        this.mouse.y = e.offsetY;
        this.mouse.pressed = true;
      });
      
      this.canvas.addEventListener('mouseup', (e) => { // automatically inherit reference to this from parent scope
        // console.log(e.x, e.y); // gives coordinates from the top left
        // console.log(e.offsetX, e.offsetY); // gives coordinates from the click on the target node
        this.mouse.x = e.offsetX;
        this.mouse.y = e.offsetY;
        this.mouse.pressed = false;
      });
      
      this.canvas.addEventListener('mousemove', (e) => { // automatically inherit reference to this from parent scope
        // console.log(e.x, e.y); // gives coordinates from the top left
        // console.log(e.offsetX, e.offsetY); // gives coordinates from the click on the target node
        this.mouse.x = e.offsetX;
        this.mouse.y = e.offsetY;
      });
      
    }

    render(context) {
      this.player.draw(context);
    }
  }

  const game = new Game(canvas);
  game.render(ctx);

  // Animation loop to draw and update game
  function animate() {}
});
