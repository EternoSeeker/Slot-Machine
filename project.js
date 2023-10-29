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

// const COLOR_VALUES = {
//   A: "a",
//   B: "b",
//   C: "c",
// }

//alert function
 window.alert=function(msg){
  const alert=document.createElement('div')
  const alertBtn=document.createElement('button');
  alertBtn.innerHTML="Ok"
  alert.setAttribute('style',`
      position:absolute;
      top:5rem;
      padding:2rem;
      color:black;
      border-radius:1rem;
      box-shadow:2px 2px 6px rgba(0,0,0,0.3);
      background:#fff;
      display:flex;
      align-items:center;
      flex-direction:column;
      
  `)
  alertBtn.setAttribute('style',`
      margin-top:2rem ;
      height:2rem;
      width:6rem;
      background:#58acf5;
      color:#fff;
      border:none;
      cursor:pointer;

  `)
  alert.innerHTML=`<span>${msg}</span>`
  alert.appendChild(alertBtn)
  alertBtn.addEventListener("click",(e)=>{
    alert.remove();
  })
  let alertContainer=document.createElement('section')
  alertContainer.setAttribute('style',`
       width:100%;
       display:flex;
       justify-content:center;
  `)
  alertContainer.appendChild(alert)
  document.body.appendChild(alertContainer)

 }
//-----(end of alert func)--------
function removePrompt(){
  let promptSec=document.querySelector('.prompt_sec')
  promptSec.style.display="none"
}
let Btnflag=true;

function showPrompt(data){
  let promptSec=document.querySelector('.prompt_sec')
  promptSec.style.display="flex"
  if(data==="deposit_amount"){
      document.querySelector('.prompt_h2').innerHTML="Enter deposit amount"
  }else{
    document.querySelector('.prompt_h2').innerHTML="Enter bet amount"
    Btnflag=false;
    // document.querySelector('.money_inp').vlaue=" ";
  }
}


function storeData(){
  let promptSec=document.querySelector('.prompt_sec')
  if(Btnflag){
    let depositAmount=document.querySelector('.money_inp').value;
    let  numberDepositAmount=parseFloat(depositAmount)

    if (numberDepositAmount> 0) {
      document.getElementById("balance").innerHTML = numberDepositAmount;
      isDeposited = true;
  
      document.querySelector('.money_inp').value=" ";
      promptSec.style.display="none"
      
    } else {
      alert("Invalid deposit amount, try again !");
    }
  }
  else{
    let betAmount=document.querySelector('.money_inp').value;
      let numberBet = parseInt(betAmount);
      
      
      let balance= document.getElementById("balance").innerHTML
      console.log(balance)
      if (numberBet > 0 && numberBet <= balance) {
        document.getElementById("bet-value").innerText = numberBet;
        balance -= numberBet;
        document.getElementById("balance").innerText = balance;
        isBetEntered = true;
        promptSec.style.display="none"
      
      } else {
        promptSec.style.display="none"
        alert("Invalid Bet, try again !");
      }
    
  
  }
}

// prompt function


//------end of(propmpt)------
function deposit(data) {
  if(isDeposited){
    alert('You already have money to play with !');
  }
  else{
    showPrompt(data)
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

function getBet(data) {
  let balance = parseInt(document.getElementById("balance").innerText);
  clearMultipliers();
  if (!isDeposited) {
    alert("Deposit some money first !");
    deposit("deposit_amount");
  } else {
    showPrompt(data)
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
      boxSymbol[count].innerText = rows[i][j];
      //boxSymbol[count].classList.add(COLOR_VALUES(rows[i][j]));
      count++;
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
  //clearClasses();
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
      isDeposited=false;
    }
  }
  else if(isDeposited){
    getBet();
  } 
  else {
    alert("1. Deposit some money first\n2. Enter the bet amount");
    deposit();
  }
}

// game();

// function clearClasses(){
//   let boxSymbol = document.getElementsByClassName("box-symbol");
//   for (let i = 0; i < 9; i++) {
//     let letter = boxSymbol[i].innerText;
//     boxSymbol[i].classList.remove(COLOR_VALUES(letter));
//   }
// }

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
