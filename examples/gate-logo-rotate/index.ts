import { DAC } from '@laser-dac/core';
import { Simulator } from '@laser-dac/simulator';
import { Scene, Path, Timeline } from '@laser-dac/draw';
import { Helios } from '../../packages/helios/dist';

// Path map

(async () => {
  const dac = new DAC();
  dac.use(new Simulator());
  dac.use(new Helios());
  await dac.start();

  const scene = new Scene({
    resolution: 600,
  });

  const pathMapPoints = {
    0: [
      [574.2, 105],
      [167.4, 7.5],
      [516.6, 105],
      [381.6, 128],
      [349.2, 107],
      [350.1, 150],
      [574.2, 105],
    ],
    1: [
      [389.7, 90],
      [329.4, 91.5],
      [406.8, 103],
      [389.7, 90],
    ],
    2: [
      [279, 66.5],
      [250.2, 66],
      [222.3, 129.5],
      [273.6, 143],
      [288.9, 117.5],
      [301.5, 149],
      [320.4, 149],
      [279, 66.5],
    ],
    3: [
      [278.1, 54.5],
      [275.4, 42.5],
      [262.8, 39.5],
      [258.3, 50],
      [278.1, 54.5],
    ],
    4: [
      [333, 64.5],
      [183.6, 38.5],
      [177.3, 17],
      [172.8, 37],
      [66.6, 19],
      [113.4, 50.5],
      [178.2, 55],
      [177.3, 158.5],
      [212.4, 125],
      [188.1, 55.5],
      [333, 64.5],
    ],
    5: [
      [162.9, 55.5],
      [45.9, 82],
      [124.2, 82],
      [18, 103],
      [108, 103.5],
      [1.8, 125.5],
      [126, 125.5],
      [162.9, 55],
    ],
  };

  let frame = 0;

  function renderFrame() {
    const pathSelectionIndex = (frame % 6) as keyof typeof pathMapPoints;
    const pathPoints = pathMapPoints[pathSelectionIndex];

    const path = `M ${[pathPoints[0][0]]} ${[pathPoints[0][0]]} ${pathPoints
      .map((points, index) =>
        index === 0 ? '' : `L ${points[0]} ${points[1]}`
      )
      .join('')}`;

    const gateLogo1 = new Path({
      path,
      blankingAmount: 0,
      color: [0.8, 0.2, 0.8],
      width: 662,
      height: 662,
    });
    scene.add(gateLogo1);
    frame += 1;
  }

  scene.start(renderFrame);
  dac.stream(scene);
})();
