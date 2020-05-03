console.log('connected');
let frame = 0;
let lastEnemyFrame = 0;
let lastBulletFrame = 0;
let playerShip;
let gameOverIndicator = false;
let enemyMultiplier = 0;
const enemies = {};
const bullets = {};
const enemyBullets = {};
let enemyBulletCount = 0;
let currentEnemyCount = 0;
let enemyCount = 1;
let bulletCount = 1;
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
let currentStage = 0;
const stages = {
    enemies: [20,30,40],
    bulletInterval: [200.150,100],
    enemySpawnInterval: [100, 80, 70]
}

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
        this.lastBulletShotTime = 0;
        this.startX = 0;
        this.startY = 0;
        this.endX = 0;
        this.endY = 0;
        // For enemy bullet calculation
        this.currentPercent = 0;
    }
    draw () {
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
    generateEnemyBullet () {
        // Limit the interval of shooting for the enemy
        if (this.lastBulletShotTime === 0 || frame - this.lastBulletShotTime > stages.bulletInterval[currentStage]) {
            let dx = playerShip.x - this.x;
            let dy = playerShip.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            // create bullet
            let enemyBullet = new component(5, 5, "magenta", this.x, this.y);
            enemyBullet.speedY = 5;
            enemyBullet.updatePosition = function() {
                this.x += 5 * (dx/distance);
                this.y += 5 * (dy/distance);
            }
            enemyBullets[enemyBulletCount] = enemyBullet;

            enemyBulletCount++;
            this.lastBulletShotTime = frame;
        } 
    }
    
};

generateEnemy = () => {
    // console.log(frame > 50 && (frame - lastEnemyFrame > 50));
    if ((frame > 50 && (frame - lastEnemyFrame > stages.enemySpawnInterval[currentStage]) || enemyMultiplier > 0) && currentEnemyCount <= stages.enemies[currentStage]) {
        // console.log('create enemy');
        let originXOfEnemy = Math.round(Math.random() * (frameSize.width-30));
        let enemyShip = new component(30, 30, "red", originXOfEnemy, 0);
        
        enemyShip.speedY = Math.round(Math.random() * 2) + 1;
        // Math.round(Math.random() * 4) + 4 ;
        enemyShip.updatePosition = function () {
            this.y += this.speedY;
            this.x = originXOfEnemy + 0.1 * (frameSize.width * Math.sin(0.05*this.y));
        };
        // console.log('create enemy')
        enemies[enemyCount] = enemyShip;
        enemyCount++;
        // console.log(enemies);
        lastEnemyFrame = frame;
        currentEnemyCount++;
        console.log(currentEnemyCount);
    }
}

drawAllEnemies = () => {
    const objects = Object.values(enemies);
    for (const object of objects) {
        // console.log('draw enemy');
        object.draw();
    }
}

moveAllEnemies = () => {
    const objects = Object.values(enemies);
    for (const object of objects) {
        // console.log('draw enemy');
        object.updatePosition();
    }
}

generateAllEnemyBullets = () => {
    const objects = Object.values(enemies);
    for (const object of objects) {
        // console.log('check');
        object.generateEnemyBullet();
    }
}

drawAllEnemyBullets = () => {
    const objects = Object.values(enemyBullets);
    for (const object of objects) {
        // console.log('check');
        object.updatePosition();
        object.draw();
    }
}

// moveAllEnemyBullets = () => {
//     const objects = Object.values(enemyBullets);
//     for (const object of objects) {
//         // console.log('check');
        
//         object.moveBullet();
//     }
// }

generatePlayerBullet = () => {
    if ((myGameArea.key[32] && lastBulletFrame === 0) || (myGameArea.key[32] && (frame - lastBulletFrame > 10))) {
        let bullet = new component(2, 10, "blue",playerShip.x + 13, playerShip.y);
        bullet.speedY = -10;
        lastBulletFrame = frame;
        bullets[bulletCount] = bullet;
        bulletCount++;
    }
}
// Draw player bullet per frame
movePlayerBullet = () => {
    const values = Object.values(bullets);
    for (let value of values) {
        value.y += value.speedY;
        value.draw();
    }
}

// moveEnemyBullet = () => {
//     const values = Object.values(enemyBullets);
//     for (let value of values) {
//         value.x + value.speedX;
//         value.y += value.speedY;
//         value.draw();
//     }
// }

// generateEnemyBullet = () => {
//     var enemySize = this.getSprite().getSize();
//     var enemyPosition = this.getPosition();
//     var playerPosition = ship.getPosition();

//     // calculate direction
//     var dx = playerPosition.x - enemyPosition.x;
//     var dy = playerPosition.y - enemyPosition.y;
//     var length = Math.sqrt(dx * dx + dy * dy);
//     dx /= length;
//     dy /= length;

//     // calculate initial and final position for the bullet
//     var startX = enemyPosition.x + dx * enemySize.x / 2;
//     var startY = enemyPosition.y + dy * enemySize.y / 2;
//     var endX = startX + dx * 3000;
//     var endY = startY + dy * 3000;

//     // create bullet
//     var sprite = new Sprite('images/enemyBullet.png');
//     var bullet = new SceneObject(sprite, 0, startX, startY);
//     wade.addSceneObject(bullet);
//     bullet.moveTo(endX, endY, 200);
// }

// Check for collision between Bullet and Enemy and return an array of an array
isBulletHitEnemy = () => {
    const enemyKeys = Object.keys(enemies);
    const bulletKeys = Object.keys(bullets);
    let enemy;
    let bullet;

    // Array of [[enemy, bullet]] to be deleted later
    let deleteArray = [];

    for (enemy of enemyKeys) {

        for (bullet of bulletKeys) {

            if (bullets[bullet].y < enemies[enemy].y + 30 
                && bullets[bullet].y > enemies[enemy].y
                && bullets[bullet].x >= enemies[enemy].x 
                && bullets[bullet].x < enemies[enemy].x + 30) {
                // Remove enemies and bullets
                deleteArray.push([enemy,bullet]);
                console.log(deleteArray);
                console.log('enemy='+enemy + 'bullet=' + bullet);
                // enemyKeys.splice(enemyKeys.indexOf(enemy),1);
                // delete bullets[bullet];
                // bulletKeys.splice(bulletKeys.indexOf(bullet),1);
            }
        }
    }
    return deleteArray;
};

deleteCollidedEnemyAndBullets = (arrayOfArray) => {
    if (arrayOfArray.length > 0){
        arrayOfArray.forEach(element => {
            delete enemies[element[0]];
            delete bullets[element[1]];
        });
    }
}

isBulletHitPlayer = () => {
    const bulletKeys = Object.keys(enemyBullets);
    let key;

    for (key of bulletKeys) {
            if (playerShip.y < enemyBullets[key].y + enemyBullets[key].width 
                && playerShip.y + playerShip.width > enemyBullets[key].y
                && playerShip.x + playerShip.width > enemyBullets[key].x 
                && playerShip.x < enemyBullets[key].x + enemyBullets[key].width) {
                return true
            }
    }
};

isPlayerHitEnemy = () => {
    const enemyKeys = Object.keys(enemies);
    let enemy;

    for (enemy of enemyKeys) {
            if (playerShip.y < enemies[enemy].y + 30 
                && playerShip.y + playerShip.width > enemies[enemy].y
                && playerShip.x + playerShip.width >= enemies[enemy].x 
                && playerShip.x < enemies[enemy].x + 30) {
                return true
            }
    }
};

const myGameArea = {
    canvas : document.createElement("canvas"),
    start () {
        this.canvas.width = frameSize.width;
        this.canvas.height = frameSize.height;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        
        // Initialize key array as false
        this.key = [];
        // Create event listeners
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
        });
        document.addEventListener("keyup", (event) => {
            myGameArea.key[event.keyCode] = false;
        });

        // Repeat main loop at ~ 60 FPS

            this.interval = setInterval(updateGameArea,20);

        
    },
    clear () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // Clear enemies that are out of bounds
        const keys = Object.keys(enemies);
        for (const key of keys) {
            if (enemies[key].y > frameSize.height) {
                delete enemies[key];
            }
        }
        // Clear bullets that are out of bounds
        const bulletKeys = Object.keys(bullets);
        for (const key of bulletKeys) {
            if (bullets[key].y < 0) {
                delete bullets[key];
            }
        }

        const enemyBulletKeys = Object.keys(enemyBullets);
        for (const key of enemyBulletKeys) {
            if (enemyBullets[key].y > frameSize.height) {
                delete enemyBullets[key];
            }
        }
        // console.log(enemies);
    },
    gameOver () {
        clearInterval(this.interval);
        this.context.font = "20px Arial";
        this.context.textAlign = "center";
        this.context.fillText("You ded boiiii", this.canvas.width/2, this.canvas.height/2);
    },
    nextStage () {
        console.log('next stage');
        this.context.font = "30px Arial";
        this.context.fillText("Cleared Area", 120, this.canvas.height/2);
        this.context.fillText("Press Enter to go to next stage", 120, this.canvas.height/2);
    }
};

// Main Loop
const updateGameArea = () => {
        myGameArea.clear();
        playerShip.resetSpeed();
        deleteCollidedEnemyAndBullets(isBulletHitEnemy());
        generateEnemy();
        generateAllEnemyBullets();
        drawAllEnemyBullets();
        generatePlayerBullet();
        movePlayerBullet();
        playerShip.getSpeed();
        playerShip.isCollideWithWall();
        playerShip.updatePosition();
        playerShip.draw();
        drawAllEnemies();
        moveAllEnemies();
        if (isPlayerHitEnemy() || isBulletHitPlayer()) {
            myGameArea.gameOver();
        }
        if (currentEnemyCount === stages.enemies[currentStage]) {
            myGameArea.nextStage();
            currentEnemyCount = 0;
        }
        frame++;
}

// Start game
const startGame = () => {
    // To put in a initialize function
    playerShip = new component(20, 20, "green", 190, 420);
    myGameArea.start();
}