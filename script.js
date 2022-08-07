// Pages
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
const splashPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');
// Splash Page
const startForm = document.getElementById('start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
// Countdown Page
const countdown = document.querySelector('.countdown');
// Game Page
const itemContainer = document.querySelector('.item-container');
// Score Page
const finalTimeEl = document.querySelector('.final-time');
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');

let difficulty = '';

// Equations
let questionAmount = 20;
let equationsArray = [];
let playerGuessArray = [];
let bestScoreArray = [];

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Time
let timer;
let timePlayed = 0;
let baseTime = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = '0.0';

// Scroll
let valueY = 0;

// Refresh Splash Page Best Scores
function bestScoresToDOM() {
  bestScores.forEach((bestScore, index) => {
    const bestScoreEl = bestScore;
    bestScoreEl.textContent = `${bestScoreArray[index].bestScore}`;
  });
}

// Check Local storage for best scores, set bestScoreArray
function getSavedBestScores() {
  if (localStorage.getItem('bestScores')) {
    bestScoreArray = JSON.parse(localStorage.bestScores);
  } else {
    bestScoreArray = [
      { difficulty: 'easy', bestScore: finalTimeDisplay },
      { difficulty: 'medium', bestScore: finalTimeDisplay },
      { difficulty: 'hard', bestScore: finalTimeDisplay },
      { difficulty: 'insane', bestScore: finalTimeDisplay },
    ];
    localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
  }
  bestScoresToDOM();
}

// Update Best Score Array
function updateBestScore() {
  bestScoreArray.forEach((score, index) => {
    // Select correct Best score to update
    if (difficulty == score.difficulty) {
      const savedBestScore = parseInt(bestScoreArray[index].bestScore, 10);
      if (savedBestScore === 0 || savedBestScore > finalTime) {
        bestScoreArray[index].bestScore = finalTimeDisplay;
      }
    }
  });
  bestScoresToDOM();
  localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
}

// Reset Game
function playAgain() {
  gamePage.addEventListener('click', startTimer);
  scorePage.hidden = true;
  splashPage.hidden = false;
  equationsArray = [];
  playerGuessArray = [];
  valueY = 0;
  playAgainBtn.hidden = true;
}


// Show Score Page
function showScorePage() {
  // Show Play Again btn after 1 sec
  setTimeout(() => {
    playAgainBtn.hidden = false;
  }, 500);
  gamePage.hidden = true;
  scorePage.hidden = false;
}

// Format & Display Time in DOM
function scoresToDOM() {
  finalTimeDisplay = finalTime.toFixed(1);
  baseTime = timePlayed.toFixed(1);
  penaltyTime = penaltyTime.toFixed(1);
  baseTimeEl
  baseTimeEl.textContent = `Base Time: ${baseTime}s`;
  penaltyTimeEl.textContent = `Penalty: +${penaltyTime}s`;
  finalTimeEl.textContent = `${finalTimeDisplay}s`;
  updateBestScore();
  // Scroll to Top, go to Score Page
  itemContainer.scrollTo({ top: 0, behavior: 'instant' });
  showScorePage();
}

// Stop timer, process results, go to Score Page
function checkTime() {
  if (playerGuessArray.length == questionAmount) {
    clearInterval(timer);
    // Check for wrong guesses, add penalty time
    equationsArray.forEach((equation, i) => {
      if (equation.evaluated === playerGuessArray[i]) {
        // Correct guess, No penalty
      } else {
        // Incorrect guess, Add Penalty
        penaltyTime += 0.5;
      }
    });
    finalTime = timePlayed + penaltyTime;
    scoresToDOM();
  }
}

// Add a tenth of a second to timePlayed
function addTime() {
  timePlayed += 0.1;
  checkTime();
}

// Start timer when game page is clicked
function startTimer() {
  // Reset times
  timePlayed = 0;
  penaltyTime = 0;
  finalTime = 0;
  timer = setInterval(addTime, 100);
  gamePage.removeEventListener('click', startTimer);
}

// Scroll, Store user selection in playerGuessArray
function select(guessedTrue) {
  // Scroll 80 pixels
  valueY += 80;
  itemContainer.scroll({
    top: valueY,
    left: 0,
    behavior: 'smooth'
  });
  // Add player guess to array
  return guessedTrue ? playerGuessArray.push('true') : playerGuessArray.push('false');
}

// Displays Game Page
function showGamePage() {
  gamePage.hidden = false;
  countdownPage.hidden = true;
}

// Get random num up to a max num
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function selectDifficulty(level) {
  if (level === 'insane') {
    firstNumber = getRandomInt(100);
    secondNumber = getRandomInt(100);
  };
  if (level === 'hard') {
    firstNumber = getRandomInt(50);
    secondNumber = getRandomInt(50);
  };
  if (level === 'medium') {
    firstNumber = getRandomInt(20);
    secondNumber = getRandomInt(20);
  };
  if (level === 'easy') {
    firstNumber = getRandomInt(10);
    secondNumber = getRandomInt(10);
  };
}

// Create Correct/Incorrect Random Equations
function createEquations(level) {
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomInt(questionAmount);
  // Set amount of wrong equations
  const wrongEquations = questionAmount - correctEquations;
  // Loop through, multiply random numbers, push to array
  for (let i = 0; i < correctEquations; i++) {
    selectDifficulty(level);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: 'true' };
    equationsArray.push(equationObject);
  }
  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    selectDifficulty(level);
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomInt(3);
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: 'false' };
    equationsArray.push(equationObject);
  }
  shuffle(equationsArray);
}

// Add equations to DOM
function equationsToDOM() {
  equationsArray.forEach(equation => {
    // Item
    const item = document.createElement('div');
    item.classList.add('item');
    // Equations Text
    const equationText = document.createElement('h1');
    equationText.textContent = equation.value;
    // Append
    item.appendChild(equationText);
    itemContainer.appendChild(item);
  });
}

// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = '';
  // Spacer
  const topSpacer = document.createElement('div');
  topSpacer.classList.add('height-240');
  // Selected Item
  const selectedItem = document.createElement('div');
  selectedItem.classList.add('selected-item');
  // Append
  itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  createEquations(difficulty);
  equationsToDOM();
  // Set Blank Space Below
  const bottomSpacer = document.createElement('div');
  bottomSpacer.classList.add('height-500');
  itemContainer.appendChild(bottomSpacer);
}

// Displays 3, 2, 1
function countdownStart() {
  let count = 3
  countdown.textContent = count;
  const timeCountDown = setInterval(() => {
    count--;
    if (count === 0) countdown.textContent = 'GO!';
    else if (count === -1) {
      showGamePage()
      clearInterval(timeCountDown);
    }
    else countdown.textContent = count;
  }, 1000);
}


// Navigate from Splash Page to Countdown Page
function showCountdown() {
  countdownPage.hidden = false;
  splashPage.hidden = true;
  countdownStart();
  populateGamePage();
}


// Get the value from selected radio button
function getRadioValue() {
  let radioValue;
  radioInputs.forEach(radioInput => {
    if (radioInput.checked) {
      radioValue = radioInput.value;
    }
  });
  return radioValue;
}

// Form that decides amount of questions
function getDifficultyValue(e) {
  e.preventDefault();
  difficulty = getRadioValue();
  difficulty !== undefined ? showCountdown() : false;
}

startForm.addEventListener('click', () => {
  radioContainers.forEach(radioEl => {
    // Remove Selected Label Styling
    radioEl.classList.remove('selected-label');
    // Add it back if radio input is checked
    if (radioEl.children[1].checked) {
      radioEl.classList.add('selected-label');
    }
  });
});

// Event Listeners
startForm.addEventListener('submit', getDifficultyValue);
gamePage.addEventListener('click', startTimer);

getSavedBestScores();