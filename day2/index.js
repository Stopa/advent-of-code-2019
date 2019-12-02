const fs = require('fs');

const runIntcode = (ops) => {
  let instructionPointer = 0;
  loop: while(true) {
    const op = ops[instructionPointer];
    const v1 = ops[ops[instructionPointer + 1]];
    const v2 = ops[ops[instructionPointer + 2]];
    const resultIndex = ops[instructionPointer + 3];

    instructionPointer = instructionPointer + 4;

    switch (op) {
      case 1:
        ops[resultIndex] = v1 + v2;
        break;
      case 2:
        ops[resultIndex] = v1 * v2;
        break;
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
  const desiredOutput = 19690720;

  for (let noun = 0; noun <= 99; noun++) {
    for (let verb = 0; verb <= 99; verb++) {
      const ops = [...program];
      ops[1] = noun;
      ops[2] = verb;

      const result = runIntcode(ops);

      if (result[0] === desiredOutput) {
        console.log(`Noun: ${noun}; verb: ${verb}; result: ${100 * noun * verb}`);
        return;
      }
    }
  }
});
