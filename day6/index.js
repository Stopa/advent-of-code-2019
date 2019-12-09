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

  const walkTo = (obj, target = 'COM') => {
    const result = [obj];
    if (orbiters[obj] === target) {
      return result;
    }


    return [
      ...result,
      ...walkTo(orbiters[obj], target),
    ];
  }

  const pathFromYOU = walkTo(orbiters['YOU']).reverse();
  const pathFromSAN = walkTo(orbiters['SAN']).reverse();
  let lastCommon;

  for (let i = 0; i < pathFromYOU.length; i++) {
    if (pathFromYOU[i] !== pathFromSAN[i]) {
      break;
    }

    lastCommon = pathFromYOU[i];
  }
  
  const pathLengthFromYOU = walkTo(orbiters['YOU'], lastCommon).length;
  const pathLengthFromSAN = walkTo(orbiters['SAN'], lastCommon).length;
  console.log(pathLengthFromSAN + pathLengthFromYOU);
});
