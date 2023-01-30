import { DAC } from '@laser-dac/core';
import { Simulator } from '@laser-dac/simulator';
import { Scene, Path } from '@laser-dac/draw';
import { Helios } from '../../packages/helios/dist';

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
    const frameMod = frame % 50;
    const linez = new Path({
      path: `M ${frameMod} ${frame % 4 === 0 ? 0 : 50} L ${frameMod} ${
        frame % 4 === 2 ? 50 : 100
      }`,
      color: [0.5, 0, 0],
      width: 100,
      height: 100,
    });
    scene.add(linez);
    frame += 1;
  }

  scene.start(renderFrame);
  dac.stream(scene);
})();
