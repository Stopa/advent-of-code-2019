const fs = require('fs');
const rl = require('readline-sync');

const runIntcode = (
  ops,
  input = () => parseInt(rl.question('Input operation: '), 10),
  output = (value) => console.log(`Output operation: ${value}`),
) => {
  let instructionPointer = 0;
  
  const param = (index) => {
    const op = ops[instructionPointer];

    modes = op.toString().split('').reverse().slice(2);

    const mode = parseInt(modes[index]);

    let value;

    switch (mode) {
      case 1: // immediate mode
        value = ops[instructionPointer + index + 1];
        break;
      default: // 0 - position mode
        value = ops[ops[instructionPointer + index + 1]];
        break;
    }

    return value;
  }

  loop: while(true) {
    const op = parseInt(ops[instructionPointer].toString().substr(-2), 10);

    switch (op) {
      case 1: { // add
        const v1 = param(0);
        const v2 = param(1);
        const resultIndex = ops[instructionPointer + 3];
        ops[resultIndex] = v1 + v2;
        instructionPointer += 4;
        break;
      }
      case 2: { // multiply
        const v1 = param(0);
        const v2 = param(1);
        const resultIndex = ops[instructionPointer + 3];
        ops[resultIndex] = v1 * v2;
        instructionPointer += 4;
        break;
      }
      case 3: { // input
        const resultIndex = ops[instructionPointer + 1];
        ops[resultIndex] = input();
        instructionPointer += 2;
        break;
      }
      case 4: { // output
        const v1 = param(0);
        output(v1);
        instructionPointer += 2;
        break;
      }
      case 5: { // jump-if-true
        const v1 = param(0);
        const v2 = param(1);
        if (v1 !== 0) {
          instructionPointer = v2;
        } else {
          instructionPointer += 3;
        }
        break;
      }
      case 6: { // jump-if-false
        const v1 = param(0);
        const v2 = param(1);
        if (v1 === 0) {
          instructionPointer = v2;
        } else {
          instructionPointer += 3;
        }
        break;
      }
      case 7: { // less than
        const v1 = param(0);
        const v2 = param(1);
        const resultIndex = ops[instructionPointer + 3];
        if (v1 < v2) {
          ops[resultIndex] = 1;
        } else {
          ops[resultIndex] = 0;
        }
        instructionPointer += 4;
        break;
      }
      case 8: { // equals
        const v1 = param(0);
        const v2 = param(1);
        const resultIndex = ops[instructionPointer + 3];
        if (v1 === v2) {
          ops[resultIndex] = 1;
        } else {
          ops[resultIndex] = 0;
        }
        instructionPointer += 4;
        break;
      }
      case 99:
        break loop;
      default:
        throw new Error(`Unknown opcode: ${op}`);
    }
  }

  return ops;
};

fs.readFile('./input.txt', (e, data) => {
  const program = data.toString()
    .split(',')
    .map(op => parseInt(op, 10));

  const phases = [0,1,2,3,4];

  var permArr = [],
    usedChars = [];
  function permute(input) {
    var i, ch;
    for (i = 0; i < input.length; i++) {
      ch = input.splice(i, 1)[0];
      usedChars.push(ch);
      if (input.length == 0) {
        permArr.push(usedChars.slice());
      }
      permute(input);
      input.splice(i, 0, ch);
      usedChars.pop();
    }
    return permArr
  };

  const phasePermutations = permute(phases);
  let maxValue = 0;

  phasePermutations.forEach((permutation) => {
    const vars = [...permutation];
    vars.splice(1, 0, 0); // input of first amplifier set to 0

    const input = () => {
      return vars.shift();
    };

    const intermediaryOutput = (value) => vars.splice(1, 0, value); // input of next amp

    const finalOutput = (value) => maxValue = Math.max(maxValue, value)

    permutation.map((_, index, array) => {
      runIntcode([...program], input, index === array.length - 1 ? finalOutput : intermediaryOutput);
    });
  });

  console.log(maxValue);
});
