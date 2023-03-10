import { DAC } from '@laser-dac/core';
import { Simulator } from '@laser-dac/simulator';
import { Scene, Line } from '@laser-dac/draw';
import { Helios } from '../../packages/helios/dist';
const OSC = require('osc');

const toss = () => Math.random() >= 0.5;

const NUM_FRAMES = 16;

var getIPAddresses = function () {
  var os = require('os'),
    interfaces = os.networkInterfaces(),
    ipAddresses: any[] = [];

  for (var deviceName in interfaces) {
    var addresses = interfaces[deviceName];
    for (var i = 0; i < addresses.length; i++) {
      var addressInfo = addresses[i];
      if (addressInfo.family === 'IPv4' && !addressInfo.internal) {
        ipAddresses.push(addressInfo.address);
      }
    }
  }

  return ipAddresses;
};

type ProjectionArea = {
  xStart: number;
  yStart: number;
  xEnd: number;
  yEnd: number;
};

type ActiveArea = {
  index: number;
  progress: number;
  dir: 'forwards' | 'backwards';
  orient: 'horizontal' | 'vertical';
  complete: boolean;
};

const AREAS: ProjectionArea[] = [
  { xStart: 0.0, yStart: 0.09, xEnd: 0.29, yEnd: 0.21 },
  { xStart: 0.2, yStart: 0.12, xEnd: 0.49, yEnd: 0.24 },
];

let activeAreas: ActiveArea[] = [];

(async () => {
  var udpPort = new OSC.UDPPort({
    localAddress: '0.0.0.0',
    localPort: 57121,
  });

  udpPort.on('ready', function () {
    var ipAddresses = getIPAddresses();

    console.log('Listening for OSC over UDP.');
    ipAddresses.forEach(function (address) {
      console.log(' Host:', address + ', Port:', udpPort.options.localPort);
    });
  });

  udpPort.on('message', (msg: { address: string; args: number[] }) => {
    if (msg.address === '/Velocity1') {
      if (msg.args[0] !== 0) {
        const activeIndex = Math.floor(Math.random() * AREAS.length);
        activeAreas.push({
          dir: toss() ? 'forwards' : 'backwards',
          // dir: 'backwards',
          progress: 0,
          index: activeIndex,
          orient: toss() ? 'horizontal' : 'vertical',
          // orient: 'horizontal',
          complete: false,
        });
      }
    }
  });

  udpPort.on('error', (err: string) => {
    console.log(err);
  });

  udpPort.open();

  const dac = new DAC();
  dac.use(new Simulator());
  dac.use(new Helios());
  await dac.start();

  const scene = new Scene({
    resolution: 100,
  });

  function renderFrame() {
    if (activeAreas.length) {
      activeAreas.forEach((activeArea, index) => {
        const area = AREAS[activeArea.index];
        const line = new Line({
          from: {
            x: Math.random() * (area.xEnd - area.xStart) + area.xStart,
            y: Math.random() * (area.yEnd - area.yStart) + area.yStart,
          },
          to: {
            x: Math.random() * (area.xEnd - area.xStart) + area.xStart,
            y: Math.random() * (area.yEnd - area.yStart) + area.yStart,
          },
          color: [0, 0, 0.8],
        });

        // uncomment to test
        // const line = new Line({
        //   from: { x: AREAS[0].xStart, y: AREAS[0].yStart },
        //   to: { x: AREAS[0].xEnd, y: AREAS[0].yEnd },
        //   color: [0, 0.5, 0],
        // });

        scene.add(line);
        // increment progress counter
        activeArea.progress += 1;
        if (activeArea.progress >= NUM_FRAMES) {
          activeArea.complete = true;
        }
      });
      activeAreas = activeAreas.filter((area) => !area.complete);
    } else {
      scene.add(
        new Line({
          from: { x: 0, y: 0.5 },
          to: { x: 1, y: 0.5 },
          color: [0, 0, 0],
        })
      );
    }
  }

  scene.start(renderFrame);
  dac.stream(scene);
})();
