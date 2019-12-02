const fs = require('fs');

fs.readFile('./input.txt', (e, data) => {
  const fuelNeeded = (mass) => {
    const result = Math.floor(mass / 3) - 2;

    if (result >= 0) {
      return result + Math.max(fuelNeeded(result), 0);
    }

    return result;
  };

  const result = data.toString()
    .split('\n')
    .map(line => parseInt(line, 10))
    .filter(weight => !isNaN(weight))
    .map(weight => fuelNeeded(weight))
    .reduce((a, b) => a + b);
  
  console.log(`Fuel needed to transport all modules: ${result}`);
});
