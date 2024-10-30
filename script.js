const player1Input = document.getElementById("player-1-name");
const player2Input = document.getElementById("player-2-name");
const categorySelect = document.getElementById("category");
const startBtn = document.getElementById("start-btn");
const statusBar = document.getElementById("status-bar");
const questionArena = document.getElementById("question-arena");
const currentPlayerDisplay = document.getElementById("current-player");
const player1ScoreDisplay = document.getElementById("player-1-score");
const player2ScoreDisplay = document.getElementById("player-2-score");
const questionDisplay = document.getElementById("question");
const optionsContainer = document.getElementById("options");
const nextBtn = document.getElementById("next-btn");
const playAgainBtn = document.getElementById("play-again");
const endGameBtn = document.getElementById("end-game");
const resetBtn = document.getElementById("reset");

let players = [];
let currentPlayerIndex = 0;
let questions = [];
let currentQuestionIndex = 0;
let playerScores = [0, 0];
let selectedCategories = [];
const difficulties = ["easy", "medium", "hard"];

playAgainBtn.style.display = "none";
endGameBtn.style.display = "none";
resetBtn.style.display = "none";

startBtn.addEventListener("click", startGame);
playAgainBtn.addEventListener("click", playAgain);
endGameBtn.addEventListener("click", endGame);

function startGame() {
    const player1Name = player1Input.value.trim();
    const player2Name = player2Input.value.trim();

    if (player1Name === "" || player2Name === "") {
        alert("Please enter both player names.");
        return;
    }

    players = [player1Name, player2Name];
    document.getElementById("player-info").style.display = "block";
    currentPlayerDisplay.innerText = players[currentPlayerIndex];

    playAgainBtn.style.display = "none";
    endGameBtn.style.display = "none";
    resetBtn.style.display = "none";
    questionArena.style.display = "block";

    fetchQuestions();
}

async function fetchQuestions() {
    const selectedCategory = categorySelect.value;

    questions = [];
    for (let difficulty of difficulties) {
        const response = await fetch(`https://the-trivia-api.com/api/questions?categories=${selectedCategory}&difficulty=${difficulty}&limit=2`);
        const data = await response.json();
        questions = questions.concat(data);
    }
    displayQuestion();
}

function displayQuestion() {
    if (currentQuestionIndex < questions.length) {
        const question = questions[currentQuestionIndex];
        questionDisplay.innerText = question.question;

        const options = [...question.incorrectAnswers, question.correctAnswer];
        options.sort(() => Math.random() - 0.5);

        optionsContainer.innerHTML = "";
        options.forEach(option => {
            const optionElement = document.createElement("p");
            optionElement.innerText = option;
            optionElement.addEventListener("click", () => selectAnswer(option));
            optionsContainer.appendChild(optionElement);
        });
        currentPlayerDisplay.innerText = players[currentPlayerIndex];
        document.getElementById("difficulty").innerText = `${question.difficulty}`;
    } else {
        endRound();
    }
}

function selectAnswer(selectedOption) {
    const currentQuestion = questions[currentQuestionIndex];

    if (selectedOption === currentQuestion.correctAnswer) {
        playerScores[currentPlayerIndex] += getPoints(currentQuestion.difficulty);
    }

    player1ScoreDisplay.innerText = playerScores[0];
    player2ScoreDisplay.innerText = playerScores[1];

    currentQuestionIndex++;
    currentPlayerIndex = (currentPlayerIndex + 1) % 2;
    displayQuestion();
}

function getPoints(difficulty) {
    switch (difficulty) {
        case 'easy':
            return 10;
        case 'medium':
            return 15;
        case 'hard':
            return 20;
        default:
            return 0;
    }
}

function endRound() {
    questionArena.style.display = "none";
    playAgainBtn.style.display = "block";
    endGameBtn.style.display = "block";
}

function playAgain() {
    currentPlayerIndex = 0;
    currentQuestionIndex = 0;

    questionDisplay.style.display = "none";
    optionsContainer.style.display = "none";

    playAgainBtn.style.display = "none";
    endGameBtn.style.display = "none";

    alert("Please select a new category for the next round.");

    const selectedCategoryOption = Array.from(categorySelect.options).find(option => option.value === categorySelect.value);
    if (selectedCategoryOption) {
        selectedCategoryOption.remove();
    }
    categorySelect.selectedIndex = 0;

    if (categorySelect.options.length === 1) {
        endGame();
        return;
    }

    categorySelect.addEventListener("change", function handleCategoryChange() {
        if (categorySelect.value && !selectedCategories.includes(categorySelect.value)) {
            questionDisplay.style.display = "block";
            optionsContainer.style.display = "block";
            fetchQuestions();
            categorySelect.removeEventListener("change", handleCategoryChange);
        }
    });
}

function endGame() {
    const scoreMessage = `Final Scores - ${players[0]}: ${playerScores[0]}, ${players[1]}: ${playerScores[1]}`;

    if(playerScores[0]>playerScores[1]){
        winner = players[0];
        statusBar.innerText = `${scoreMessage} | Winner: ${winner}`;
    }
    if(playerScores[1]>playerScores[0]){
        winner = players[1];
        statusBar.innerText = `${scoreMessage} | Winner: ${winner}`;
    }
    if(playerScores[1]===playerScores[0]){
        statusBar.innerText = `${scoreMessage} | Both are Winners`;
    };

    questionArena.style.display = "none";
    playAgainBtn.style.display = "none";
    endGameBtn.style.display = "none";
    resetBtn.style.display = "block";
}
