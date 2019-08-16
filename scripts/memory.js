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
  chosenPair = [];
  if (didWin()) {
    document.querySelector('.controls__win-info').style = 'visibility: visible';
    unmute();
    playSound(2);
    setTimeout(() => {
      document.querySelector(".memory").classList.add("win");
    }, 1500);

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
  let cards = document.getElementsByClassName('board__card');

  for (let i = 0; i < cards.length; i++) {
    cards[i].addEventListener('click', chooseCard);
  }
}

function setBoard() {
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
  return newBoard;
}

function reset() {
  board = [];
  sources = [];
  chosenPair = [];
  allMoves = 0;
  muted = false;

  document.querySelector(".memory").classList.remove("win");
  document.querySelector('.controls__win-info').style = 'visibility: hidden';
  document.querySelector('.board').style = 'visibility: visible';

  let moves = document.querySelector(".controls__moves");
  moves.style = 'visibility: visible';
  moves.innerHTML = "Moves made: ";


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
function toggleMute() {
  audio1 = document.getElementById("audio1");
  audio3 = document.getElementById("audio3");
  let sounds = [audio1, audio3];

  muted = !muted;

  if (muted) {
    sounds.forEach(sound => sound.volume = 0.0);
  } else {
    sounds.forEach(sound => {
      sound.volume = 1.0
    });
  }

  document.querySelector('.controls__mute').innerHTML = muted ? 'Sound: NO' : 'Sound: ON';
}

function unmute() {
  audio2 = document.getElementById("audio2");
  muted = false;
  audio2.volume = 1.0
  document.querySelector('.controls__mute').innerHTML = muted ? 'Sound: NO' : 'Sound: ON';
}

function playSound(id) {
  if (muted) return null;

  let audio = document.getElementById(`audio${id}`);

  if (id === 1) {
    let clickVariant = getRandomInt(1, 3);
    audio.src = `sounds/clicksound${clickVariant}.mp3`
  }

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
  document.getElementById(`${i}`).setAttribute('src', 'images/cover.png');
}