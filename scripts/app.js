console.log('connected');

let myGamePiece;
const arrowKeys = {
    up:38,
    down:40,
    left:37,
    right:39
};

const arrowKeysArray = ['38', '40', '37', '39'];

class component {
    constructor (width, height, color, x, y) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.speedX = 0;
        this.speedY = 0;
        this.color = color;
    }
    update () {
        let ctx = myGameArea.context;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    updatePosition () {
        // move up
        if (myGameArea.key && myGameArea.key === arrowKeys.up) {
            this.speedY -= 2;
        }
        //move down
        if (myGameArea.key && myGameArea.key === arrowKeys.down) {
            this.speedY += 2;
        }
       //move left
       if (myGameArea.key && myGameArea.key === arrowKeys.left) {
            this.speedX -= 2;
       }
       // move right
       if (myGameArea.key && myGameArea.key === arrowKeys.right) {
            this.speedX += 2;
       } 
        
        this.x += this.speedX;
        this.y += this.speedY;
    }
    resetSpeed () {
        this.speedX = 0;
        this.speedY = 0;
    }
};


const myGameArea = {
    canvas : document.createElement("canvas"),
    start () {
      this.canvas.width = 400;
      this.canvas.height = 500;
      this.context = this.canvas.getContext("2d");
      document.body.insertBefore(this.canvas, document.body.childNodes[0]);
      this.interval = setInterval(updateGameArea,16);
      document.addEventListener("keydown", () => {
          myGameArea.key = event.keyCode;
        }
      );
      document.addEventListener("keyup", () => {
          myGameArea.key = false;
        }
      );
    },
    clear () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
};

const updateGameArea = () => {
    myGameArea.clear();
    myGamePiece.resetSpeed();
    myGamePiece.updatePosition();
    // myGamePiece.x -= 1;
    myGamePiece.update();
}

const updateUserLocation = (event) => {
    console.log(event.keyCode);
    //move up
    
}


const startGame = () => {
    myGamePiece = new component(30, 30, "green", 190, 420);
    myGameArea.start();
}