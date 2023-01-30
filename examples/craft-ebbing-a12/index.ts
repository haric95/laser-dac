import { DAC } from '@laser-dac/core';
import { Simulator } from '@laser-dac/simulator';
import { Scene, Line } from '@laser-dac/draw';
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

(async () => {
  let on = false;
  let value = 0;

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
    if (msg.address === '/Velocity3') {
      on = msg.args[0] === 0 ? false : true;
    } else if (msg.address === '/Note3') {
      if (msg.args[0] === 85) {
        value = 1;
      } else {
        value = 0;
        on;
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
    // const circle = new Circle({
    //   radius: 0.5,
    //   x: 0.5,
    //   y: 0.5,
    //   color: value === 1 ? [0.5, 0, 0] : [0, 0, 0],
    // });
    const line = new Line({
      from: { x: Math.random(), y: Math.random() },
      to: { x: Math.random(), y: Math.random() },
      color: value === 1 ? [0.5, 0, 0] : [0, 0, 0],
    });
    // scene.add(circle);
    scene.add(line);
    if (on) {
      on = false;
    }
  }

  scene.start(renderFrame);
  dac.stream(scene);
})();
