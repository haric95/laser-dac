import { DAC } from '@laser-dac/core';
import { Simulator } from '@laser-dac/simulator';
import { Scene, Path } from '@laser-dac/draw';
import { Helios } from '../../packages/helios/dist';
const OSC = require('osc');

var getIPAddresses = function () {
  var os = require('os'),
    interfaces = os.networkInterfaces(),
    ipAddresses = [];

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

// let initTime = new Date().getTime();

const noteMap: Record<number, number> = {};

const NUM_FRAMES = 5;

const noteHandler = (note: number) => {
  noteMap[note] = NUM_FRAMES;
};

const frameHandler = () => {
  for (const noteNumber in noteMap) {
    if (noteMap[noteNumber] === 1) {
      delete noteMap[noteNumber];
    } else {
      noteMap[noteNumber] = noteMap[noteNumber] - 1;
    }
  }
};

const PATHS: Record<number, Path> = {
  40: new Path({
    path: `M 10 10 L 30 10 L 30 30 L 10 30 L 10 10`,
    width: 100,
    height: 100,
    color: [1, 0, 0],
  }),
  85: new Path({
    path: `M 50 50 L 80 50 L 80 80 L 50 80 L 50 50`,
    width: 100,
    height: 100,
    color: [0, 1, 0],
  }),
};

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
    if (msg.address === '/808') {
      noteHandler(msg.args[0]);
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
    frameHandler();

    const shapes: Path[] = [];

    for (const note in noteMap) {
      if (noteMap[note]) {
        shapes.push(PATHS[Number(note)]);
      }
    }

    if (shapes.length === 0) {
      scene.add(new Path({ color: [0, 0, 0], path: `M 50 50` }));
    } else {
      shapes.forEach((shape) => {
        if (shape) {
          scene.add(shape);
        }
      });
    }
  }

  scene.start(renderFrame);
  dac.stream(scene);
})();
