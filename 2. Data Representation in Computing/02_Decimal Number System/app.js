const digitsList1 = [2, 4, 6, 5];
const digitsList2 = [7, 3, 2];

// const num1 = 2 * 1 + 4 * 10 + 6 * 100 + 5 * 1000;
const num2 = 7 * Math.pow(10, 0) + 3 * Math.pow(10, 1) + 2 * Math.pow(10, 2);

function digitsToNumber(digits) {
 return digits.reduce((acc, curr, index) => acc + curr * Math.pow(10, index), 0);
}
console.log(digitsToNumber(digitsList1));
console.log(digitsToNumber(digitsList2));
