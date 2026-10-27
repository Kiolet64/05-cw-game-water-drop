// Variables to control game state
let gameRunning = false; // Keeps track of whether game is active or not
let dropMaker; // Will store our timer that creates drops regularly
let countdownTimer;
let score = 0;
let timeLeft = 30;
let dropsSinceBad = 0;
const winningMessages = [
  "Amazing catch! You win!",
  "You kept the water flowing! You win!",
  "Fantastic work! You reached the goal!",
];
const losingMessages = [
  "Not quite. Give it another try!",
  "Almost there! Try again!",
  "Keep practicing. You can do it!",
];

// Wait for button click to start the game
document.getElementById("start-btn").addEventListener("click", startGame);

function startGame() {
  // Prevent multiple games from running at once
  if (gameRunning) return;

  gameRunning = true;
  score = 0;
  timeLeft = 30;
  dropsSinceBad = 0;
  document.getElementById("score").textContent = score;
  document.getElementById("time").textContent = timeLeft;
  document.getElementById("start-btn").textContent = "Game in progress";
  document.getElementById("start-btn").hidden = false;
  document.getElementById("game-container").replaceChildren();

  // Create new drops every second (1000 milliseconds)
  dropMaker = setInterval(createDrop, 1000);
  countdownTimer = setInterval(() => {
    timeLeft -= 1;
    document.getElementById("time").textContent = timeLeft;

    if (timeLeft === 0) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  gameRunning = false;
  clearInterval(dropMaker);
  clearInterval(countdownTimer);
  const gameContainer = document.getElementById("game-container");
  gameContainer.replaceChildren();

  const gameOver = document.createElement("div");
  gameOver.className = "game-over";

  const messages = score >= 20 ? winningMessages : losingMessages;
  const gameMessage = document.createElement("p");
  gameMessage.className = `game-message ${score >= 20 ? "win" : "lose"}`;
  gameMessage.setAttribute("role", "status");
  gameMessage.textContent = messages[Math.floor(Math.random() * messages.length)];

  const resetButton = document.createElement("button");
  resetButton.id = "reset-btn";
  resetButton.textContent = "Reset";
  resetButton.addEventListener("click", startGame);

  gameOver.append(gameMessage, resetButton);
  gameContainer.appendChild(gameOver);

  document.getElementById("start-btn").hidden = true;
}

function createDrop() {
  // Create a new div element that will be our water drop
  const drop = document.createElement("div");
  const isBadDrop = dropsSinceBad >= 4 || Math.random() < 0.28;
  dropsSinceBad = isBadDrop ? 0 : dropsSinceBad + 1;
  drop.className = isBadDrop ? "water-drop bad-drop" : "water-drop";

  // Make drops different sizes for visual variety
  const initialSize = 60;
  const sizeMultiplier = Math.random() * 0.8 + 0.5;
  const size = initialSize * sizeMultiplier;
  drop.style.width = drop.style.height = `${size}px`;

  // Position the drop randomly across the game width
  // Subtract 60 pixels to keep drops fully inside the container
  const gameWidth = document.getElementById("game-container").offsetWidth;
  const xPosition = Math.random() * (gameWidth - 60);
  drop.style.left = xPosition + "px";

  // Make drops fall a little faster
  drop.style.animationDuration = "2.5s";

  // Add the new drop to the game screen
  document.getElementById("game-container").appendChild(drop);

  drop.addEventListener("click", () => {
    score += isBadDrop ? -1 : 1;
    document.getElementById("score").textContent = score;
    drop.remove();
  });

  // Remove drops that reach the bottom (weren't clicked)
  drop.addEventListener("animationend", () => {
    drop.remove(); // Clean up drops that weren't caught
  });
}
