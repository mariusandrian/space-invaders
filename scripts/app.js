console.log('connected');

let myGamePiece;
const arrowKeys = {
    up:38,
    down:40,
    left:37,
    right:39
};

const frameSize = {
    height: 500,
    width: 400
};

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
        if (myGameArea.key && myGameArea.key[38] === true) {
            this.speedY -= 2;
        }
        //move down
        if (myGameArea.key && myGameArea.key[40] === true) {
            this.speedY += 2;
        }
       //move left
       if (myGameArea.key && myGameArea.key[37] === true) {
            this.speedX -= 2;
       }
       // move right
       if (myGameArea.key && myGameArea.key[39] === true) {
            this.speedX += 2;
       } 
        
        this.x += this.speedX;
        this.y += this.speedY;
    }
    resetSpeed () {
        this.speedX = 0;
        this.speedY = 0;
    }
    checkCollision () {
        if (this.x <= 0) {this.x = 0}
        else if (this.x + myGamePiece.width >= frameSize.width) {this.x = frameSize.width - myGamePiece.width}
        else if (this.y <= 0) {this.y = 0}
        else if (this.y + myGamePiece.height >= frameSize.height) {this.y = frameSize.height - myGamePiece.height}; 
    }
};


const myGameArea = {
    canvas : document.createElement("canvas"),
    start () {
      this.canvas.width = frameSize.width;
      this.canvas.height = frameSize.height;
      this.context = this.canvas.getContext("2d");
      document.body.insertBefore(this.canvas, document.body.childNodes[0]);
      this.interval = setInterval(updateGameArea,16);
      document.addEventListener("keydown", (event) => {
        myGameArea.key = (myGameArea.key || []);
        myGameArea.key[event.keyCode] = true;
      });
      document.addEventListener("keyup", (event) => {
        myGameArea.key[event.keyCode] = false;
      });
    },
    clear () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
};

const updateGameArea = () => {
    myGameArea.clear();
    myGamePiece.resetSpeed();
    
    myGamePiece.updatePosition();
    // console.log(myGamePiece.y);
    // myGamePiece.x -= 1;
    myGamePiece.checkCollision();
    myGamePiece.update();
}


const startGame = () => {
    myGamePiece = new component(30, 30, "green", 190, 420);
    myGameArea.start();
}