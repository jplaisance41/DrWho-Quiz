// Variables
var scores = document.querySelector("#scores");
var timer = document.querySelector("#timer");
var container = document.querySelector("#container");
var title = document.querySelector("#title");
var content = document.querySelector("#content");
var start = document.querySelector("#start");
var answer = document.querySelector("#answer");

// Question Structure
class Question {
    constructor(question, options, answer) {
        this.question = question;
        this.options = options;
        this.answer = answer;
    }
}

var questionList = [];

// Questions
var options1 = ["1. Earth", "2. Asgard", "3. Jupiter", "4. Gallifrey"];
var question1 = new Question("What is the name of The Doctor's home planet?", options1, "4. Gallifrey");
questionList.push(question1);

var options2 = ["1. Allons-y!", "2. I don't want to go.", "3. Bye, Felicia.", "4. That's all folks!"];
var question2 = new Question("What were the last words uttered by the tenth Doctor before regenerating?", options2, "2. I don't want to go.");
questionList.push(question2);

var options3 = ["1. Time And Realistic Dimension In Space", "2. Time and Regular Direction in Space", "3. Time And Relative Dimension In Space", "4. Time And Relative Direction In Space"];
var question3 = new Question("The 'TARDIS' is a Time-Lord spacecraft/time machine, what does it stand for?", options3, "3. Time And Relative Dimension In Space");
questionList.push(question3);

var options4 = ["1. 1975 Lotus Espirit", "2. Police Box", "3. London City Bus", "4. Grey Flying Saucer"];
var question4 = new Question("The Doctor's TARDIS' active camouflage system is broken, so it always appears as a __________.", options4, "2. Police Box");
questionList.push(question4);

var options5 = ["1. Sonic Screwdriver", "2. Electric Toothbrush", "3. Wand", "4. Large Hammer called 'Mjolnir'"];
var question5 = new Question("What is the Doctor's most important tool?", options5, "1. Sonic Screwdriver");
questionList.push(question5);

var options6 = ["1. Donna Noble", "2. Rose Tyler", "3. Clara Oswald", "4. River Song"];
var question6 = new Question("What is the name of the Doctor's wife?", options6, "4. River Song");
questionList.push(question6);

// Working variables for question loop
var optionList = [];
var currentQues = 0;
var score = 0;
var timeLeft = 61;
var isQuizOngoing = false;
var leaderboard = [];
var initials = "";
var isClearingAnswer = false;
var clearingAnswerCode = 0;
var isCorrect = false;

// Click functions 
function init() {
    start.addEventListener("click", questionLoop);
    scores.addEventListener("click", showScores);
}

function questionLoop () {
    runTimer();
    isQuizOngoing = true;
    start.setAttribute("style", "display: none");
    content.setAttribute("style", "display: none");
    var numOfOptions = questionList[0].options.length;
    for(var i = 0; i < numOfOptions; i++) {
        var option = document.createElement("button");
        container.appendChild(option);
        optionList.push(option);
        option.setAttribute("id", `button${i + 1}`);
    }
    nextQuestion();
}

// Timer function
function runTimer () {
    var clock = setInterval(function() {
        timeLeft--;
        timer.textContent = `Time: ${timeLeft} seconds`;
        if(timeLeft === 0) {
            clearInterval(clock);
            if(title.textContent !== "Before I go, I just want to tell you: you were fantastic. Absolutely fantastic. – The Ninth Doctor, The Parting of the Ways.") {
                endOfQuiz();
            }
        }
    }, 1000)
}


// Function to to go to next question/end quiz
function nextQuestion(event) {
    writeAnswer(event);
    if(currentQues < questionList.length) {
        changeQuestion();
    } else {
        endOfQuiz();
    }
}


// Function to check the answer and give time penalty for wrong answers 
function writeAnswer(event) {
    if(event !== undefined) {
        if(event.currentTarget.textContent === questionList[currentQues - 1].answer) {
            isCorrect = true;
            answer.textContent = "Correct";
            answer.setAttribute("style", "color: green");
            score += 10;
        } else {
            isCorrect = false;
            answer.textContent = "Incorrect";
            answer.setAttribute("style", "color: red");
            if(timeLeft > 10) {
                timeLeft -= 10;
            } else {
                timeLeft = 1;
            }
            timer.setAttribute("style", "color: red");
            setTimeout(function () {
                timer.setAttribute("style", "color: black");
            },1000);
        }
        clearAnswer();
    }
}

function clearAnswer() {
    if(isClearingAnswer) {
        isClearingAnswer = false;
        clearTimeout(clearingAnswerCode);
        clearAnswer();
    } else {
        isClearingAnswer = true;
        clearingAnswerCode = setTimeout(function() {
            answer.textContent = "";
            isClearingAnswer = false;
        }, 3000);
    }
}

// Function to change to the next question/answers
function changeQuestion() {
    title.textContent = questionList[currentQues].question;
    for(var i = 0; i < questionList[currentQues].options.length; i++) {
        optionList[i].textContent = questionList[currentQues].options[i];        
        optionList[i].addEventListener("click", nextQuestion);
    }
    currentQues++;
}

// Function to change the title to a quote, display the score, and create an input field
function endOfQuiz() {
    title.textContent = "Before I go, I just want to tell you: you were fantastic. Absolutely fantastic. – The Ninth Doctor, The Parting of the Ways.";
    timeLeft = 1;
    clearOptions();
    clearAnswer();
    content.setAttribute("style", "display: visible");
    content.textContent = `Great Job! Your final score was ${score}!`;
    inputFields();
}

// Function to remove the option buttons and empty arrays
function clearOptions() {
    for(var i = 0; i < optionList.length; i++) {
        optionList[i].remove();
    }
    optionList = [];
}

// Function to create the form to enter the user's initials and event listener for when they click submit
function inputFields() {
    var initialsForm = document.createElement("form");
    container.appendChild(initialsForm);
    initialsForm.setAttribute("id", "form");
    var label = document.createElement("label");
    initialsForm.appendChild(label);
    label.textContent = "Enter initials: "
    var input = document.createElement("input")
    initialsForm.appendChild(input);
    input.setAttribute("id", "initials");
    var submit = document.createElement("button");
    initialsForm.appendChild(submit);
    submit.setAttribute("id", "submit");
    submit.textContent = "Submit";

    title.setAttribute("style", "align-self: start")
    content.setAttribute("style", "align-self: start; font-size: 150%");

    
    input.addEventListener("keydown", stopReload);
    submit.addEventListener("click", addScore);
    
}

// Function to prevent page from reloading
function stopReload(event) {
    if(event.key === "Enter") {
        event.preventDefault();
    }
}

// Function to prevent page from reloading, and checks if input is in proper format
function addScore(event) {
    if(event !== undefined) {
        event.preventDefault();
    }
    var id = document.getElementById("initials");
    if(id.value.length > 3 || id.value.length === 0) {
        invalidInput();
        return;
    }
    isQuizOngoing = false;
    document.getElementById("form").remove();
    saveScore(id);
}

// Function to didplay scores
function saveScore(id) {
    if(localStorage.getItem("leaderboard") !== null) {
        leaderboard = JSON.parse(localStorage.getItem("leaderboard"));
    }
    leaderboard.push(`${score} ${id.value}`);
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    showScores();    
}

// Function to alert user of an improper input
function invalidInput() {
    answer.textContent = "Please enter 3 chracters or less to submit!";
    answer.setAttribute("style", "color: red");
    clearAnswer();
    var submit = document.getElementById("submit");
    submit.addEventListener("click", addScore);
}

// Function to prevent user from exiting quiz to view high scores
function showScores() {
    if(!isQuizOngoing) {
        title.textContent = "High Scores";
        start.setAttribute("style", "display: none");
        writeScores();
        createEndButtons();
    } else if(title.textContent === "Before I go, I just want to tell you: you were fantastic. Absolutely fantastic. – The Ninth Doctor, The Parting of the Ways.") {
        answer.textContent = "Wait! Enter your initials first!";
        answer.setAttribute("style", "color: red");
        clearAnswer();
    } else {
        answer.textContent = "Please complete the quiz first!";
        answer.setAttribute("style", "color: red");
        clearAnswer();
    }
}

// Function to display scores
function writeScores() {
    content.textContent = "";
    content.setAttribute("style", "white-space: pre-wrap; font-size: 150%");
    if(localStorage.getItem("leaderboard") !== null) {
        leaderboard = JSON.parse(localStorage.getItem("leaderboard"));
    }
    leaderboard.sort();
    leaderboard.reverse();
    var limit = 11;
    if(limit > leaderboard.length) {
        limit = leaderboard.length;
    }
    for(var i = 0; i < limit; i++) {
        content.textContent += leaderboard[i] + '\n';
    }
}

// Checks to see if the buttons have been created already
// Function to create buttons and add click event listeners
function createEndButtons() {
    if(!document.getElementById("restart")) {
        var restartVar = document.createElement("button");
        container.appendChild(restartVar);
        restartVar.textContent = "Back";
        restartVar.setAttribute("id", "restart");
        
        var clearScoresVar = document.createElement("button");
        container.appendChild(clearScoresVar);
        clearScoresVar.textContent = "Clear All";
        clearScoresVar.setAttribute("id", "clearScores");
        
        restartVar.addEventListener("click", restart);
        clearScoresVar.addEventListener("click", clearScores)
    }
}

// Restart function
function restart() {
    title.setAttribute("style", "align-self: center");
    content.setAttribute("style", "align-self: center; font-size: 110%");
    document.getElementById("restart").remove();
    document.getElementById("clearScores").remove();
    title.textContent = "Dr. Who Quiz";
    content.textContent = "Try to correctly answer all of the following questions within the time limit. WARNING: Every wrong answer will cost you 10 seconds! Good Luck!";
    start.setAttribute("style", "display: visible");
    currentQues = 0;
    score = 0;
    timeLeft = 61;
    init();
}

// Function to clear local storage
function clearScores() {
    localStorage.clear();
    content.textContent = "";
    leaderboard = [];
}

init();