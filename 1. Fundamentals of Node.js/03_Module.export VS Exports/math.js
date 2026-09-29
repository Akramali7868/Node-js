function product(...nums) {
  return nums.reduce((curr, acc) => curr * acc);
}
function sum(...nums) {
  return nums.reduce((curr, acc) => curr + acc);
}

module.exports = {
  sum,
  product,
};


console.log(module.exports === exports);
