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

// let numberOfLines = 0;
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
  while (true) {
    let depositAmount = prompt("Enter a deposit amount: ");
    let numberDepositAmount = parseFloat(depositAmount);
    if (numberDepositAmount > 0) {
      document.getElementById("balance").innerHTML = numberDepositAmount;
      isDeposited = true;
      return;
    } else {
      alert("Invalid deposit amount, try again !");
    }
  }
}

function clearMultipliers() {
  let multSymbol = document.getElementsByClassName("multiply-symbol");
  let multiplierValue = document.getElementsByClassName("multiply-val");
  let multiplyBet = document.getElementsByClassName("multiply-bet");
  for (let i = 0; i < 3; i++) {
    multSymbol[i].innerText = "";
    multiplierValue[i].innerText = "";
    multiplyBet[i].innerText = "";
  }
}

function getBet() {
  let balance = parseInt(document.getElementById("balance").innerText);
  clearMultipliers();
  if (!isDeposited) {
    alert("Deposit some money first !");
  } else {
    while (true) {
      let bet = prompt("Enter the bet per line: ");
      numberBet = parseInt(bet);
      if (numberBet > 0 && numberBet <= balance) {
        document.getElementById("bet-value").innerText = numberBet;
        balance -= numberBet;
        document.getElementById("balance").innerText = balance;
        isBetEntered = true;
        return;
      } else {
        alert("Invalid Bet, try again !");
      }
    }
  }
}
// symbols = [A, A, B, B, B, B.....]
function spin() {
  const symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }
  //Each nested array is column here
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

//Reels matrix needs to be transposed
function transpose(reels) {
  const rows = [];
  let count = 0;
  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLS; j++) {
      rows[i].push(reels[j][i]);
    }
  }
  return rows;
}

function mapRows(rows) {
  let boxSymbol = document.getElementsByClassName("box-symbol");
  let count = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      boxSymbol[count++].innerText = rows[i][j];
    }
  }
}

function mapRowsWin(symbolRows) {
  let multSymbol = document.getElementsByClassName("multiply-symbol");
  let multiplierValue = document.getElementsByClassName("multiply-val");
  let multiplyBet = document.getElementsByClassName("multiply-bet");
  for (let i = 1; i < symbolRows.length; i += 2) {
    if (i != 1) {
      multSymbol[symbolRows[i - 1]].innerText = "×";
      multiplierValue[symbolRows[i - 1]].innerText =
        SYMBOLS_VALUES[symbolRows[i]];
      multiplyBet[symbolRows[i - 1]].innerText =
        symbolRows[1] * SYMBOLS_VALUES[symbolRows[i]];
    }
  }
}

function getWinnings(rows, bet) {
  let winSymbol = [0, 0];
  let rowsNum = [];
  for (let row = 0; row < 3; row++) {
    const symbols = rows[row];
    let allSame = true;
    for (const symbol of symbols) {
      if (symbol != symbols[0]) {
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
    }, 5);
    if (balance <= 0) {
      setTimeout(() => {
        alert("You ran out of money!\nDeposit amount again");
      }, 10);
    }
  } else {
    alert("1. Deposit some money first\n2. Enter the bet amount");
  }
}

// game();

// function initialDepositAmount() {
//   let balance = prompt("Please enter deposit amount");
//   if (balance > 0) {
//     document.getElementById("balance").innerHTML = balance;
//   }
// }

// while (true) {
//console.log("You have a balance of $" + balance);
//const bet = getBet(balance, numberOfLines);
// document.getElementById("bet-value").innerHTML = bet * numberOfLines;
// balance -= bet * numberOfLines;
// document.getElementById("balance").innerHTML = balance;
// const playAgain = prompt("Do you want to play again (y/n)? ");
// if (playAgain != "y") {
//   break;
// }
// }

// function getNumberOfLines() {
//   while (true) {
//     const lines = prompt("Enter the number of lines to bet on (1-3): ");
//     num = parseFloat(lines);

//     if (isNaN(num) || num <= 0 || num > ROWS) {
//       alert("Invalid no. of lines, try again !");
//     } else {
//       return num;
//     }
//   }
// }
