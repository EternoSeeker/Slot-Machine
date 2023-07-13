// 1. Deposit some money
// 2. Determine no. of lines to bet on
// 3. Collect a bet amount
// 4. Spin the slot machine
// 5. Check if the uer won
// 6. Give user their winnings
// 7. Play again
// const prompt = require("prompt-sync")();

// function initialDepositAmount() {
//   let balance = prompt("Please enter deposit amount");
//   if (balance > 0) {
//     document.getElementById("balance").innerHTML = balance;
//   }
// }

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
  A: 4,
  B: 5,
  C: 6,
  D: 7,
};

const SYMBOLS_VALUES = {
  A: 8,
  B: 6,
  C: 4,
  D: 2,
};

function deposit(){
  while (true) {
    let depositAmount = prompt("Enter a deposit amount: ");
    let numberDepositAmount = parseFloat(depositAmount);

    if (numberDepositAmount > 0) {
      document.getElementById("balance").innerHTML = numberDepositAmount;
      return;
    } else {
      alert("Invalid deposit amount, try again !");
    }
  }
};

function getNumberOfLines(){
  while (true) {
    const lines = prompt("Enter the number of lines to bet on (1-3): ");
    const numberOfLines = parseFloat(lines);

    if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > ROWS) {
      console.log("Invalid no. of lines, try again !");
    } else {
      return numberOfLines;
    }
  }
};

function getBet(balance, lines){
  while (true) {
    //lines = getNumberOfLines();
    let bet = prompt("Enter the bet per line: ");
    let numberBet = parseFloat(bet);

    if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines) {
      console.log("Invalid Bet, try again !");
    } else {
      document.getElementById("bet-value").innerHTML = numberBet * lines;
      return;
    }
  }
};
// symbols = [A, A, B, B, B, B.....]
function spin(){
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
};
//Reels matrix needs to be transposed

function transpose(reels){
  const rows = [];

  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLS; j++) {
      rows[i].push(reels[j][i]);
    }
  }
  return rows;
};

function printRows(rows){
  for (const row of rows) {
    let rowString = "";
    for (const [i, symbol] of row.entries()) {
      rowString += symbol;
      if (i != row.length - 1) {
        rowString += " | ";
      }
    }
    console.log(rowString);
  }
};

function getWinnings(rows, bet, lines){
  let winningsArr = [0, 0, 0];
  for (let row = 0; row < lines; row++) {
    const symbols = rows[row];
    let allSame = true;
    for (const symbol of symbols) {
      if (symbol != symbols[0]) {
        allSame = false;
        break;
      }
    }
    if (allSame) {
      winningsArr[0] += bet * SYMBOLS_VALUES[symbols[0]];
      winningsArr[1] = SYMBOLS_VALUES[symbols[0]];
      winningsArr[2] = row;
    }
  }
  return winningsArr;
};

function game(){
  let balance = deposit();
  document.getElementById("balance").innerHTML = balance;

  while (true) {
    console.log("You have a balance of $" + balance);
    const numberOfLines = getNumberOfLines();
    const bet = getBet(balance, numberOfLines);
    balance -= bet * numberOfLines;
    const reels = spin();
    const rows = transpose(reels);
    printRows(rows);
    const winningsArr = getWinnings(rows, bet, numberOfLines);
    balance += winningsArr[0];
    document.getElementById("balance").innerHTML = balance;
    //console.log("You won, $" + winnings.toString());
    if (balance <= 0) {
      alert("You ran out of money!");
      break;
    }
    // const playAgain = prompt("Do you want to play again (y/n)? ");

    // if (playAgain != "y") {
    //   break;
    // }
  }
};

// game();
