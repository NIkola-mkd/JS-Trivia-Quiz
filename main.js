let load = document.getElementById("load");
let start = document.getElementById("start");
let menu = document.getElementById("menu");
let quizgrid = document.getElementById("quizGrid");
let questions = [];
let score = 0;
let answersSubmitted = []; //answered questions
let currentQuestionNumber = 0;
let answers = [];
let arrAnsw = []; //shuffled answers
let answer1 = document.getElementById("answer1");
let answer2 = document.getElementById("answer2");
let answer3 = document.getElementById("answer3");
let answer4 = document.getElementById("answer4");
let totalQuestions = 20;
let api = `https://opentdb.com/api.php?amount=${totalQuestions}&type=multiple`;
let statusBar = document.getElementById("status");
let completed = document.getElementById("completed");

function shuffle(arr) {
  let curr = arr.length;
  let random;
  while (curr != 0) {
    random = Math.floor(Math.random() * curr);
    curr--;
    [arr[curr], arr[random]] = [arr[random], arr[curr]];
  }

  return arr;
}

// take data from api
async function getData(api) {
  await fetch(api)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      load.classList.replace("visible", "invisible");
      menu.classList.replace("invisible", "visible");
      completed.classList.replace("invisible", "visible");
      start.addEventListener("click", handleStart);
      //   console.log(data["results"]);
      startGame(data["results"]);
    })
    .catch((err) => {
      console.log(err);
      let errmsg = document.getElementById("loadmsg");
      errmsg.innerText = `Can't load quiz. Please try later...`;
      errmsg.classList.add("text-danger");
    });
}

// satrt quiz
function startGame(q) {
  questions = q;
  displayQuestion(questions);
}

// display questions on click
function handleStart(e) {
  quizgrid.classList.replace("invisible", "visible");
  title.innerText = `Good Luck!`;
  description.innerText = `Click on the button to start over.`;
  start.innerText = `Start over`;
  start.classList.replace("btn-success", "btn-warning");
  location.hash = `question-0`;
  start.addEventListener("click", function () {
    window.location.reload();
  });
}

// using flags to manipulate with answered questions
let answered1 = false;
let answered2 = false;
let answered3 = false;
let answered4 = false;

document.getElementById("a1").onclick = function () {
  answered1 = true;
  checkAnswer();
};
document.getElementById("a2").onclick = function () {
  answered2 = true;
  checkAnswer();
};
document.getElementById("a3").onclick = function () {
  answered3 = true;
  checkAnswer();
};
document.getElementById("a4").onclick = function () {
  answered4 = true;
  checkAnswer();
};

// display question grid
function displayQuestion(questions) {
  questionText = questions[currentQuestionNumber]["question"];
  correctAnswer = questions[currentQuestionNumber]["correct_answer"];
  incorrectAnswers = questions[currentQuestionNumber]["incorrect_answers"];
  category = questions[currentQuestionNumber]["category"];
  answers = [];
  answers.push(correctAnswer);
  for (let i = 0; i < 3; i++) {
    answers.push(incorrectAnswers[i]);
  }
  answers = shuffle(answers);
  arrAnsw.push(answers);
  document.getElementById("question").innerHTML = questionText;
  answer1.innerHTML = answers[0];
  answer2.innerHTML = answers[1];
  answer3.innerHTML = answers[2];
  answer4.innerHTML = answers[3];

  document.getElementById("category").innerHTML = category;
  statusBar.classList.replace("invisible", "visible");

  completed.innerText = `Completed ${currentQuestionNumber}/${totalQuestions}`;
}

// check if answer is correct and calculate score
function checkAnswer() {
  if (answered1 == true) {
    if (answers[0] === questions[currentQuestionNumber]["correct_answer"]) {
      score++;
    }
    answered1 = false;
    answersSubmitted.push(0);
    displayNext();
  } else if (answered2 == true) {
    if (answers[1] === questions[currentQuestionNumber]["correct_answer"]) {
      score++;
    }
    answered2 = false;
    answersSubmitted.push(1);
    displayNext();
  } else if (answered3 == true) {
    if (answers[2] === questions[currentQuestionNumber]["correct_answer"]) {
      score++;
    }
    answered3 = false;
    answersSubmitted.push(2);
    displayNext();
  } else if (answered4 == true) {
    if (answers[3] === questions[currentQuestionNumber]["correct_answer"]) {
      score++;
    }
    answered4 = false;
    answersSubmitted.push(3);
    displayNext();
  }
}

// displaying next question using hashchange
function displayNext() {
  if (currentQuestionNumber == totalQuestions - 1) {
    gameOver();
  } else {
    currentQuestionNumber++;
    displayQuestion(questions);
    location.hash = `question-${currentQuestionNumber}`;
  }
}

// check if the game is over
function gameOver() {
  quizgrid.classList.replace("visible", "invisible");
  title.innerText = `Lets see your score!`;
  description.innerText = `Click on the button to try again.`;
  start.innerText = `Try again`;
  start.classList.replace("btn-warning", "btn-danger");
  completed.innerText = `Total Correct Answers ${score}/${totalQuestions}`;
  start.addEventListener("click", function () {
    window.location.reload();
  });
}

window.addEventListener("load", getData(api));
