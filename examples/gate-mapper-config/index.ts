import { DAC } from '@laser-dac/core';
import { Simulator } from '@laser-dac/simulator';
import { Scene, Rect } from '@laser-dac/draw';
import { Helios } from '../../packages/helios/dist';
const OSC = require('osc');

const toss = () => Math.random() >= 0.5;

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
  { xStart: 0.03, yStart: 0.1, xEnd: 0.12, yEnd: 0.15 },
  // { xStart: 0.5, yStart: 0.5, xEnd: 0.8, yEnd: 0.6 },
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
    const rect = new Rect({
      x: 0.05,
      y: 0.11,
      height: 0.08,
      width: 0.2,
      color: [0, 0, 0.3],
    });
    scene.add(rect);
  }

  scene.start(renderFrame);
  dac.stream(scene);
})();
