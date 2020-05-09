# Approach and Process
## What in my process and approach to this project would I do differently next time?

1. I should have researched more on how other people planned the architecture of games in general, which involves a collision detection -> update -> draw game loop. Tutorial didn't really show this in a higher-level view.
2. Better to draw the UI and wireframe earlier before start coding. I mostly go by ear.

## What in my process and approach to this project went well that I would repeat next time?

1. Creating functions and (try) limiting them to do only one thing at every point in time
2. Going through a complete tutorial on a new subject (canvas) to try to understand as many methods as possible. The rest go through stackoverflow.

---

# Code and Code Design
## What in my code and program design in the project would I do differently next time?

1. Write a general function to take in any two objects and find their coordinates. Wasn't able to do a functioning one.

```javascript
playerShip.isCollideWithWall();
```

2. Initialize items in a separate .js file and enclose it inside an object to make reading easier. Also analyze the need to have so many indicators for transitions, frames, enemyId. Would there be a better way..

```javascript
let gameStart = false;
let frame = 0;
let lastEnemyFrame = 0;
let lastBulletFrame = 0;
```

3. Create a new child class for other items such as bullets and enemies. Didn't manage to properly change methods for child classes.

## What in my code and program design in the project went well? Is there anything I would do the same next time?

1. Clearing object attributes/data after they are no longer used. I figured that this would be useful in keeping the website light

```javascript
const keys = Object.keys(enemies);
        for (const key of keys) {
            if (enemies[key].y > frameSize.height) {
                delete enemies[key];
            }
        }
```

## What habits did I use during this unit that helped me?
1. Enclose one logic to functions
2. Create a component class where I want to create another complex instance with similar behaviour
3. DOM manipulation to see what happens in the front end

## What habits did I have during this unit that I can improve on?
1. Thinking and creating data structures before creating the functions themselves.
2. Refactoring code incrementally after every feature is created

## How is the overall level of the course during this unit? (instruction, course materials, etc.)

Course material is good, could be more in-depth.

