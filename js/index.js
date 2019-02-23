// work in progress!
// this is up to the date with GitHub.

const appleColour = '#EABDA8';
const backColour = '#403551';
let bonus = () => {
  bonusTimer = 0;
  appleX = Math.floor(Math.random() * 19);
  appleY = Math.floor(Math.random() * 9);

  if (snakeContains()) {
    bonus(); // putting apple onto a snake might be a bad idea. Get random coordinates again.
  } else {
    change([appleX, appleY], appleColour);
    bonusIsThere = true;
    catchMe = 15;
  }
}; // deploy a new apple.
let bonusTimer;
let bonusIsThere = false;
let appleX, appleY, lastDir, oldPos, shiftX, shiftY;
let banner = document.getElementById('overlay');
let catchMe;
const change = (c, col) => {
  // take coordinates like [3,4] and convert into a cell number 1-300 so we can speak to the divs.
  document.getElementById(c[0] + 1 + c[1] * 20).style.backgroundColor = col;
}; // that's a function to change the bricks to draw the snake etc.
let collide = () => {
  for (let i = 1; i < snake.length; i++) {
    if ((snake[i][0] == snake[0][0] && snake[i][1] == snake[0][1]) || pts < -100) {
      gameOver = true;

      clearInterval(gameTime);
      killGame = true;
      change(snake[0], 'orange');

      shout('GAME OVER');

      setTimeout(function() {
        change(snake[0], snakeColour);
        shout(pts + ' points!');
        if (gameOver)setTimeout(function() {
          shout('Again? Press space', true);
          space = true;
          change(snake[0], 'orange');
          setTimeout(function() {
            change(snake[0], snakeColour);

            setTimeout(function() {
              if (space) change(snake[0], 'orange');
              setTimeout(function() {
                change(snake[0], snakeColour);
              }, 600);
            }, 600);
          }, 800);
        }, 1300);

        change([appleX, appleY], backColour);
      }, 700);
    }
  }
}; //detects collisions
let endOfGame = () => {
  // instructions for the game being over. I never had a chance to finish this. =)
};
let gameOver = false;
let gameTime; // main timer.
let killGame = false;
function move() {
  shiftX = snake[0][0];
  shiftY = snake[0][1];
  switch (direction) {
    case 'n':
      shiftY = snake[0][1] - 1;
      break;
    case 's':
      shiftY = snake[0][1] + 1;
      break;
    case 'w':
      shiftX = snake[0][0] - 1;
      break;
    case 'e':
      shiftX = snake[0][0] + 1;
      break;
  }

  lastDir = direction;
  snake.unshift([shiftX, shiftY]);

  if (snake[0][1] < 0) snake[0][1] = 9;
  if (snake[0][1] > 9) snake[0][1] = 0;
  if (snake[0][0] < 0) snake[0][0] = 19;
  if (snake[0][0] > 19) snake[0][0] = 0;

  collide();
  if (!killGame) change(snake[0], snakeColour); // Draw the new head.

  if (!gameOver) change(snake.pop(), backColour);
  // ate an apple.

  if (appleX == snake[0][0] && appleY == snake[0][1]) {
    snake.push(snake[snake.length - 1]);
    change([appleX, appleY], '#517F77'); //snakeColour but darker
    appleX = null;
    appleY = null;
    shout('GOOD JOB!');
    pts += 50;
    bonusIsThere = false;
    bonusTimer = 0;
    catchMe = 10;
  }
  points();
} // lets the snake go ahead by one square.
let mPts = 0;
let output = [];
let pts;
let snake = [];
const snakeColour = '#61988E';
let speed;
let space = false;
const setup = () => {
  appleX, appleY, lastDir, oldPos, shiftX, shiftY = null;
  output = [];
  for (a = 1; a <= 200; a++) {
    output.push(`<div id="${a}" class="brick"></div>`);
  }
  document.getElementById('platform').innerHTML = output.join('');
  document.addEventListener('keydown', turning); // reads the keyboard arrows on keydown event.
  bonusTimer = 0;
  bonusIsThere = false;
  speed = 470;
  catchMe = 10;
  snake = [];
  snake = [[10,6], [10, 7], [10, 8], [10, 9]];
  change(snake[0], snakeColour);
  change(snake[1], snakeColour);
  change(snake[2], snakeColour);
  change(snake[3], snakeColour);
  direction = 'n';
  pts = 0;
  mPts = 0;
  speed = 450;
  killGame = false;
}; // basic setup before the game starts. Draw all <divs> and put the snake there.
function shout(string, remain) {

  banner.style.visibility = 'visible';
  banner.innerHTML = string.toUpperCase();

  setTimeout(function() {
    banner.style.visibility = 'hidden';
    setTimeout(function() {
      if (gameOver) banner.style.visibility = 'visible';
      setTimeout(function() {
        banner.style.visibility = 'hidden';
        if (remain) {
          setTimeout(function() {

            if (gameOver)banner.style.visibility = 'visible';

          }, 300);
        }
      }, 300);
    }, 300);
  }, 300);
} // tells you stuff with huge red blinking letters
let snakeContains = () => {
  for (let i = 0; i < snake.length; i++) {
    if (snake[i][0] == appleX && snake[i][1] == appleY) {
      return true;
    }
  }
  return false;
}; // this is to check if the new apple coordinates point to a part of the snake.
let points = () => {
  document.getElementById('number').innerHTML = pts;
  mPts++;
  bonusTimer++;

  if (mPts > 6) {
    pts++;
    if (speed > 200) {
      speed -= 5;
    }
    mPts = 0;
  }

  if (bonusIsThere) {
    catchMe--;

    // apples disappear when catchme runs out.
    if (catchMe <= 0) {
      pts -= 55;
      shout('missed it.');
      change([appleX, appleY], backColour);
      appleX = null;
      appleY = null;
      bonusIsThere = false;
      bonusTimer = 0;
    }
  } else if (bonusTimer >= 4) bonus();

  // when the apple is about to disappear it starts blinking
  if (catchMe < 5 && catchMe > 0) {
    setTimeout(function() {
      change([appleX, appleY], appleColour);
      setTimeout(function() {
        change([appleX, appleY], backColour);
      }, 180);
    }, 70);
  }
}; // different functions regarding the score and how new apples appear
function turning(command) {
  // read the key code and let the head the right direction
  // just make sure no one tries reversing. No cheating!
  if (command.keyCode == 37 && lastDir != 'e') {
    return (direction = 'w');
  } else if (command.keyCode == 38 && lastDir != 's') {
    return (direction = 'n');
  } else if (command.keyCode == 39 && lastDir != 'w') {
    return (direction = 'e');
  } else if (command.keyCode == 40 && lastDir != 'n') {
    return (direction = 's');
  } else if (command.keyCode == 32 && space) {
    // after the space was pressed, restart entire game and reset variables.
    setup();
    banner.style.visibility = 'hidden';
    speed = 470;
    space = false;

    setTimeout(function() {
        gameOver = false;
        gameTime = setInterval(move, speed);
      }, 200);

  }
} // uses the key listener information to turn

// everything done. Now let's play.

setup(); // draw the board.
gameTime = setInterval(move, speed); // start moving.
