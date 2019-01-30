// This is REALLY work in progress!

// screen size as a matrix: x= 30, y = 10.
// initial setup of the grey bricks so the game is ready.
var snakecolour = "forestGreen";
const applecolour = "Crimson";
var bonustimer = 0;
var bonusisthere = false;
var applex, appley, ldirection, lastdir, oldPos, shiftx, shifty;
var catchme = 10;
var pts = 0;
var mpts = 0;
var speed = 450;
var gameover= false;
var lost; // coordinates for the tail,

var output = [];
for (a = 1; a <= 200; a++) {
  output.push(`<div id="${a}" class="brick"></div>`);
}
document.getElementById("platform").innerHTML = output.join("");

// that's a function to change the bricks.
var change = (c, col) => {
  // take coordinates like [3,4] and convert into a cell number 1-300 so we can speak to the divs.
  document.getElementById(c[0] + 1 + c[1] * 20).style.backgroundColor = col;
};


var snake = [[10, 7], [10, 8], [10, 9]];
change(snake[0], snakecolour);
change(snake[1], snakecolour);
change(snake[2], snakecolour);
direction = "n";

var points = () => {
  document.getElementById("number").innerHTML = pts;
  mpts++;
  bonustimer++;
  
  if (mpts > 5) {
    pts++;
    speed-=4;
    mpts = 0;
  }


  if (bonusisthere) {
    catchme--;

    // apples disappear when catchme runs out.
    if (catchme <= 0) {
      pts -= 20;
      shout("missed it.");
      change([applex, appley], "#444");
      applex, appley = null;
      bonusisthere = false;
      bonustimer = 0;
    }
  } else if (bonustimer >= 4) bonus();

  // when the apple is about to disappear it starts blinking
  if (catchme < 5 && catchme > 0) {

  setTimeout(function() { 
        change([applex, appley], applecolour);
       setTimeout(function() {  
      change([applex, appley], "#444");
        }, 180);
  }, 70);
  }
}; // different functions regarding the score and apple control
function shout(string, remain) {
  let banner = document.getElementById("overlay");
  banner.style.visibility = "visible";
  banner.innerHTML = string.toUpperCase();
  
  setTimeout(function(){
    banner.style.visibility = "hidden";
    setTimeout(function() {
      banner.style.visibility = "visible";
         setTimeout(function() {
        banner.style.visibility = "hidden";
      if(remain){
        setTimeout(banner.style.visibility = "visible", 300);
      }
           
         }, 300);
    }, 300);
  }, 300);
} 

// tells you stuff with huge red blinking letters
function move() { 
  shiftx = snake[0][0];
  shifty = snake[0][1];
  switch (direction) {
    case "n":
      shifty = snake[0][1] - 1;
      break;
    case "s":
      shifty = snake[0][1] + 1;
      break;
    case "w":
      shiftx = snake[0][0] - 1;
      break;
    case "e":
      shiftx = snake[0][0] + 1;
      break;
  }

  lastdir = direction;
  snake.unshift([shiftx, shifty]);

  if (snake[0][1] < 0) snake[0][1] = 9;
  if (snake[0][1] > 9) snake[0][1] = 0;
  if (snake[0][0] < 0) snake[0][0] = 19;
  if (snake[0][0] > 19) snake[0][0] = 0;

  points();
  collide();
  change(snake[0], snakecolour);
  if(!gameover) change(snake.pop(), "#444");
  // ate an apple.
   if (applex == snake[0][0] && appley == snake[0][1]) {
    snake.push(snake[snake.length-1]);
    change([applex, appley], "darkgreen");
    applex = null;
    appley = null;
    shout("GOOD JOB!");
    pts += 50;
    bonusisthere = false;
    bonustimer = 0;
    catchme = 10;
  }
  
} // lets the snake proceed.

var gameTime = setInterval(move, speed); // this is the TIME itself.

document.addEventListener("keydown", turning);// reads the keyboard arrows
function turning(command) {
  // read the key code and let the head the right direction
  // just make sure no one tries reversing. No cheating!
  if (command.keyCode == 37 && lastdir != "e") {
    return (direction = "w");
  } else if (command.keyCode == 38 && lastdir != "s") {
    return (direction = "n");
  } else if (command.keyCode == 39 && lastdir != "w") {
    return (direction = "e");
  } else if (command.keyCode == 40 && lastdir != "n") {
    return (direction = "s");
  }
} // uses the key listener information to turn

let bonus = () => {
  bonustimer = 0;
  applex = Math.floor(Math.random() * 19);
  appley = Math.floor(Math.random() * 9);
  change([applex, appley], applecolour);
  bonusisthere = true;
  catchme = 15;
}; // deploy a new APPLE.
var collide = () => {
  
  for(let i=1; i < snake.length; i++){
    if(snake[i][0] == snake[0][0] && snake[i][1] == snake[0][1])
      {
        gameover= true;
        change(snake[0], "orange");
        clearInterval(gameTime);
        change(snake[0], "orange");
      
      
        shout("GAME OVER");
        
          setTimeout(function(){
              change(snake[0], snakecolour);
              shout(pts+" points!");
              setTimeout(function(){
                  
        
                  shout(pts+" points!",true);
                   change(snake[0], "orange");
                setTimeout(function(){
                  change(snake[0], snakecolour);
                  
                  setTimeout(function(){
                    change(snake[0], snakecolour);
                    setTimeout(function(){
                    change(snake[0], "orange");
                  },500);
                  },500);
                },500);
              }, 500);
        
          change([applex, appley], "#444");
            }, 500);
      
     
      
    }
    
  }
  
}; //detects collisions