let board = [];
let sources = [];
let cardsChosen = 0;
let chosenPair = [];
let allMoves = 0;
let muted = false;

/* GAMEPLAY */
function play() {
  stopSound(2);
  reset();
  setBoard();
  addEvents();
  nextTurn();
}

function didWin() {
  let win = true;
  for (let i = 0; i < board.length; i++) {
    if (board[i].display === false) win = false;
  }
  return win;
}

function nextTurn() {
  chosenPair = [];
  if (didWin()) {
    document.getElementById('win').style = 'visibility: visible';
    document.getElementById('p-muted').style = 'visibility: hidden';
    playSound(2);
  }
}

function chooseCard(e) {
  playSound(1);
  let chosenCard = e.target.id;
  if (board[chosenCard].display == true) {
    return null;
  }
  if (chosenPair.length === 1 && chosenCard === chosenPair[0]) {
    return null;
  }
  if (chosenCard === chosenPair[0] || chosenCard === chosenPair[1]) {
    return null;
  }
  if (chosenPair.length < 3) {
    displayImage(chosenCard);
    chosenPair.push(chosenCard);
    ++allMoves;
    document.getElementById('moves').innerHTML = allMoves;
    if (chosenPair.length == 2) {
      let src1 = document.getElementById(chosenPair[0]).getAttribute('src');
      let src2 = document.getElementById(chosenPair[1]).getAttribute('src');
      if (src1 === src2) {
        for (let i = 0; i < board.length; i++) {
          if (board[i].src == src1) board[i].display = true;
          playSound(3);
          hideImages();
          nextTurn();
        }
      }
    }
    if (chosenPair.length == 3) {
      --allMoves;
      document.getElementById('moves').innerHTML = allMoves;
      chosenPair.pop();
      hideImages();
      nextTurn();
    }
  }
}
/* GAME CONFIG */
function addEvents() {
  let cards = document.getElementsByClassName('card');
  for (let i = 0; i < cards.length; i++) {
    cards[i].addEventListener('click', chooseCard);
  }
}

function setBoard() {
  sources = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7];
  for (let card = 0; card < 16; card++) {
    let srcIndex = getRandomInt(0, sources.length - 1);
    let poppedSrc = popSrc(srcIndex);
    board[card] = {
      src: `images/${poppedSrc}.png`,
      display: false
    };
  }
  hideImages();
}

function reset() {
  board = [];
  sources = [];
  chosenPair = [];
  allMoves = 0;
  muted = false;
  document.getElementById('win').style = 'visibility: hidden';
  document.getElementById('board').style = 'visibility: visible';
  document.getElementById('p-moves').style = 'visibility: visible';
  document.getElementById('moves').innerHTML = '';
}

/* HELPING TOOLS */
function popSrc(index) {
  for (let i = 0; i <= index; i++) {
    if (i === index) {
      let el = sources.splice(index, 1);
      return el[0];
    }
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
/* SOUNDS and MUTE-info */
function mute() {
  muted = !muted;
  let msg = muted ? 'yes' : 'no';
  document.getElementById('muted').innerHTML = msg;
}

function playSound(id) {
  if (muted) return null;
  var audio = document.getElementById(`audio${id}`);
  audio.play();
}

function stopSound(id) {
  let audio = document.getElementById(`audio${id}`);
  audio.pause();
  audio.currentTime = 0;
}

/* IMAGES */
function displayImages() {
  for (let i = 0; i < board.length; i++) {
    displayImage(i);
  }
}

function hideImages() {
  for (var i = 0; i < board.length; i++) {
    if (board[i].display) displayImage(i);
    else hideImage(i);
  }
}

function displayImage(i) {
  document.getElementById(`${i}`).setAttribute('src', `${board[i].src}`);
}

function hideImage(i) {
  document.getElementById(`${i}`).setAttribute('src', 'images/HIDDEN.png');
}

/*
function setBoard() {
  sources = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7];
  for (let card = 0; card < 16; card++) {
    let srcIndex = getRandomInt(0, sources.length - 1);
    let poppedSrc = popSrc(srcIndex);
    board[card] = {
      src: `${poppedSrc}.png`,
      display: false
    };
  }
  hideImages();
}

function displayImage(i) {
  document.getElementById(`${i}`).setAttribute('src', board[i].src);
}

function hideImage(i) {
  document.getElementById(`${i}`).setAttribute('src', 'HIDDEN.png');
}
*/
