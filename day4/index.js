const min = 178416;
const max = 676461;
let num = 0;

outer: for (let pw = min; pw <= max; pw++) {
  const digits = pw.toString().split('');
  let pair = false;

  for (let i = 1; i < digits.length; i++) {
    const digit = parseInt(digits[i], 10);
    const lastDigit = parseInt(digits[i - 1], 10);

    if (digit < lastDigit) {
      continue outer;
    }

    if (digits.filter(d => parseInt(d, 10) === digit).length === 2) {
      pair = true;
    }
  }

  if (pair) {
    num++;
  }
}

console.log(num);
