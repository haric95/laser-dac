import { DAC } from '@laser-dac/core';
import { Simulator } from '@laser-dac/simulator';
// import { Helios } from '@laser-dac/helios';
import { Scene, Path } from '@laser-dac/draw';
import { Helios } from '../../packages/helios/dist';

(async () => {
  const dac = new DAC();
  dac.use(new Simulator());
  // const heliosDac = new Helios();
  dac.use(new Helios());
  await dac.start();

  const scene = new Scene({
    resolution: 500,
  });
  function renderFrame() {
    // Triangle
    // const triangle = new Path({
    //   path: 'M0.67 0 l0.33 0.88 L1 0.88 Z',
    //   color: [0, 1, 0],
    //   x: 0,
    //   y: 0
    // });
    // scene.add(triangle);

    // Should draw this cross: https://codepen.io/chrisnager/pen/armzk
    // Gate logo paths w=662 h=330
    // <path d="M 12 210 L 464 15 L 76 210 L 226 256 L 262 214 L 261 300 Z"  />
    // <path d="M 217 180 L 284 183 L 198 206 Z"  />
    // <path d="M 340 133 L 372 132 L 403 259 L 346 286 L 329 235 L 315 298 L 294 298 Z"  />
    // <path d="M 341 109 L 344 85 L 358 79 L 363 100 Z"  />
    // <path d="M 280 129 L 446 77 L 453 34 L 458 74 L 576 38 L 524 101 L 452 110 L 453 317 L 414 250 L 441 111 Z"  />
    // <path d="M 469 111 L 599 164 L 512 164 L 630 206 L 530 207 L 648 251 L 510 251 Z"  />

    const gateLogo1 = new Path({
      path: 'M 574.2 105 L 167.4 7.5 L 516.6 105 L 381.6 128 L 349.2 107 L 350.1 150 L 574.2 105 M 389.7 90 L 329.4 91.5 L 406.8 103 L 389.7 90 M 279 66.5 L 250.2 66 L 222.3 129.5 L 273.6 143 L 288.9 117.5 L 301.5 149 L 320.4 149 L 279 66.5 M 278.1 54.5 L 275.4 42.5 L 262.8 39.5 L 258.3 50 L 278.1 54.5 M 333 64.5 L 183.6 38.5 L 177.3 17 L 172.8 37 L 66.6 19 L 113.4 50.5 L 178.2 55 L 177.3 158.5 L 212.4 125 L 188.1 55.5 L 333 64.5 M 162.9 55.5 L 45.9 82 L 124.2 82 L 18 103 L 108 103.5 L 1.8 125.5 L 126 125.5 L 162.9 55',
      color: [0, 0.3, 0],
      width: 662,
      height: 330,
    });
    scene.add(gateLogo1);
  }

  scene.start(renderFrame);
  dac.stream(scene);
})();
