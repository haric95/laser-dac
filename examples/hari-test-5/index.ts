import { DAC } from '@laser-dac/core';
import { Simulator } from '@laser-dac/simulator';
import { Scene, Path } from '@laser-dac/draw';
import { Helios } from '../../packages/helios/dist';

// svg curves

type Point = { x: number; y: number };

(async () => {
  const dac = new DAC();
  dac.use(new Simulator());
  dac.use(new Helios());
  await dac.start();

  const scene = new Scene({
    resolution: 50,
  });

  // let frame = 0;

  function renderFrame() {
    const points: Point[] = [];

    for (let i = 0; i < 2; i++) {
      points.push({ x: Math.random() * 100, y: Math.random() * 100 });
    }

    const linez = new Path({
      path: `M 0 0 C 0 100 100 100 100 0`,
      color: [1, 0, 0],
      width: 100,
      height: 100,
    });
    scene.add(linez);
    // frame += 1;
  }

  scene.start(renderFrame);
  dac.stream(scene);
})();
