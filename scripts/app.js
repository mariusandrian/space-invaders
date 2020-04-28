console.log('connected');
let frame = 0;
let lastFrame = 0;
let playerShip;
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
let bulletLaunch = 0;

class component {
    constructor (width, height, color, x, y) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.speedX = 0;
        this.speedY = 0;
        this.color = color;
        this.bullets = [];
    }
    update () {
        let ctx = myGameArea.context;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    getSpeed () {
        // move up
        if (myGameArea.key && myGameArea.key[38] === true) {
            this.speedY -= 3;
        }
        //move down
        if (myGameArea.key && myGameArea.key[40] === true) {
            this.speedY += 3;
        }
       //move left
       if (myGameArea.key && myGameArea.key[37] === true) {
            this.speedX -= 3;
       }
       // move right
       if (myGameArea.key && myGameArea.key[39] === true) {
            this.speedX += 3;
       } 
    }
    isShoot () {
        if (myGameArea.key && myGameArea.key[32] === true) {
            
            // console.log(this.bullets);
        }
    }
    updatePosition () {
        if (this.isCollideWithWall() === false){
            this.x += this.speedX;
            this.y += this.speedY;
        }
        
    }
    resetSpeed () {
        this.speedX = 0;
        this.speedY = 0;
    }
    isCollideWithWall () {
        
        if (this.x + this.speedX < 0 || this.x + this.speedX + playerShip.width >= frameSize.width || this.y + this.speedY <= 0 || this.y + this.speedY + playerShip.height >= frameSize.height) {
            return true;
        }
        else return false;
    }
    generateBullet () {
        console.log('bang');
    }
};

// class userBullet extends component {
//     constructor(x, y) {
//         super(10, 20, "blue",x , y)
//         this.speedY = -5;
//     }
//     updatePosition () {
//         this.y += this.speedY;
//     }
// }
// Generate player bullet upon space bar press
generatePlayerBullet = () => {
    if ((lastFrame === 0) || (myGameArea.key[32] && (frame - lastFrame > 10))) {
        let bullet = new component(5, 20, "blue",playerShip.x , playerShip.y);
        bullet.speedY = -10;
        lastFrame = frame;
        // console.log(bullet);
        playerShip.bullets.push(bullet);
        // console.log(playerShip.bullets);
    }
}
// Draw player bullet per frame
movePlayerBullet = () => {
    for (let bullet of playerShip.bullets) {
        bullet.y += bullet.speedY;
        bullet.update();
    }
}

const myGameArea = {
    canvas : document.createElement("canvas"),
    start () {
        this.canvas.width = frameSize.width;
        this.canvas.height = frameSize.height;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        
        // Initialize key array as false
        this.key = [];

        // Repeat main loop at ~ 60 FPS
        this.interval = setInterval(updateGameArea,16);

        document.addEventListener("keydown", (event) => {
            myGameArea.key = (myGameArea.key || []);
            myGameArea.key[event.keyCode] = true;
        });
        document.addEventListener("keyup", (event) => {
            myGameArea.key[event.keyCode] = false;
        });

        // Press space - code 32 to launch a new bullet
        document.addEventListener("keydown", (event) => {
            myGameArea.key[event.keyCode] = true;
            console.log('space pressed');
            // if (event.keyCode === 32) {
            //     bulletLaunch = 1;
                // console.log(bulletLaunch);
            // }
        });
        document.addEventListener("keyup", (event) => {
            myGameArea.key[event.keyCode] = false;
        });
    },
    clear () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
};

// Main Loop
const updateGameArea = () => {
    myGameArea.clear();
    playerShip.resetSpeed();
    generatePlayerBullet();
    playerShip.isShoot();
    movePlayerBullet();
    playerShip.getSpeed();
    playerShip.isCollideWithWall();
    playerShip.updatePosition();
    playerShip.update();
    
    // if (bulletLaunch === 1) {
    //     console.log('bullet Launch = 1');
        
    //     myUserBullet.updatePosition();
    //     myUserBullet.update();
    // }
    // bulletLaunch = 0;
    frame++;
    if (frame < 100) {
        console.log(frame);
    }
    
    
}


const startGame = () => {
    playerShip = new component(30, 30, "green", 190, 420);
    // myUserBullet = new userBullet(playerShip.x + 11, playerShip.y - 30);
    myGameArea.start();
}