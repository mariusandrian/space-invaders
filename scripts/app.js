console.log('connected');

let myGamePiece;

class component {
    constructor (width, height, color, x, y) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.color = color;
    }
    update () {
        let ctx = myGameArea.context;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
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
    },
    clear () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

const updateGameArea = () => {
    myGameArea.clear();
    // myGamePiece.x -= 1;
    myGamePiece.update();
}

const startGame = () => {
    myGamePiece = new component(30, 30, "green", 190, 420);
    myGameArea.start();
}