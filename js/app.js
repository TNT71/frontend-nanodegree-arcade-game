'use strict';

// Enemies our player must avoid.  The stepsize controls relative speed.
// The direction controls horizontal direction.

var Enemy = function(xpos, ypos, stepsize, direction) {
    this.x = xpos;
    this.y = ypos;
    this.stepsize = stepsize;
    this.direction = direction;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {

//if dx/dt > 0 and enemy moves off the board reset position to left of board.
    if (this.x > 505 && this.direction === 1) {
        this.x = -101;
        return;
    }
//if dx/dt < 0 and enemy moves off the board reset position to right of the board.
    if (this.x < -101 && this.direction === -1) {
        this.x = 610;
        return;
    }

    this.x += dt * this.stepsize * this.direction;

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and a handleInput() method.

var Player = function() {
    this.x = 202;
    this.y = 404;
    this.sprite = 'images/char-boy.png';
};

// size of char-boy.png is 101x171.  But this is the size of the png including the transparent part.
// the char-boy is a bit skinner than the bug.  The bug is almost as wide as the column.
// size of bug is 101x171
// row height is 83
// col width is 101


Player.prototype.handleInput = function(event) {

    var RIGHT_LIMIT = 404;
    var FLOOR = 404;
    var LEFT_LIMIT = 0;

    // You can always go up subject to collison check in update and verification of reaching the water.
    if (event === "up") {
        this.y -= 83;
    }
    if (event === "down" && !(this.y === FLOOR)) {
        this.y += 83;
    }
    if (event === "left" && !(this.x <= LEFT_LIMIT)) {
        this.x -= 101;

    }
    if (event === "right" && !(this.x >= RIGHT_LIMIT)) {
        this.x += 101;
    }

};

Player.prototype.update = function() {
    this.checkCollision();
};


Player.prototype.checkCollision = function() {

    var collide = false;

    // The player can only be at discrete y values.  So we only need to check for conflicts against bugs in the same row
    // I used the console to manaual move the bugs player and bugs towards each other until I figured out that the x coordinate of the
    // enemy and the player could be no closer than 80 pixels.
    if (this.y === 404 || this.y === 321) { // player is in safe zone
        return;
    }
    if (this.y === 238) { // check for collision with enemeies in row 3
        rowThree.forEach(function(en) {
            if (Math.abs(en.x - this.x) < 80 || Math.abs(this.x - en.x) < 80) {
                collide = true;
            }

        }.bind(this));
    }
    if (this.y === 155) { // check for collision with enemies in row 2
        rowTwo.forEach(function(en) {
            if (Math.abs(en.x - this.x) < 80 || Math.abs(this.x - en.x) < 80) {
                collide = true;
            }
        }.bind(this));
    }
    if (this.y === 72) { //check for collision with enemies in row 1
        rowOne.forEach(function(en) {
            if (Math.abs(en.x - this.x) < 80 || Math.abs(this.x - en.x) < 80) {
                collide = true;
            }
        }.bind(this));
    }

    if (collide) {
        numLives -= 1;
        this.reset();
    }

    if (this.y < 0) {
        score += 5;
        this.reset();

    }

};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    ctx.font = "20px Arial";
    ctx.clearRect(0, 0, 275, 50);
    ctx.fillText("SCORE: " + score, 20, 30);
    ctx.fillText("LIVES: " + numLives, 150, 30);
};

Player.prototype.reset = function() {
    if (numLives === 0) {
        alert("GAME OVER!!!!.   SCORE: " + score);
        numLives = 5;
        score = 0;
    }

    this.x = 202;
    this.y = 404;
    enemy1.x = -101;
    enemy2.x = 610;
    enemy3.x = -202;
    enemy4.x = 610;
    enemy5.x = -404;
    enemy6.x = 300;
    enemy7.x = 810;

};



// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
// This would be easier to code if you could get the bugs and they players to share the same common discrete y coordinates.
// This couldn't be done since the bugs should appear entirely within a given row.


var enemy1 = new Enemy(-101, 145, 100, 1);
var enemy2 = new Enemy(610, 230, 50, -1);
var enemy3 = new Enemy(-202, 230, 100, 1);
var enemy4 = new Enemy(610, 60, 200, -1);
var enemy5 = new Enemy(-404, 230, 100, 1);
var enemy6 = new Enemy(300, 60, 200, -1);
var enemy7 = new Enemy(810, 60, 200, -1);


// place the enemies into all enemies
var allEnemies = [enemy1, enemy2, enemy3, enemy4, enemy5, enemy6, enemy7];
var rowOne = [enemy4, enemy6];
var rowTwo = [enemy1];
var rowThree = [enemy2, enemy3, enemy5];
var player = new Player();
var numLives = 5;
var score = 0;



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});