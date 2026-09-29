const octalNum1 = 0o12;
const octalNum2 = 0o237;
const octalNum3 = 0o4527;

console.log(octalNum1);
console.log(octalNum2);
console.log(octalNum3);

const octalNum4 = 0o237

function digitsToNumber(digits, radix = 10) {
  return digits.reduce((acc, curr, index) => acc + curr * Math.pow(radix, index), 0);
}

console.log(octalNum4);