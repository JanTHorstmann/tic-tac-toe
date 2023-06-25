let fields = [
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
];

currentplayer = 'circle';


function init() {
  showPlayer('circle');
  showPlayer('cross');
  renderGame();
}

//--------------------------------------------------//
//-----------------render Gamefield-----------------//
//--------------------------------------------------//

function renderGame() {
  let gameField = document.getElementById('content');

  let table = '<table>';
  for (let i = 0; i < 3; i++) {
    table += '<tr>';
    for (let j = 0; j < 3; j++) {
      let symbol = '';
      const fieldNumber = i * 3 + j;
      table += `<td onclick="generateSymbol(this, ${fieldNumber})">${symbol}</td>`;
    }
    table += '</tr>';
  }
  table += '</table>';
  gameField.innerHTML = table;
  schowCurrentplay()
}

//--------------------------------------------------//
//-----------------generate Symbols-----------------//
//--------------------------------------------------//

function generateSymbol(cell, fieldNumber) {
  if (fields[fieldNumber] === null) {
    fields[fieldNumber] = currentplayer;
    cell.innerHTML = currentplayer === 'circle' ? generateCircle() : generateCross();
    cell.onclick = null;
    currentplayer = currentplayer === 'circle' ? 'cross' : 'circle';
  }
  const winningCombination = checkWin();
  if (winningCombination) {
    drawWinningLine(winningCombination);
    renderEndscreen(fields[winningCombination[0]]);
  } else if (!fields.includes(null)) {
    renderEndscreen(null);
  } else {
    schowCurrentplay();
  }
}

function generateCircle() {
  const dimensions = 80;
  const color = '#00B0EF';
  const duration = 0.2;

  return `<svg width="${dimensions}" height="${dimensions}">
              <circle cx="${dimensions / 2}" cy="${dimensions / 2}" r="${dimensions / 2}" stroke="${color}" stroke-width="0" fill="#00B0EF">
                <animate attributeName="r" values="0;${dimensions / 2}" dur="${duration}s" fill="freeze" />
              </circle>
            </svg>`
}

function generateCross() {
  const dimensions = 80;
  const color = '#FFC000';
  const duration = 0.2;
  const strokeWidth = 10;

  return `<svg width="${dimensions}" height="${dimensions}">
    <line x1="0" y1="0" x2="${dimensions}" y2="${dimensions}" stroke="${color}" stroke-width="${strokeWidth}">
      <animate attributeName="x2" values="0;${dimensions}" dur="${duration}s" fill="freeze" />
      <animate attributeName="y2" values="0;${dimensions}" dur="${duration}s" fill="freeze" />
    </line>
    <line x1="${dimensions}" y1="0" x2="0" y2="${dimensions}" stroke="${color}" stroke-width="${strokeWidth}">
      <animate attributeName="x2" values="${dimensions};0" dur="${duration}s" fill="freeze" />
      <animate attributeName="y2" values="0;${dimensions}" dur="${duration}s" fill="freeze" />
    </line>
  </svg>`
}

//---------------------------------------------------//
//-------------------checks if won-------------------//
//---------------------------------------------------//

function checkWin() {
  const winningCombinations = [
    // Horizontale Reihen
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Vertikale Reihen
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Diagonale Reihen
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (
      fields[a] !== null &&
      fields[a] === fields[b] &&
      fields[a] === fields[c]
    ) {
      return combination;
    }
  }

  return null;
}

//--------------------------------------------------//
//---------------draw the winningline---------------//
//--------------------------------------------------//

function drawWinningLine(combination) {
  const lineColor = '#FF0000';
  const lineWidth = 5;

  const table = document.querySelector('table');
  const tableRect = table.getBoundingClientRect();

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', tableRect.width.toString());
  svg.setAttribute('height', tableRect.height.toString());
  svg.style.position = 'absolute';
  svg.style.top = tableRect.top.toString() + 'px';
  svg.style.left = tableRect.left.toString() + 'px';

  const [a, b, c] = combination;

  const cellSize = tableRect.width / 3;
  const x1 = (a % 3) * cellSize + cellSize / 2;
  const y1 = Math.floor(a / 3) * cellSize + cellSize / 2;
  const x2 = (c % 3) * cellSize + cellSize / 2;
  const y2 = Math.floor(c / 3) * cellSize + cellSize / 2;

  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', x1.toString());
  line.setAttribute('y1', y1.toString());
  line.setAttribute('x2', x2.toString());
  line.setAttribute('y2', y2.toString());
  line.setAttribute('stroke', lineColor);
  line.setAttribute('stroke-width', lineWidth.toString());

  svg.appendChild(line);
  document.body.appendChild(svg);
}

//--------------------------------------------------//
//--------------generate Playersymbols--------------//
//--------------------------------------------------//

function showPlayer(id) {
  const generateSymbol = document.getElementById(id);
  if (id === 'circle') {
    generateSymbol.innerHTML = generateCircle();
  } else {
    generateSymbol.innerHTML = generateCross();
  }
}

//-------------------------------------------------//
//--------------animate currentplayer--------------//
//-------------------------------------------------//

function schowCurrentplay() {
  document.getElementById('cross').classList.remove('symbol-active');
  document.getElementById('circle').classList.remove('symbol-active');
  document.getElementById(currentplayer).classList.add('symbol-active');
}

function restartGame() {
  location.reload();
}

//-------------------------------------------------//
//-----------------show the winner-----------------//
//-------------------------------------------------//

function renderEndscreen(winner) {
  endscreen = document.getElementById('endscreen');
  if (winner === 'circle' || winner === 'cross') {
    if (winner === 'circle') {
      document.getElementById('cross').classList.add('d-none')
    } else if (winner === 'cross') {
      document.getElementById('circle').classList.add('d-none')
    }
    currentplayer = winner;
    endscreen.innerHTML = `<h2>Gewnonnen!</h2>`
  } else {
    document.getElementById('cross').classList.add('symbol-active');
    document.getElementById('circle').classList.add('symbol-active');
    endscreen.innerHTML = `<h2>Unentschieden!</h2>`
  }
}