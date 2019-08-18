let tiles = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H'];
let tiles_value = [];
let tiles_id = [];
let tiles_flipped = 0, // how many tiles are flipped, (factor to decide game end{tiles_flipped == tiles.length})
    moves = 0,        // count of the no. of moves player has made(2 valid click = 1 move)
    clickCount = 0; 
let timer;           // will be initialised when game starts

/* Define modal variables */
let modal = document.getElementById("myModal");
let noOfMoves_modal = document.getElementsByClassName("noOfMoves")[0];
let timeTaken_modal = document.getElementsByClassName("timeTaken")[0];
let rating_modal = document.getElementsByClassName("rating")[0];
let playAgain = document.getElementById("playAgain");
let closeModal = document.getElementsByClassName("close")[0];

playAgain.onclick = function(){
    modal.style.display = "none"
    reset();
}
closeModal.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, then also close it
window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
}

let resetIcon = document.getElementById("reset");
resetIcon.addEventListener('click', reset);

// method to shuffle the tiles (array elements)
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

    tiles_flipped = 0;
    clickCount = 0;
    moves = 0;
    tiles_value = []
    tiles_id= []
    tiles.memory_tile_shuffle();
    
    let output = '';
    for (let i = 0; i < tiles.length; i++) {
        output += 
            '<div class="flip-card" id="tile_'+i+'" onclick="filpTile(this,\'' + tiles[i] + '\')"><div class="flip-card-inner"><div class="flip-card-front"></div><div class="flip-card-back" /><span></span></div></div></div>'
    }

    /* Set initial move count to 0 */
    document.getElementById('moves').innerHTML = 0;
    /* set the tiles board */
    document.getElementById('tiles').innerHTML = output;

    console.log(tiles) 
}

function filpTile(tile, val) {

    if (clickCount == 0) {
        startTimer();
    }
    clickCount += 1;

    let inner = tile.children[0];
    let front = inner.children[0];
    let back  = inner.children[1];
    let spanContainingEle = back.children[0]

    if (spanContainingEle.innerHTML == "" && tiles_value.length < 2) {

        inner.style.transform = 'rotateY(180deg)';
        spanContainingEle.innerHTML = val;

        if (clickCount % 2 == 0) {
            moves += 1;
        }
        document.getElementById('moves').innerHTML = moves;

        if (tiles_value.length == 0) {
            tiles_value.push(val);
            tiles_id.push(tile.id);
        }
        else if (tiles_value.length == 1) {
            tiles_value.push(val);
            tiles_id.push(tile.id);
            if (tiles_value[0] == tiles_value[1]) {
                tiles_flipped += 2;
                tiles_value = [];
                tiles_id = [];
                /* GAME OVER, show the result */
                if (tiles_flipped == tiles.length) {
                    let stars = generateStars();
                    document.getElementById('rating').innerHTML = stars;
                    rating_modal.innerHTML = stars;
                    noOfMoves_modal.innerHTML = "No of moves: " + moves;
                    timeTaken_modal.innerHTML = timer.getTimeValues().minutes + " " + "min" + " " + timer.getTimeValues().seconds + " " + "sec";
                    modal.style.display = "block";
                    timer.pause();
                }
            }
            else {
                function flip2Back() {
                    // Flip the 2 inner tiles back, by removing rotateY style
                    let tile1_inner = document.getElementById(tiles_id[0]).children[0];
                    let tile2_inner = document.getElementById(tiles_id[1]).children[0];
                    
                    let tile1_back = tile1_inner.children[1]
                    let tile2_back = tile2_inner.children[1]

                    tile1_inner.removeAttribute("style");
                    tile1_back.children[0].innerHTML = "";

                    tile2_inner.removeAttribute("style");
                    tile2_back.children[0].innerHTML = "";
                    // Clear both arrays
                    tiles_value = [];
                    tiles_id = [];
                }
                setTimeout(flip2Back, 500);
            }
        }
    }
}

function reset(){

    stopTimer();
   
    /* 1. Reset Game Status Panel */
    document.getElementById('rating').innerHTML = "";    // clear the rating from status panel above the board

    /* 2. Reset the Board containing tiles */
    document.getElementById('tiles').innerHTML = ""; // clear tiles from the board
    newBoard(); // create a new board

    /* 3. Reset the modal */
    rating_modal.innerHTML = ""      // clear the rating from model if any
    timeTaken_modal.innerHTML = ""  // clear the timeTaken from model if any
    noOfMoves_modal.innerHTML = ""  // clear the noOfMoves from model if any
}

function startTimer() {
    timer = new Timer();
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
    return output;
}

// load a new Board when window loads
window.onload = function () {
    newBoard();
}