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
      this.speedX = 0;
      this.speedY = 0;
      this.dx = 0; // Distance between mouse and player horizontally
      this.dy = 0; // Distance between mouse and player vertically
      this.speedModifier =  5;
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
    
    update(){
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
      
      if(distance > this.speedModifier){
        this.speedX = this.dx / distance || 0;
        this.speedY = this.dy / distance || 0;
      }else{
        this.speedX = 0;
        this.speedY = 0;
      }
      
      this.collisionX += this.speedX * this.speedModifier;
      this.collisionY += this.speedY * this.speedModifier;
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
        if(this.mouse.pressed){
          this.mouse.x = e.offsetX;
          this.mouse.y = e.offsetY;
        }
      });
      
    }

    render(context) {
      this.player.draw(context);
      this.player.update();
    }
  }

  const game = new Game(canvas);
  
  // Animation loop to draw and update game
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear old paint, prevents trails
    game.render(ctx);
    window.requestAnimationFrame(animate); // create endless loop
  }
  
  animate();
});
