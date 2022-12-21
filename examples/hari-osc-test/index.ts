import { DAC } from '@laser-dac/core';
import { Simulator } from '@laser-dac/simulator';
import { Scene, Line } from '@laser-dac/draw';
import { Helios } from '../../packages/helios/dist';
import { read, intToRGBA } from 'jimp';

(async () => {
  const dac = new DAC();
  dac.use(new Simulator());
  dac.use(new Helios());
  await dac.start();

  const numCols = 25;

  const columns: number[][] = [];

  read('http://127.0.0.1:8081/porn-1_small.png', (err, img) => {
    if (img) {
      for (let i = 0; i < 25; i++) {
        const row: number[] = [];
        for (let j = 0; j < 25; j++) {
          // Just geting r value for now cos flesh innit
          const brightness = intToRGBA(img.getPixelColor(i, i)).r;
          row.push(brightness);
        }
        columns.push(row);
      }
    }
  });

  const scene = new Scene({
    resolution: numCols,
  });

  let frame = 0;

  function renderFrame() {
    const colIndex = frame % numCols;
    // const column = columns[colIndex];

    // const numRows = 2;

    const line1 = new Line({
      from: { x: colIndex / numCols, y: 0 },
      to: { x: colIndex / numCols, y: 0.1 },
      color: [1, 0, 0],
    });
    const line2 = new Line({
      from: { x: colIndex / numCols, y: 0.1 },
      to: { x: colIndex / numCols, y: 0.9 },
      color: [0, 0, 0],
    });
    const line3 = new Line({
      from: { x: colIndex / numCols, y: 0.9 },
      to: { x: colIndex / numCols, y: 1 },
      color: [0, 0, 1],
    });
    scene.add(line1);
    scene.add(line2);
    scene.add(line3);

    // for (let row = 0; row < numRows; row++) {
    //   // const columnAdder = column[row] / 255 / 4;
    //   const line = new Line({
    //     from: { x: (colIndex * 4) / 100, y: row / numRows },
    //     to: { x: (colIndex * 4) / 100, y: row / numRows + 1 / numRows },
    //     color: [row === 0 ? 1 : 0, row === 0 ? 0 : 1, 0],
    //   });
    //   scene.add(line);
    // }

    // for (let row = 0; row < 25; row++) {
    //   const line = new Line({
    //     from: { x: (colIndex * 4) / 100, y: (row * 4) / 100 },
    //     to: { x: (colIndex * 4) / 100, y: ((row * 4) / 100) % 1 },
    //     color: [column[row], 0, 0],
    //   });
    //   scene.add(line);
    // }
    frame += 1;
  }

  scene.start(renderFrame);
  dac.stream(scene);
})();
