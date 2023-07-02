/*
    Student: Nenad Jakovchevski | Student_ID: 89221061
    Project 1 ~ Game: MineSweeper
    Page: Game Page ~ The Functionality of the Game
*/
// Special Developer Tool :D
var testMode = false; // If true, the bombs will be shown with the X marks the spot
// Setting global variables ~ (1) Taken from the HTML file
var grid = document.getElementById("grid"); // From the HTML file id
var infobar = document.getElementById("infobar"); // From the HTML file id
// Setting global variables ~ (2) For Game Progression
var gameInProgress = false; // For Progression of the Game
// Setting up Timer variables
var StartTime; // For the Start Time
var endTime; // For the End Time
var timerInterval; // For the Timer Interval

// Calling the function to generate the grid of the game
generateGrid();

// Function to create our game IT CREATES A 10x10 GRID
function generateGrid() {
    grid.innerHTML="";
    for (var i=0; i<10; i++) {
      row = grid.insertRow(i);
      for (var j=0; j<10; j++) {
        cell = row.insertCell(j);
        cell.onclick = function () {
          if (!gameInProgress) {
            startGame(); // Calling Function to start the game
          }
          clickCell(this);
            };
        var mine = document.createAttribute("data-mine");       
        mine.value = "false";             
        cell.setAttributeNode(mine);
      }
    }
    addMines(); // Calling Function to add mines to the grid
}

// Function to Start the Game
function startGame() {
    gameInProgress = true; // Setting the game to be in progress s.t. it has started
    // Setting the Start Time
    startTime = new Date();
    // Setting the Timer Interval
    timerInterval = setInterval(updateTimer, 1000); // updateTimer every 1000 miliseconds
}

// Function to update the Timer
function updateTimer() {
    // Setting needed variables s.t. it will show in the bottom table to display the correct time
    var timerCount = document.getElementById("timer_count"); // Getting the timer_count id from the HTML file
    var currentTime = new Date();
    var timeDiff = Math.floor((currentTime - startTime) / 1000);
    var minutes = Math.floor(timeDiff / 60);
    var seconds = timeDiff % 60;
    // Setting the timerCount to display the correct time by calling the padZero function
    timerCount.textContent = padZero(minutes) + ":" + padZero(seconds);
}

// Function Pad Zero
function padZero(value) {
    return value < 10 ? "0" + value : value; // If the value is less than 10, add a 0 in front of it
}

// Function to Stop the Game
function stopGame() {
    gameInProgress = false; // Setting the game to be in progress s.t. it has stopped
    disableCellClickability(); 
    // Setting the End Time
    clearInterval(timerInterval);
    endTime = new Date();
}

// Function to add mines to the grid
function addMines() {
    var bombCount = 0;
    /*
        The Maximum ammount of mines in the field is custom set to 20
        It is Randomly generated in the grid
        It is also shown in the bottom table so the user can see how many mines to expect to watch for
    */
    for (var i=0; i<20; i++) {
      var row = Math.floor(Math.random() * 10);
      var col = Math.floor(Math.random() * 10);
      // Put the mine in a random position in the field
      var cell = grid.rows[row].cells[col];
      var isAMine = cell.getAttribute("data-mine"); // Check if there is a mine in the cell
      if(isAMine!="true") {
        cell.setAttribute("data-mine","true"); // Set the mine in the cell
        /*
            Developer Tool :D
        */
        if (testMode) 
            cell.innerHTML="X"; // So we can win without thinking xD
        bombCount++; // to count the number of bombs
      }
    }
    // Setting the number of bombs in the bottom table
    var flagCount = document.getElementById("num_flags");
      flagCount.textContent = bombCount;
}

// Function when cell is clicked
function clickCell(cell) {
    // Check if the game is in progress
    if (!gameInProgress) {
      startGame();
    }
    //Check if the user clicked on a mine
    if (cell.getAttribute("data-mine")=="true") {
        // if the user clicked on a mine, the game is over
        stopGame();
        infobar.textContent = "GAME OVER! YOU STEPPED ON A MINE!";
        // Reveal all mines
        revealMines();
        alert("Game Over");
    } else { // else we progress with a displayed cell to help him
        cell.className="clicked";
        //Count and display the number of around mines so we have a way to display a number for the mines around a given cell
        var mineCount=0;
        var cellRow = cell.parentNode.rowIndex;
        var cellCol = cell.cellIndex;
        for (var i=Math.max(cellRow-1,0); i<=Math.min(cellRow+1,9); i++) {
            for(var j=Math.max(cellCol-1,0); j<=Math.min(cellCol+1,9); j++) {
                // Check if the cell around a mine
                if (grid.rows[i].cells[j].getAttribute("data-mine")=="true") 
                    mineCount++; // if it is, count it
            }
        }
        // Display the number of around mines
        cell.innerHTML=mineCount;
        if (mineCount==0) { 
        //Reveal all around cells as they do not have a mine
        for (var i=Math.max(cellRow-1,0); i<=Math.min(cellRow+1,9); i++) {
          for(var j=Math.max(cellCol-1,0); j<=Math.min(cellCol+1,9); j++) {
            //Recursive Call to clickCell function
            if (grid.rows[i].cells[j].innerHTML=="") 
                clickCell(grid.rows[i].cells[j]);
          }
        }
      }
        // Check if the user won the game
      checkLevelCompletion();
    }
}

// Function to check if the user won the game
function checkLevelCompletion() {
    // Check if the user won the game, give initial value to true and then check if it is false
    var levelComplete = true;
    for (var i = 0; i < 10; i++) {
      for (var j = 0; j < 10; j++) {
        if (grid.rows[i].cells[j].getAttribute("data-mine") == "false" && grid.rows[i].cells[j].innerHTML == "")
          levelComplete = false;
      }
    }
    // if it still holds true after checking every cell, the user won the game
    if (levelComplete) {
        // Stop the game and display a message to the Winner
        stopGame();
        alert("You Win!");
        infobar.textContent = "YOU WIN! MISSION: BOSNIA COMPLETE!";
        // Reveal all mines
        revealMines();
    }
}

// Function to reveal all mines in the grid
function revealMines() {
    //Highlight all mines in red
    for (var i=0; i<10; i++) {
      for(var j=0; j<10; j++) {
        var cell = grid.rows[i].cells[j];
        if (cell.getAttribute("data-mine")=="true"){
            // if it is a mine set the background to red, and we add an image so we can see the mine
            cell.className="mine";
            cell.innerHTML="";
            var img = document.createElement("img");
            img.src = "bomb.svg";
            img.style.width = "1.5em";
            img.style.height = "1.5em";
            // add the image to the cell
            cell.appendChild(img);
        }
      }
    }
}

// Reset Button Functionality
function resetGame(){
    // giving back the game its initial values
    gameInProgress = false;
    clearInterval(timerInterval);
    infobar.textContent = "TRY NOT TO STEP ON THE MINE!";
    generateGrid();
    var timerCount = document.getElementById("timer_count");
    timerCount.textContent = "00:00";
  }
 // Disable cell functionallity after game ends
 function disableCellClickability() {
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            var cell = grid.rows[i].cells[j];
            cell.onclick = null; // Remove the onclick event handler
        }
    }
}