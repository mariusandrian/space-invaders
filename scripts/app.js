console.log('connected');
const enemies = {}, bullets = {}, enemyBullets = {};
const keyRef = {
    up: 38,
    down: 40,
    left: 37,
    right: 39,
    enter: 13,
    space: 32
};
const stageConfig = {
    enemies: [10,20,30],
    bulletInterval: [200.100,40],
    enemySpawnInterval: [100, 50, 30]
}
const init = {
    playerPosition: {
        x: 190,
        y: 420
    }
}
const frameSize = {
    height: 500,
    width: 400
};
let gameStart = false;
let frame = 0;
let lastEnemyFrame = 0;
let lastBulletFrame = 0;
let playerShip;
let gameOverIndicator = false;
let enemyBulletCount = 0;
let totalEnemyGenerated = 0;
let enemyId = 1;
let bulletCount = 1;
let nextStage = 0;
let currentStage = 0;
let userScore = 0;
let isEnterPressed = false;
let waitIndicator = 0;
let dadJoke;

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
        if (myGameArea.key && myGameArea.key[keyRef.up] === true) {
            this.speedY -= 3;
        }
        //move down
        if (myGameArea.key && myGameArea.key[keyRef.down] === true) {
            this.speedY += 3;
        }
       //move left
       if (myGameArea.key && myGameArea.key[keyRef.left] === true) {
            this.speedX -= 3;
       }
       // move right
       if (myGameArea.key && myGameArea.key[keyRef.right] === true) {
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
        if (this.lastBulletShotTime === 0 || frame - this.lastBulletShotTime > stageConfig.bulletInterval[currentStage]) {
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

    if ((frame > 50 && (frame - lastEnemyFrame > stageConfig.enemySpawnInterval[currentStage])) && totalEnemyGenerated < stageConfig.enemies[currentStage]) {

        let originXOfEnemy = Math.round(Math.random() * (frameSize.width-30));
        let enemyShip = new component(30, 30, "red", originXOfEnemy, 0);
        
        enemyShip.speedY = Math.round(Math.random() * 2) + 1;

        enemyShip.updatePosition = function () {
            this.y += this.speedY;
            this.x = originXOfEnemy + 0.1 * (frameSize.width * Math.sin(0.05*this.y));
        };

        enemies[enemyId] = enemyShip;
        enemyId++;

        lastEnemyFrame = frame;
        totalEnemyGenerated++;
    }
}

drawAllEnemies = () => {
    const objects = Object.values(enemies);
    for (const object of objects) {
        object.draw();
    }
}

moveAllEnemies = () => {
    const objects = Object.values(enemies);
    for (const object of objects) {
        object.updatePosition();
    }
}

generateAllEnemyBullets = () => {
    const objects = Object.values(enemies);
    for (const object of objects) {
        object.generateEnemyBullet();
    }
}

drawAllEnemyBullets = () => {
    const objects = Object.values(enemyBullets);
    for (const object of objects) {
        object.updatePosition();
        object.draw();
    }
}

generatePlayerBullet = () => {
    if ((myGameArea.key[keyRef.space] && lastBulletFrame === 0) || (myGameArea.key[keyRef.space] && (frame - lastBulletFrame > 10))) {
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
                deleteArray.push([enemy,bullet]);
                userScore += 100;
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

isEnterPressed = () => {
    
}

const myGameArea = {
    canvas : document.createElement("canvas"),
    intro () {
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
            if (myGameArea.key[keyRef.enter] === true && waitIndicator === 0 && gameStart === true){
                waitIndicator = 1;
            }
            if (myGameArea.key[keyRef.enter] === true && gameStart === false){
                gameStart = true;
                waitIndicator = 1;
            }
            
        });
        document.addEventListener("keyup", (event) => {
            myGameArea.key[event.keyCode] = false;
        });
        this.context.font = "25px Arial";
        this.context.textAlign = "center";
        this.context.fillText("Not a Space Invader Game", this.canvas.width/2, this.canvas.height/2 - 50);
        this.context.font = "18px Arial";
        this.context.fillText("Use Arrow Keys to move, Space to shoot", this.canvas.width/2, this.canvas.height/2 + 30);
        this.context.fillText("Press Enter to start", this.canvas.width/2, this.canvas.height/2 + 60);
    },
    start () {
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
        // Clear enemy bullets that are out of bounds
        const enemyBulletKeys = Object.keys(enemyBullets);
        for (const key of enemyBulletKeys) {
            if (enemyBullets[key].y > frameSize.height) {
                delete enemyBullets[key];
            }
        }
    },
    checkGameOver () {
        if (isPlayerHitEnemy() || isBulletHitPlayer()) {
        clearInterval(this.interval);
        this.context.font = "20px Arial";
        this.context.textAlign = "center";
        this.context.fillText("Game Over", this.canvas.width/2, this.canvas.height/2);
        this.context.fillText("Refresh page to restart", this.canvas.width/2, this.canvas.height/2 + 40);
        this.context.font = "12px Arial"
        let jokeText = document.getElementById("joke")
        jokeText.innerText = dadJoke;
        
        }
    },
    checkNextStage () {
        if (totalEnemyGenerated === stageConfig.enemies[currentStage] && Object.keys(enemies).length === 0 && currentStage < 2) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.font = "20px Arial";
        this.context.fillText("Congrats, you cleared Level " + (currentStage + 1) + " !", this.canvas.width/2, this.canvas.height/2 - 30);
        this.context.fillText("Press Enter to go to next Area", this.canvas.width/2, this.canvas.height/2 + 30);
        // Set up waiting period
        waitIndicator = 0;
        currentStage += 1;
        totalEnemyGenerated = 0;
        this.nextStage = 1;
        }
    },
    resetAll () {
        if (this.nextStage === 1) {
            playerShip.x = init.playerPosition.x;
            playerShip.y = init.playerPosition.y;
            // Clear enemies that are out of bounds
        const keys = Object.keys(enemies);
        for (const key of keys) {
                delete enemies[key];
        }
        // Clear bullets that are out of bounds
        const bulletKeys = Object.keys(bullets);
        for (const key of bulletKeys) {
                delete bullets[key];
        }
        // Clear enemy bullets that are out of bounds
        const enemyBulletKeys = Object.keys(enemyBullets);
        for (const key of enemyBulletKeys) {
                delete enemyBullets[key];
        }
            this.nextStage = 0;
        }

    },
    checkWin () {
        if (currentStage === 2 && (totalEnemyGenerated === stageConfig.enemies[currentStage]) && (Object.keys(enemies).length === 0)) {
            clearInterval(this.interval);
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.font = "20px Arial";
            this.context.fillText("Congrats, you Won!", this.canvas.width/2, this.canvas.height/2 - 30);
            this.context.fillText("Your highscore is " + userScore, this.canvas.width/2, this.canvas.height/2 + 30);
        }
    }
};

updateUserScore = () => {
    let userScoreDisplay = document.getElementById("score")
    userScoreDisplay.innerText = userScore;
}

loadDoc = () => {
    fetch('https://icanhazdadjoke.com/', {
        headers: {
        Accept: 'text/plain'
        }
	}).then((response) => {
        // The API call was successful!
        return response.text();
    }).then((data) => {
        console.log(data);
        dadJoke = data;
    }).catch((err) => {
	// There was an error
	console.warn('Something went wrong.', err);
    });
  }

// Main game Loop
const updateGameArea = () => {
    if (waitIndicator > 0){
        myGameArea.resetAll();
        myGameArea.clear();
        playerShip.resetSpeed();
        deleteCollidedEnemyAndBullets(isBulletHitEnemy());

        // Generate and Draw Player Objects
        generatePlayerBullet();
        movePlayerBullet();
        playerShip.getSpeed();
        playerShip.isCollideWithWall();
        playerShip.updatePosition();
        playerShip.draw();

        // Generate and Draw Enemy Objects
        generateEnemy();
        generateAllEnemyBullets();
        drawAllEnemyBullets();
        drawAllEnemies();
        moveAllEnemies();
        
        // Check game state
        updateUserScore();
        myGameArea.checkGameOver();
        myGameArea.checkWin();
        myGameArea.checkNextStage();
        
        frame++;
    }
}

// Start game
const startGame = () => {
    // To put in a initialize function
    loadDoc();
    playerShip = new component(20, 20, "green", init.playerPosition.x, init.playerPosition.y);
    myGameArea.intro();
    myGameArea.start();
}