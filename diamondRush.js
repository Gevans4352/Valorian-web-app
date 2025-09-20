let weapons = ["shield", "sword", "arrow", "dragon", "crown" ];
let board = [];
let gameHistory = [];
let rows = 10;
let columns = 10;
let score = 0;
let timeLeft = 60;
let coins = 0;
let diamond = 0;
let gameTimer;
let currTile;
let otherTile;
let gameStarted = false;
let audio;
let isGameActive = true;
const pauseModal = document.getElementById("pause-modal");
const homeLink = document.getElementById("home-link");




window.addEventListener('load', function() {
  if (localStorage.getItem('musicPlaying') === 'true') {
    const gameAudio = new Audio('./assets/wizard.mp3');
    gameAudio.loop = true;
    gameAudio.play();
  }
});



window.onload = function(){
    loadProgress();
    preloadImages();
    startGame();
    document.getElementById("diamondCount").innerText = diamond;
    document.getElementById("coins-display").innerText = coins;
};
  window.setInterval(function(){
    if (gameStarted) {
      crushWeapon();
      slideWeapons();
      generateWeapons();
    }
  }, 100);


function preloadImages() {
    weapons.forEach(weapon => {
        const img = new Image();
        img.src = "./assets/" + weapon + ".svg";
    });
}
function randomWeapon(){
  return weapons[Math.floor(Math.random() * weapons.length)];
}
function startGame(){
    for(let r = 0; r < rows; r++){
        let row = []
        for(let c = 0; c < columns; c++){
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = "./assets/" + randomWeapon() + ".svg"
            tile.addEventListener("dragstart", dragStart); //click on candy
            tile.addEventListener("dragover", dragOver); // start moving mouse
            tile.addEventListener("dragenter", dragEnter); //drag weapon to another weapon
            tile.addEventListener("dragleave", dragLeave); // leave weapon
            tile.addEventListener("drop", dragDrop);
            tile.addEventListener("dragend", dragEnd); //swap weapon
            document.getElementById("board").append(tile);
            row.push(tile)
        }
        board.push(row)
    }
console.table(board)
}
function resetBoard() {
    const boardElement = document.getElementById("board");
    boardElement.innerHTML = ""; 
    board = [];
    for(let r = 0; r < rows; r++){
        let row = []
        for(let c = 0; c < columns; c++){
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = "./assets/" + randomWeapon() + ".svg"
            tile.addEventListener("dragstart", dragStart);
            tile.addEventListener("dragover", dragOver);
            tile.addEventListener("dragenter", dragEnter);
            tile.addEventListener("dragleave", dragLeave);
            tile.addEventListener("drop", dragDrop);
            tile.addEventListener("dragend", dragEnd);
            boardElement.append(tile);
            row.push(tile)
        }
        board.push(row)
    }
}
function dragStart(){
    currTile = this;
}

function dragOver(e){
    e.preventDefault()
}

function dragEnter(e){
    e.preventDefault()
}

function dragLeave(){

}

function dragDrop(e){
    otherTile = this;
}

function dragEnd(){
    if (!isGameActive) return;
    if(currTile.src.includes("blank") || otherTile.src.includes("blank")){
        return;
    }
    let currcoord = currTile.id.split("-")
    let r = parseInt(currcoord[0])
    let c = parseInt(currcoord[1])
    let otherCords = otherTile.id.split("-");
    let r2 = parseInt(otherCords[0]);
    let c2 = parseInt(otherCords[1]);
    let moveLeft = c2 == c-1 && r == r2;
    let moveRight = c2 == c+1 && r == r2;
    let moveUp = r2 == r-1 && c == c2;
    let moveDown = r2 == r+1 && r == r2;
    let isAdjacent = moveLeft || moveRight|| moveUp || moveDown;

    if(isAdjacent){
    let currImg = currTile.src;
    let otherImg = otherTile.src;
    currTile.src = otherImg;
    otherTile.src = currImg;
    let validMove = checkValid()

    if(!validMove){
    // let currImg = currTile.src;
    // let otherImg = otherTile.src;
    currTile.src = otherImg;
    otherTile.src = currImg;  
    } else{
        if (!gameStarted) {
            gameStarted = true;
        }
        crushThree();
        }
        if (!gameTimer) {
        startGameTimer();
        }
    }
}


function crushWeapon(){
    // crushFour()
    // crushFive()
    crushThree();
    document.getElementById("score").innerText = score;
}

function crushThree(){
    let matches = [];
    //horizontal check
for(let r = 0; r < rows; r++){
    for(let c = 0; c < columns -2; c++){
        let weapon1 = board[r][c];
        let weapon2 = board[r][c+1];
        let weapon3 = board[r][c+2];
        if(weapon1.src == weapon2.src && weapon2.src == weapon3.src && !weapon1.src.includes("blank")){
            matches.push(weapon1, weapon2, weapon3);
        }
    }
}
//vertical check
for(let c = 0; c < columns; c++){
    for(let r = 0; r < rows- 2; r++){
        let weapon1 = board[r][c];
        let weapon2 = board[r+1][c];
        let weapon3 = board[r+2][c]
         if(weapon1.src == weapon2.src && weapon2.src == weapon3.src && !weapon1.src.includes("blank")){
           matches.push(weapon1, weapon2, weapon3);
        }
    }
}
   if (matches.length > 0) {
        score += 20;
        matches.forEach(tile => tile.src = "./assets/blank.svg");
    }
}

function checkValid(){
    //horizontal check
    for(let r = 0; r < rows; r++){
    for(let c = 0; c < columns - 2; c++){
        let weapon1 = board[r][c];
        let weapon2 = board[r][c+1];
        let weapon3 = board[r][c+2];
        if(weapon1.src == weapon2.src && weapon2.src == weapon3.src && !weapon1.src.includes("blank")){
            return true;
    }
    }
}
//vertical check 
for(let c = 0; c < columns; c++){
    for(let r = 0; r < rows-2; r++){
        let weapon1 = board[r][c];
        let weapon2 = board[r+1][c];
        let weapon3 = board[r+2][c]
        if(weapon1.src == weapon2.src && weapon2.src == weapon3.src && !weapon1.src.includes("blank")){
            return true
        }
    }
}
return false
}

function slideWeapons(){
    for(let c = 0; c < columns; c++){
        let ind = rows - 1;
        for(let r = columns -1 ; r>=0; r-- ){
            if(!board[r][c].src.includes("blank")){
                board[ind][c].src = board[r][c].src;
                ind -= 1
            }
        }
        for(let r = ind; r >= 0; r--){
            board[r][c].src = "./assets/blank.svg";
        }
    }
}

function  generateWeapons(){
    for(let c = 0; c< columns; c++){
        if(board[0][c].src.includes("blank")){
            board[0][c].src = "./assets/" + randomWeapon() + ".svg"

        }
    }
}
function startGameTimer() {
    if (gameTimer) {
        return; 
    }
    const progressBarFill = document.getElementById("progressBarFill");
    const initialTime = timeLeft; 

    gameTimer = setInterval(function() {
        if (!isGameActive) {
    clearInterval(gameTimer);
    return;
    }
        timeLeft--;
        document.getElementById("timer").innerText = timeLeft;
        const percentageLeft = (timeLeft / initialTime) * 100;
        progressBarFill.style.width = `${percentageLeft}%`;
        if (timeLeft <= 10) {
            progressBarFill.style.background = 'linear-gradient(to right, #e74c3c, #c0392b)';
        } else if (timeLeft <= 30) {
            progressBarFill.style.background = 'linear-gradient(to right, #f1c40f, #e67e22)';
        } else {
            progressBarFill.style.background = 'linear-gradient(to right, #e7b13c, #c0b12b)';
        }

        if (timeLeft <= 0) {
            clearInterval(gameTimer);
            isGameActive = false;
            progressBarFill.style.width = '0%';

            if (diamond > 0) {
                document.getElementById("diamondCount").innerText = diamond;
                document.getElementById("lifeModal").style.display = "flex";
                let lifeSaverCountdown = 10;
                const countdownInterval = setInterval(() => {
                    lifeSaverCountdown--;
                    if (lifeSaverCountdown <= 0) {
                        clearInterval(countdownInterval);
                        declineLifeSaver();
                    }
                }, 1000);
            } else {
                updateResultModal();
                document.getElementById("result-modal").style.display = "flex";
            }
        }
    }, 1000);
}
function restartGame() {
    document.getElementById("result-modal").style.display = "none";
    score = 0;
    timeLeft = 60;
    isGameActive = false;
    clearInterval(gameTimer);
    gameTimer = null;
    document.getElementById("score").innerText = score;
    document.getElementById("timer").innerText = timeLeft;
    window.location.reload();
    resetBoard();
}
function updateResultModal() {
    let stars = 0;
    let message = "";
    let coinsEarned = 0;
    let diamondEarned = 0;
    if (score >= 750) {
        stars = 3;
        message = "Amazing! 3 Stars!";
        coinsEarned = 500;
        diamondEarned = 2;
    } else if (score >= 250) {
        stars = 2;
        message = "Great Job! 2 Stars!";
        coinsEarned = 50;
        diamondEarned = 0;
    } else if (score >= 100) {
        stars = 1;
        message = "Good Try! 1 Star!";
        coinsEarned = 150;
        diamondEarned = 0;
    } else {
        message = "Failed. Try again!";
        coinsEarned = 0;
        diamondEarned = 0;

    }
    document.getElementById("stars-message").innerText = message;
    document.getElementById("score-display").innerText = "Score: " + score;
    document.getElementById("coins-display").innerText = "Coins: " + coinsEarned;
    const starContainer = document.getElementById("star-container");
    starContainer.innerHTML = "";
    for (let i = 0; i < stars; i++) {
        const starImg = document.createElement("img");
        starImg.src = "./assets/starrr.svg"; 
        starImg.alt = "Star";
        starImg.classList.add("star");
        starContainer.appendChild(starImg);
    }
    coins += coinsEarned;
    diamond += diamondEarned; 
    saveProgress();
}
function saveProgress() {
    localStorage.setItem('playerCoins', coins);
    localStorage.setItem('playerDiamonds', diamond);
}

function loadProgress() {
    const savedCoins = localStorage.getItem('playerCoins');
    const savedDiamonds = localStorage.getItem('playerDiamonds');
    if (savedCoins) coins = parseInt(savedCoins);
    if (savedDiamonds) diamond = parseInt(savedDiamonds);
}
function useLifeSaver() {
    document.getElementById("lifeModal").style.display = "none";
    diamond--;
    saveProgress();
    timeLeft = 5;
    document.getElementById("timer").innerText = timeLeft; 
    isGameActive = true;
    gameStarted = true; 
    clearInterval(gameTimer);
    gameTimer = null; 
    startGameTimer();
}


homeLink.addEventListener("click", function(event) {
    if (gameStarted && isGameActive) {
        event.preventDefault();
        clearInterval(gameTimer);
        gameTimer = null;
        isGameActive = false;
        pauseModal.style.display = "flex";
    }
});

function continueGame() {
    pauseModal.style.display = "none";
    isGameActive = true;
    startGameTimer();
}

function leaveGame() {
    window.location.href = "./homePage.html";
}

function declineLifeSaver() {
    document.getElementById("lifeModal").style.display = "none";
    updateResultModal();
    document.getElementById("result-modal").style.display = "flex";
}
console.log("Pause clicked", pauseModal);

function saveGameResult() {
    const result = {
        score: score,
        stars: calculateStars(),
        coins: coinsEarned,
        diamond: diamondEarned,
        date: new Date().toLocaleString()
    };
    gameHistory.push(result);
    localStorage.setItem('gameHistory', JSON.stringify(gameHistory));
}

function showHistory() {
    console.log();
}

function goBack() {
  window.history.back()
}
