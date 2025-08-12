const fixedTable = [
  ['Ш', 'Б'],                       // 2
  ['М', 'Н', 'К'],                  // 3
  ['Ы', 'М', 'Б', 'Ш'],             // 4
  ['Б', 'Ы', 'Н', 'К', 'М'],        // 5
  ['И', 'Н', 'Ш', 'М', 'К'],        // 5
  ['Н', 'Ш', 'Ы', 'И', 'К', 'Б'],   // 6
  ['Ш', 'И', 'Н', 'Б', 'К', 'Ы'],   // 6
  ['К', 'Н', 'Ш', 'М', 'Ы', 'Б', 'И'], // 7
  ['Б', 'К', 'Ш', 'М', 'И', 'Ы', 'Н'], // 7
  ['Н', 'К', 'И', 'Б', 'М', 'Ш', 'Ы', 'Б'], // 8
];

let targetRow = 0;
let targetCol = 0;
let timerId = null;
let isGameStarted = false;
let score = 0; // Добавляем в начало, рядом с другими переменными

function getDifficultySeconds() {
  const select = document.getElementById('difficulty');
  return parseInt(select.value, 10);
}

function generateTable() {
  const container = document.getElementById('table-container');
  container.innerHTML = '';

  fixedTable.forEach((rowArray, r) => {
    const rowDiv = document.createElement('div');
    rowDiv.classList.add('row');

    rowArray.forEach((letter, c) => {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.innerText = '';
      rowDiv.appendChild(cell);
    });

    container.appendChild(rowDiv);
  });
}

function pickRandomCell() {
  let validCells = [];
  fixedTable.forEach((row, r) => {
    row.forEach((val, c) => {
      if (val !== '') validCells.push([r, c]);
    });
  });
  const [r, c] = validCells[Math.floor(Math.random() * validCells.length)];
  targetRow = r;
  targetCol = c;
}

function highlightCell(row, col, letter, isCorrect) {
  const rows = document.querySelectorAll('.row');
  const rowDiv = rows[row];
  const cell = rowDiv.children[col];

  cell.innerText = letter;
  cell.classList.remove('highlight');
  cell.classList.add(isCorrect ? 'correct' : 'incorrect');
}

function newRound() {
  clearInterval(timerId);

  generateTable();
  pickRandomCell();

  const rows = document.querySelectorAll('.row');
  const cell = rows[targetRow].children[targetCol];
  cell.classList.add('highlight');

  document.getElementById('letter-input').value = '';
  document.getElementById('letter-input').focus();
  document.getElementById('result').textContent = '';
  startTimer();
}

function startTimer() {
  let timeLeft = getDifficultySeconds();
  const timerElement = document.getElementById('timer');
  timerElement.textContent = `Осталось: ${timeLeft} сек`;

  timerId = setInterval(() => {
    timeLeft--;
    timerElement.textContent = `Осталось:⌛ ${timeLeft} сек`;
    if (timeLeft <= 0) {
      clearInterval(timerId);
      const correctLetter = fixedTable[targetRow][targetCol];
      highlightCell(targetRow, targetCol, correctLetter, false);
      score -= 1;
      updateScoreDisplay();
      document.getElementById('result').textContent = `Время вышло! Это была "${correctLetter}". (Всего: ${score})`;
      setTimeout(() => {
        if (isGameStarted) newRound();
      }, 2000);
    }
  }, 1000);
}

function checkGuess(letter) {
  clearInterval(timerId);
  const correctLetter = fixedTable[targetRow][targetCol];
  const isCorrect = letter.toUpperCase() === correctLetter;

  // Обновляем очки
  if (isCorrect) {
    score += 3;
  } else {
    score -= 1;
  }

  highlightCell(targetRow, targetCol, correctLetter, isCorrect);

  document.getElementById('result').textContent = isCorrect
    ? `Правильно! +3 очка (Всего: ${score})`
    : `Неверно. Это была "${correctLetter}" (Всего: ${score})`;

  updateScoreDisplay(); // Показываем обновленные очки
  setTimeout(() => {
    if (isGameStarted) newRound();
  }, 1500);
}

// Обработка Enter
document.getElementById('letter-input').addEventListener('keydown', function (e) {
  if (!isGameStarted) return;
  if (e.key === 'Enter') {
    const value = this.value.trim();
    if (value.length === 1) {
      checkGuess(value);
    }
  }
});

// Обработка старта
document.getElementById('start-button').addEventListener('click', () => {
  isGameStarted = true;
  newRound();
});

function updateScoreDisplay() {
  const scoreElement = document.getElementById('score');
  scoreElement.textContent = `Очки: ${score}`;
  scoreElement.style.color = score >= 0 ? 'lightgreen' : 'lightcoral';
}