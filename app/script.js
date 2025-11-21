let streak = 0;
let currentAnswer = 0;

const problemEl = document.getElementById("problem");
const answerInput = document.getElementById("answer");
const submitBtn = document.getElementById("submit");
const feedbackEl = document.getElementById("feedback");
const streakEl = document.getElementById("streak");
const newGameBtn = document.getElementById("new-game");
const inputArea = document.getElementById("input-area");
const celebration = document.getElementById("celebration");

function generateProblem() {
  const a = Math.floor(Math.random() * 20) + 1;
  const b = Math.floor(Math.random() * 20) + 1;
  const isAddition = Math.random() > 0.5;
  
  currentAnswer = isAddition ? a + b : a - b;
  if (!isAddition && a < b) [a, b] = [b, a]; // ensure positive result

  problemEl.textContent = `${a} ${isAddition ? "+" : "−"} ${b} = ?`;
  answerInput.value = "";
  answerInput.focus();
  feedbackEl.textContent = "";
}

function checkAnswer() {
  const userAnswer = parseInt(answerInput.value);
  if (isNaN(userAnswer)) return;

  if (userAnswer === currentAnswer) {
    streak++;
    streakEl.textContent = streak;
    feedbackEl.innerHTML = "✅ Correct! 🌟";
    if (streak === 10) {
      celebration.classList.remove("hidden");
      setTimeout(() => celebration.classList.add("hidden"), 5000);
    }
    setTimeout(generateProblem, 1200);
  } else {
    streak = 0;
    streakEl.textContent = streak;
    feedbackEl.innerHTML = "❌ Try again! 💪";
  }
}

// Event Listeners
submitBtn.addEventListener("click", checkAnswer);
answerInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") checkAnswer();
});
newGameBtn.addEventListener("click", () => {
  streak = 0;
  streakEl.textContent = streak;
  inputArea.classList.remove("hidden");
  celebration.classList.add("hidden");
  generateProblem();
});

// Start
newGameBtn.click();