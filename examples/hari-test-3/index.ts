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
    resolution: 600,
  });

  const pathMap = {
    0: 'M 574.2 105 L 167.4 7.5 L 516.6 105 L 381.6 128 L 349.2 107 L 350.1 150 L 574.2 105',
    1: 'M 574.2 105 L 167.4 7.5 L 516.6 105 L 381.6 128 L 349.2 107 L 350.1 150 L 574.2 105',
    2: 'M 389.7 90 L 329.4 91.5 L 406.8 103 L 389.7 90',
    3: 'M 389.7 90 L 329.4 91.5 L 406.8 103 L 389.7 90',
    4: 'M 279 66.5 L 250.2 66 L 222.3 129.5 L 273.6 143 L 288.9 117.5 L 301.5 149 L 320.4 149 L 279 66.5',
    5: 'M 279 66.5 L 250.2 66 L 222.3 129.5 L 273.6 143 L 288.9 117.5 L 301.5 149 L 320.4 149 L 279 66.5',
    6: 'M 278.1 54.5 L 275.4 42.5 L 262.8 39.5 L 258.3 50 L 278.1 54.5',
    7: 'M 278.1 54.5 L 275.4 42.5 L 262.8 39.5 L 258.3 50 L 278.1 54.5',
    8: 'M 333 64.5 L 183.6 38.5 L 177.3 17 L 172.8 37 L 66.6 19 L 113.4 50.5 L 178.2 55 L 177.3 158.5 L 212.4 125 L 188.1 55.5 L 333 64.5',
    9: 'M 333 64.5 L 183.6 38.5 L 177.3 17 L 172.8 37 L 66.6 19 L 113.4 50.5 L 178.2 55 L 177.3 158.5 L 212.4 125 L 188.1 55.5 L 333 64.5',
    10: 'M 162.9 55.5 L 45.9 82 L 124.2 82 L 18 103 L 108 103.5 L 1.8 125.5 L 126 125.5 L 162.9 55',
    11: 'M 162.9 55.5 L 45.9 82 L 124.2 82 L 18 103 L 108 103.5 L 1.8 125.5 L 126 125.5 L 162.9 55',
  };

  let frame = 0;

  function renderFrame() {
    const pathSelection = (frame % 12) as keyof typeof pathMap;
    const gateLogo1 = new Path({
      path: pathMap[pathSelection],
      color: [1, 0, 0],
      width: 662,
      height: 662,
    });
    scene.add(gateLogo1);
    frame += 1;
  }

  scene.start(renderFrame);
  dac.stream(scene);
})();
