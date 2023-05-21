// variables to keep track of quiz state
var currentQuestionIndex = 0;
//time left value here
var time = 60;
var timerId = time;
var correctAnswers = 0;

// variables to reference DOM elements
var questionsEl = document.getElementById('questions');
var timerEl = document.getElementById('time');
var choicesEl = document.getElementById('choices');
var submitBtn = document.getElementById('submit');
var startBtn = document.getElementById('start');
var initialsEl = document.getElementById('initials');
var feedbackEl = document.getElementById('feedback');
var correctSound = document.querySelector('#correctWay');
var incorrectSound = document.querySelector('#incorrectWay');
var finalScore = document.querySelector('final-score');


function startQuiz() {
  // hide start screen
  var startScreenEl = document.getElementById('start-screen');
  // startScreenEl.removeAttribute('class');
  startScreenEl.setAttribute('class', 'hide');

  // un-hide questions section
  questionsEl.removeAttribute('class');
  questionsEl.setAttribute('class', 'start')

  // start timer
  timerId = setInterval(clockTick, 1000);

  // show starting time
  timerEl.textContent = time;

  getQuestion();
}

function getQuestion() {
  // get current question object from array
  var currentQuestion = questions[currentQuestionIndex];

  // update title with current question
  var titleEl = document.getElementById('question-title');
  titleEl.innerHTML = currentQuestion.title; //think dot notation

  // clear out any old question choices
  choicesEl.innerHTML = '';

  // loop over choices
  for (var i = 0; i < currentQuestion.choices.length; i++) {
    // create new button for each choice
    var choice = currentQuestion.choices[i];
    var choiceNode = document.createElement('button');
    choiceNode.setAttribute('class', 'choice');
    choiceNode.setAttribute('value', choice);

    choiceNode.textContent = i + 1 + '. ' + choice;

    // display on the page
    choicesEl.appendChild(choiceNode);
  }
}


function questionClick(event) {
  var currentQuestion = questions[currentQuestionIndex];
  var buttonEl = event.target;

  // if the clicked element is not a choice button, do nothing.
  if (!buttonEl.matches('.choice')) {
    return;
  }

  // check if user guessed wrong
  if (buttonEl.value !== currentQuestion.answer) {

    feedbackEl.removeAttribute('class', 'hide');
    feedbackEl.textContent = "Incorrect! -15 Seconds";
    feedbackEl.style.color = "red";
    incorrectSound.play();
    currentQuestionIndex++;
    setTimeout(function () {
      feedbackEl.textContent = "";
    }, 500);
    time -= 15; // Adjust the value as needed
    if (time < 0) {
      time = 0; // Ensure time does not go negative
    }
    if (currentQuestionIndex < questions.length) {
      getQuestion();
    } else {
      // No more questions, end the quiz
      quizEnd();
    }
    // ...
  } else {
    // User guessed correctly
    // ...

    // flash right/wrong feedback on page for half a second
    feedbackEl.removeAttribute('class', 'hide');
    feedbackEl.textContent = "Correct!";
    feedbackEl.style.color = "green";
    correctAnswers++;
    correctSound.play();

    setTimeout(function () {
      feedbackEl.textContent = "";
    }, 500);

    // Move to next question
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      getQuestion();
    } else {
      // No more questions, end the quiz
      quizEnd();
    }
  }
}

function quizEnd() {
  var grade = 100 / questions.length * +correctAnswers;
  // stop timer
  clearInterval(timerId);

  // show end screen
  var endScreenEl = document.getElementById('end-screen');
  endScreenEl.removeAttribute('class');

  // show final score
  var finalScoreEl = document.getElementById('final-score');
  finalScoreEl.textContent = grade + '%';

  // hide questions section
  questionsEl.setAttribute('class', 'hide');
}

function clockTick() {
  // update time
  // decrement the variable we are using to track time
  time--;

  // check if user ran out of time
  if (time <= 0) {
    // Stop the timer
    clearInterval(timerId);

    // Set the timer to 0
    time = 0;

    // Perform any necessary actions when time runs out
    quizEnd();
  }

  // Update the timer display
  timerEl.textContent = time;
}

function saveHighscore() {
  // get value of input box
  var initials = initialsEl.value.trim();
  var grade = 100 / questions.length * +correctAnswers;

  // make sure value wasn't empty
  if (initials !== '') {

    // get saved scores from localstorage, or if not any, set to empty array

    var highscores =
      JSON.parse(localStorage.getItem('highscores')) /* what would go inside the PARSE??*/ || [];

    // format new score object for current user
    var newScore = {
      score: time,
      initials: initials,
      grade: grade,
    };

    // save to localstorage
    highscores.push(newScore);
    window.localStorage.setItem('highscores', JSON.stringify(highscores));

    // redirect to next page
    window.location.href = 'https://mckit77.github.io/coding-quiz/highscores.html';
  }
}

function checkForEnter(event) {
  // "13" represents the enter key
  if (event.key === 'Enter') {
    saveHighscore();
  }
}

// user clicks button to submit initials
submitBtn.onclick = saveHighscore;

// user clicks button to start quiz
startBtn.onclick = startQuiz;

// user clicks on element containing choices
choicesEl.onclick = questionClick;

initialsEl.onkeyup = checkForEnter;
