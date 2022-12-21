import { DAC } from '@laser-dac/core';
import { Simulator } from '@laser-dac/simulator';
import { Scene, Line } from '@laser-dac/draw';
import { Helios } from '../../packages/helios/dist';

// frame dependent color

(async () => {
  const dac = new DAC();
  dac.use(new Simulator());
  dac.use(new Helios());
  await dac.start();

  const scene = new Scene({
    resolution: 100,
  });

  let frame = 0;

  function renderFrame() {
    const bounds = new Line({
      from: { x: 0, y: 0 },
      to: { x: 1, y: 1 },
      color: [
        frame % 20 == 0 ? 1 : 0,
        frame % 10 == 0 ? 1 : 0,
        frame % 5 == 0 ? 1 : 0,
      ],
    });
    frame += 1;
    scene.add(bounds);
  }

  scene.start(renderFrame);
  dac.stream(scene);
})();
