const fs = require('fs');

fs.readFile('./input.txt', (e, data) => {
  const map = data.toString().split('\n').filter(r => r !== '');
  const orbiters = map.reduce((acc, curr) => {
    const [primary, orbiter] = curr.split(')');
    return {
      ...acc,
      [orbiter]: primary,
    };
  }, {});

  const increaseOrbitsCount = (orbiter) => {
    const primary = orbiters[orbiter];

    if (orbiters[primary]) {
      return 1 + increaseOrbitsCount(primary);
    }

    return 1;
  }

  const orbitsCount = Object.keys(orbiters).reduce((acc, curr) => {
    return acc + increaseOrbitsCount(curr);
  }, 0);

  console.log(orbitsCount);
});
