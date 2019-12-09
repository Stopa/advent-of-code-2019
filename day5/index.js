const fs = require('fs');
const rl = require('readline-sync');

const runIntcode = (ops) => {
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
        ops[resultIndex] = parseInt(rl.question('Input operation: '), 10);
        instructionPointer += 2;
        break;
      }
      case 4: { // output
        const v1 = param(0);
        console.log(`Output operation: ${v1}`);
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

  const result = runIntcode(program);
});
