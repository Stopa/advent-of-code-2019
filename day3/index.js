const fs = require('fs');

const walkPath = (path, step = () => {}) => {
  let lastCoords = {x: 0, y: 0};

  const ops = {
    'R': coords => ({...coords, x: coords.x + 1}),
    'L': coords => ({...coords, x: coords.x - 1}),
    'U': coords => ({...coords, y: coords.y - 1}),
    'D': coords => ({...coords, y: coords.y + 1}),
  };

  path.forEach(({direction, distance}) => {
    for (let i = 0; i < distance; i++) {
      lastCoords = ops[direction](lastCoords);
      step(lastCoords);
    }
  });
}

const manhattanDistance = (p1, p2 = {x:0, y:0}) => Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);

fs.readFile('./input.txt', (e, data) => {
  const wires = data.toString()
    .split('\n')
    .filter(l => l != '')
    .map(line => line.split(',').map(instruction => ({
      direction: instruction.substring(0, 1),
      distance: parseInt(instruction.substr(1), 10),
    })));
  const firstWirePath = {};
  const collisions = [];
  
  walkPath(wires[0], (coords) => firstWirePath[JSON.stringify(coords)] = true);

  walkPath(wires[1], (coords) => {
    if (firstWirePath[JSON.stringify(coords)]) {
      collisions.push(coords);
    }
  });

  console.log(collisions.map(c => manhattanDistance(c)).sort((a, b) => a - b)[0]);
});
