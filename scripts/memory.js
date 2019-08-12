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
  board = setBoard();
  hideImages();
  addEvents();
  nextTurn();
}

function didWin() {
  let win = true;
  board.forEach(card => {
    if (card.display === false) win = false;
  })
  return win;
}

function nextTurn() {
  console.log("next turn")
  chosenPair = [];
  if (didWin()) {
    document.querySelector('.controls__win-info').style = 'visibility: visible';
    document.querySelector('.controls__mute').style = 'visibility: hidden';
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
    document.querySelector('.controls__moves').innerHTML = "Moves made: " + allMoves;
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
      document.querySelector('.controls__moves').innerHTML = "Moves made: " + allMoves;
      chosenPair.pop();
      hideImages();
      nextTurn();
    }
  }
}
/* GAME CONFIG */
function addEvents() {
  console.log("setting events");
  let cards = document.getElementsByClassName('board__card');

  for (let i = 0; i < cards.length; i++) {
    cards[i].addEventListener('click', chooseCard);
  }
}

function setBoard() {
  console.log("setting board")
  sources = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7];
  let newBoard = [];
  for (let card = 0; card < 16; card++) {
    let srcIndex = getRandomInt(0, sources.length - 1);
    let poppedSrc = popSrc(srcIndex);
    newBoard[card] = {
      src: `images/${poppedSrc}.png`,
      display: false
    };
  }
  console.table(newBoard);
  return newBoard;
}

function reset() {
  console.log("resetting")
  board = [];
  sources = [];
  chosenPair = [];
  allMoves = 0;
  muted = false;

  document.querySelector('.controls__win-info').style = 'visibility: hidden';
  document.querySelector('.board').style = 'visibility: visible';
  document.querySelector(".controls__moves").style = 'visibility: visible';


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
  let msg = muted ? 'SOUND' : 'NO SOUND';
  document.querySelector('.controls__mute').innerHTML = msg;
}

function playSound(id) {
  if (muted) return null;

  var audio = document.getElementById(`audio${id}`);

  if (id === 1) {
    let clickVariant = getRandomInt(1, 3);
    audio.src = `sounds/clicksound${clickVariant}.mp3`
  }

  audio.play();
}

function stopSound(id) {
  console.log("stopping sound")
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
  document.getElementById(`${i}`).setAttribute('src', 'images/cover.png');
}