'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// Display Movements
const displayMovements = function (movements,sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a,b) => a - b ) : movements;
   
  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov}€</div>
        </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Calculate total balance

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = `${acc.balance}€`;
};

// Calculate total balance code End

// Calculate Summary
const calcDisplaySummary = function (acc) {
  // Income deposit
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov);

  labelSumIn.textContent = `${income}€`;

  // Out Credit
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov);

  labelSumOut.textContent = `${Math.abs(out)}€`;

  // Interest

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${interest}€`;
};
// Show Username
const createUernames = function (accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUernames(accounts);
// console.log(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);

  // Display Balance
  calcDisplayBalance(acc);

  //Display Summary
  calcDisplaySummary(acc);
};

//Event Listner
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back ,${
      currentAccount.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = 100;

    // Clear input fields

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //UpdateUI
    updateUI(currentAccount);
  }
});
//  js  1111
//  jd  2222
//  stw 3333
//  ss  4444

// Transfer Amount

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    //Doing transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    console.log('transfer valid');
    //UpdateUI
    updateUI(currentAccount);
  }
  console.log(amount, receiverAcc);
});

btnLoan.addEventListener('click',function (e) {
  e.preventDefault();
  console.log("LOAN");
  const amount = Number(inputLoanAmount.value);
  if(amount > 0 && currentAccount.movements.some(mov => mov >=amount * 0.1)){
    
    // add movements
    currentAccount.movements.push(amount)

    //update UI
    updateUI(currentAccount)
  }
  inputLoanAmount.value =""; 
})

btnClose.addEventListener('click',function(e){
  e.preventDefault();
  // console.log("delete");
  
  if( inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin ){
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    // console.log(index);
    // Delete Account
    accounts.splice(index,1);

    // Hide UI
    containerApp.style.opacity =0;
  }
  inputCloseUsername.value = inputClosePin.value = ''
  
}
)
let sorted = false;
btnSort.addEventListener('click',function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements,!sorted);
  sorted = !sorted;  
})
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
// let arr = ["a","b","c","d","e"];

// Slice method
// console.log(arr.slice(2))
// console.log(arr.slice(2,4))
// console.log(arr.slice(-2))
// console.log(arr.slice(-1)) //-1 return the last element
// console.log(arr.slice(1,-1))

// Splice method
// console.log(arr.splice(2));
// console.log(arr.splice(-1)); // -1 return the last element
// console.log(arr);

// Reverse
// arr = ["a","b","c","d","e"];
// const arr2 = ["j","i","h","g","f"];
// console.log(arr2.reverse());
// console.log(arr2);// reverse mutates the original array

// CONCAT

// const letters = arr.concat(arr2)
// console.log(letters);

// JOIN

// console.log(letters.join(' - '));
// console.log(letters.join());

// const arr1 =[23,11,64];
// console.log(arr[0]);
// console.log(arr.at(0));

// console.log(arr1[arr1.length-1]);
// console.log(arr1.slice(-1)[0]);
// console.log(arr1.at(-1));

// console.log('jonas'.at(0));

// Positive value deposit
// Negative Value credit
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const movement of movements) {
//   if(movement > 0){
//     console.log(`You Deposted ${movement}`);
//   }
//   else{
//     console.log(`You Withdrew ${Math.abs(movement) }`);
//   }

// }

// for (const [i,movement] of movements.entries()) {
//   if(movement > 0){
//     console.log(`Movement${i + 1} : You Deposted ${movement}`);
//   }
//   else{
//     console.log(`Movement${i + 1} : You Withdrew ${Math.abs(movement) }`);
//   }

// }

// movements.forEach( movement => {
//   if(movement > 0){
//     console.log(`You Deposted ${movement}`);
//   }
//   else{
//     console.log(`You Withdrew ${Math.abs(movement) }`);
//   }
// });

// movements.forEach( (mov,i) => {
//   if(mov > 0){
//     console.log(`Movement${i + 1} : You Deposted ${mov}`);
//   }
//   else{
//     console.log(`Movement${i + 1} : You Withdrew ${Math.abs(mov) }`);
//   }
// });

// Map
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach( (curr,i,Map) => {
//   console.log(`Index ${i} : Currency ${curr}`);

// });

// Sets => SET contain unique values
// const currenciesUnique = new Set (["USD","EUR","GBP","EUR","GBP","USD"]);

// currenciesUnique.forEach( (curr,i) => {
//   console.log(`Key ${i} : Value ${curr}`);

// });

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const euroUsd =1.3;

// const movementUsd = movements.map(function (mov) {
//   return mov * euroUsd

// })
// console.log(movements);
// console.log(movementUsd);

// const movementUSDfor = [];

// for (const mov of movements) {
//   movementUSDfor.push(mov * euroUsd);

// }
// console.log(movementUSDfor);

// const movementsDescription=movements.map((mov,i,arr)=> {
//   if(mov > 0){
//         return `Movement${i + 1} : You Deposted ${mov}`;
//       }
//       else{
//         return`Movement${i + 1} : You Withdrew ${Math.abs(mov) }`;
// }
// }
// )

// console.log(movementsDescription);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const deposit=movements.filter((mov)=>{
//   return mov > 0;

// })

// console.log(deposit)

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// // accumulator is like snowball
// const balance = movements.reduce( ( acc,cur,i,arr) => {
//   console.log(`Iteration ${i} : ${acc}`)
//   return acc + cur;
// },0)

// console.log(balance);

// Maximum value

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const Maximum =movements.reduce( (acc , mov)=>{
//   if (acc > mov){
//     return acc
//   }
//   else{
//     return mov;
//   }
// },movements[0]);
// console.log(Maximum);

//  Find method

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const firstWithdawal= movements.find(mov => mov < 0);

// console.log(movements);
// console.log(firstWithdawal);

// console.log(accounts);

// const account = accounts.find(acc =>{
//  return acc.owner === "Jessica Davis";
// })

// console.log(account);
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// Equality
// console.log(movements);
// console.log(movements.includes(-130));

// SOME : Condition
// console.log(movements.some(mov => mov === -130))
// const anyDeposits=movements.some(mov => mov > 1500)

// console.log(anyDeposits);


// EVERY
console.log(movements.every(mov => mov > 0))
console.log(account4.movements.every(mov => mov > 0));

// Separate Callback

const deposit = mov => mov > 0;
console.log(movements.some(deposit));