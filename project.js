// 1. Deposit some money
// 2. Determine no. of lines to bet on
// 3. Collect a bet amount
// 4. Spin the slot machine
// 5. Check if the uer won
// 6. Give user their winnings
// 7. Play again
// const prompt = require("prompt-sync")();
const ROWS = 3;
const COLS = 3;

let isDeposited = false;
let isBetEntered = false;

const SYMBOLS_COUNT = {
  A: 9,
  B: 12,
  C: 15,
};

const SYMBOLS_VALUES = {
  A: 8,
  B: 4,
  C: 2,
};

function deposit() {
  if (isDeposited) {
    alert('You already have money to play with!');
    return;
  }

  while (!isDeposited) {
    let depositAmount = prompt("Enter a deposit amount: ");
    let numberDepositAmount = parseFloat(depositAmount);

    if (numberDepositAmount > 0) {
      document.getElementById("balance").innerText = numberDepositAmount;
      isDeposited = true;
      return;
    } else {
      alert("Invalid deposit amount, try again!");
    }
  }
}

function clearMultipliers() {
  // Clear the displayed multipliers on the screen
  let multSymbol = document.getElementsByClassName("multiply-symbol");
  let multiplierValue = document.getElementsByClassName("multiply-val");
  let multiplyBet = document.getElementsByClassName("multiply-bet");

  for (let i = 0; i < multSymbol.length; i++) {
    multSymbol[i].innerText = "";
    multiplierValue[i].innerText = "";
    multiplyBet[i].innerText = "";
  }
}

function getBet() {
  let balance = parseInt(document.getElementById("balance").innerText);
  clearMultipliers();

  if (!isDeposited) {
    alert("Deposit some money first!");
    deposit();
  } else {
    while (true) {
      let bet = prompt("Enter the bet per line: ");
      let numberBet = parseInt(bet);

      if (numberBet > 0 && numberBet <= balance) {
        document.getElementById("bet-value").innerText = numberBet;
        balance -= numberBet;
        document.getElementById("balance").innerText = balance;
        isBetEntered = true;
        return;
      } else {
        alert("Invalid Bet, try again!");
      }
    }
  }
}

function spin() {
  // Generate a matrix of random symbols for the slot machine
  const symbols = [];

  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }

  const reels = [];

  for (let i = 0; i < COLS; i++) {
    reels.push([]);
    const reelSymbols = [...symbols];

    for (let j = 0; j < ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * reelSymbols.length);
      const selectedSymbol = reelSymbols[randomIndex];
      reels[i].push(selectedSymbol);
      reelSymbols.splice(randomIndex, 1);
    }
  }

  return reels;
}

function transpose(reels) {
  // Transpose the matrix of symbols
  const rows = [];

  for (let i = 0; i < ROWS; i++) {
    rows.push([]);

    for (let j = 0; j < COLS; j++) {
      rows[i].push(reels[j][i]);
    }
  }

  return rows;
}

function mapRows(rows) {
  // Display the symbols on the screen
  let boxSymbol = document.getElementsByClassName("box-symbol");
  let count = 0;

  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      boxSymbol[count].innerText = rows[i][j];
      count++;
    }
  }
}

function mapRowsWin(symbolRows) {
  // Display winning multipliers and calculations
  let multSymbol = document.getElementsByClassName("multiply-symbol");
  let multiplierValue = document.getElementsByClassName("multiply-val");
  let multiplyBet = document.getElementsByClassName("multiply-bet");

  for (let i = 3; i < symbolRows.length; i += 2) {
    multSymbol[symbolRows[i - 1]].innerText = "×";
    multiplierValue[symbolRows[i - 1]].innerText =
      SYMBOLS_VALUES[symbolRows[i]];
    multiplyBet[symbolRows[i - 1]].innerText =
      symbolRows[1] * SYMBOLS_VALUES[symbolRows[i]];
  }
}

function getWinnings(rows, bet) {
  // Determine the winnings
  let winSymbol = [0, 0];
  let rowsNum = [];

  for (let row = 0; row < ROWS; row++) {
    const symbols = rows[row];
    let allSame = true;

    for (const symbol of symbols) {
      if (symbol !== symbols[0]) {
        allSame = false;
        break;
      }
    }

    if (allSame) {
      winSymbol[0] += bet * SYMBOLS_VALUES[symbols[0]];
      winSymbol[1] = bet;
      rowsNum.push(row);
      rowsNum.push(symbols[0]);
    }
  }

  let finalArr = winSymbol.concat(rowsNum);
  return finalArr;
}

function game() {
  clearMultipliers();
  let balance = parseInt(document.getElementById("balance").innerText);

  if (isDeposited && isBetEntered) {
    const bet = parseInt(document.getElementById("bet-value").innerText);
    const reels = spin();
    const rows = transpose(reels);
    mapRows(rows);
    const winningsArr = getWinnings(rows, bet);
    mapRowsWin(winningsArr);
    balance += parseInt(winningsArr[0]) + parseInt(winningsArr[1]);
    document.getElementById("balance").innerText = balance;
    document.getElementById("bet-value").innerText = 0;
    isBetEntered = false;

    setTimeout(() => {
      alert("You won " + winningsArr[0].toString());
    }, 20);

    if (balance <= 0) {
      setTimeout(() => {
        alert("You ran out of money!\nDeposit amount again");
      }, 10);
      isDeposited = false;
    }
  } else if (isDeposited) {
    getBet();
  } else {
    alert("1. Deposit some money first\n2. Enter the bet amount");
    deposit();
  }
}

