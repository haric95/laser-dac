import { DAC } from '@laser-dac/core';
import { Simulator } from '@laser-dac/simulator';
import { Scene, Circle } from '@laser-dac/draw';
import { Helios } from '../../packages/helios/dist';

// circles oscillating radius

(async () => {
  const dac = new DAC();
  dac.use(new Simulator());
  dac.use(new Helios());
  await dac.start();

  const scene = new Scene({
    resolution: 100,
  });

  let lastTime = Date.now();
  function renderFrame() {
    const curTime = Date.now();
    const timeStep = (curTime - lastTime) / 1000;
    const col1 = (Math.sin(timeStep) + 1) / 2;
    const col2 = (Math.cos(timeStep) + 1) / 2;
    const radius = (Math.sin(timeStep) + 1) / 4;
    const bounds = new Circle({
      x: 0.5,
      y: 0.5,
      radius,
      color: [col1, col2, 0],
    });
    scene.add(bounds);
  }

  scene.start(renderFrame);
  dac.stream(scene);
})();
