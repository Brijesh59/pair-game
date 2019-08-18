let memory_array = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H'];
let memory_values = [];
let memory_tile_ids = [];
let tiles_flipped = 0;
let moves = 0, clickCount = 0;
let timer;
// Get the modal
var modal = document.getElementById("myModal");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
var noOfMoves = document.getElementsByClassName("noOfMoves")[0];
var rating = document.getElementsByClassName("rating")[0];
var timeTaken = document.getElementsByClassName("timeTaken")[0];
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

document.getElementById('moves').innerHTML = moves;

// shuffle the array
Array.prototype.memory_tile_shuffle = function () {
    let i = this.length, j, temp;
    while (--i > 0) {
        j = Math.floor(Math.random() * (i + 1));
        temp = this[j];
        this[j] = this[i];
        this[i] = temp;
    }
}

function newBoard() {
    console.log("sad")
    tiles_flipped = 0;
    clickCount = 0;
    moves = 0;
    memory_values = []
    memory_tile_ids= []
    let output = '';

    memory_array.memory_tile_shuffle();
    for (let i = 0; i < memory_array.length; i++) {
        // output += '<div id="tile_' + i + '" onclick="memoryFlipTile(this,\'' + memory_array[i] + '\')"></div>';
        let val = memory_array[i]
        output += 
            '<div class="flip-card" id="tile_'+i+'" onclick="memoryFlipTile(this,\'' + memory_array[i] + '\')"><div class="flip-card-inner"><div class="flip-card-front"></div><div class="flip-card-back" /><span></span></div></div></div>'
    }

    console.log(memory_array)
    document.getElementById('moves').innerHTML = moves;
    document.getElementById('tiles').innerHTML = output;
}

// function check(context,data){
//     var child = context.children[0].children;
//     console.log("Clicked11", data, context, child)
// }

function memoryFlipTile(tile, val) {
    console.log("clicked")
    if (clickCount == 0) {
        startTimer();
    }
    clickCount += 1;

    var inner = tile.children[0];
    var front = inner.children[0];
    var back  = inner.children[1];
    var spanContainingEle = back.children[0]

    if (spanContainingEle.innerHTML == "" && memory_values.length < 2) {

        inner.style.transform = 'rotateY(180deg)';
        spanContainingEle.innerHTML = val;

        if (clickCount % 2 == 0) {
            moves += 1;
        }

        document.getElementById('moves').innerHTML = moves;

        if (memory_values.length == 0) {
            memory_values.push(val);
            memory_tile_ids.push(tile.id);
        }
        else if (memory_values.length == 1) {
            memory_values.push(val);
            memory_tile_ids.push(tile.id);
            if (memory_values[0] == memory_values[1]) {
                tiles_flipped += 2;
                memory_values = [];
                memory_tile_ids = [];
                // GAME OVER
                if (tiles_flipped == memory_array.length) {
                    generateStars();
                    noOfMoves.innerHTML = "No of moves: " + moves;
                    timeTaken.innerHTML = timer.getTimeValues().minutes + " " + "min" + " " + timer.getTimeValues().seconds + " " + "sec";
                    modal.style.display = "block";
                    timer.pause();
                }
            }
            else {
                function flip2Back() {
                    // Flip the 2 inner tiles back, by removing rotateY style
                    let tile1_inner = document.getElementById(memory_tile_ids[0]).children[0];
                    let tile2_inner = document.getElementById(memory_tile_ids[1]).children[0];
                    
                    let tile1_back = tile1_inner.children[1]
                    let tile2_back = tile2_inner.children[1]

                    tile1_inner.removeAttribute("style");
                    tile1_back.children[0].innerHTML = "";

                    tile2_inner.removeAttribute("style");
                    tile2_back.children[0].innerHTML = "";
                    // Clear both arrays
                    memory_values = [];
                    memory_tile_ids = [];
                }
                setTimeout(flip2Back, 500);
            }
        }
    }
}

let resetIcon = document.getElementById("reset");
resetIcon.addEventListener('click', reset);
let playAgain = document.getElementById("playAgain");
playAgain.onclick = function(){
    modal.style.display = "none"
    reset();
}

function reset(){
    document.getElementById('tiles').innerHTML = "";
    newBoard();
    stopTimer();
    document.getElementById('rating').innerHTML = "";
    rating.innerHTML = ""
    timeTaken.innerHTML = ""
}

function startTimer() {
    timer = new Timer();
    console.log(timer);
    timer.start();
    timer.addEventListener('secondsUpdated', function (e) {
        document.getElementById('minutes').innerHTML = timer.getTimeValues().minutes;
        document.getElementById('seconds').innerHTML = timer.getTimeValues().seconds;
    });
}

function stopTimer() {
    timer.stop();
    document.getElementById('minutes').innerHTML = "0";
    document.getElementById('seconds').innerHTML = "0";
}

function generateStars() {
    let output = ''
    if (moves == 8) {
        for (let i = 0; i < 3; i++)
            output += '<img width="25px" height="25px" src="https://png.pngtree.com/svg/20170626/da7858959c.svg"></img>';
    }
    else if (moves > 8 && moves < 15) {
        for (let i = 0; i < 2; i++)
            output += '<img width="25px" height="25px" src="https://png.pngtree.com/svg/20170626/da7858959c.svg"></img>';
    }
    else {
        for (let i = 0; i < 1; i++)
            output += '<img width="25px" height="25px" src="https://png.pngtree.com/svg/20170626/da7858959c.svg"></img>';
    }
    document.getElementById('rating').innerHTML = output;
    rating.innerHTML = output;
}

window.onload = function () {
    newBoard();
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}