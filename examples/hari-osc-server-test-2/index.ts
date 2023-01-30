import { DAC } from '@laser-dac/core';
import { Simulator } from '@laser-dac/simulator';
import { Scene, Path } from '@laser-dac/draw';
import { Helios } from '../../packages/helios/dist';
const OSC = require('osc');

// messed this file up a bit, not worth looking at.

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
  let on = true;
  // let value = 0;

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

  // udpPort.on('message', (msg: { address: string; args: number[] }) => {
  //   if (msg.args[0] === 127) {
  //     on = true;
  //   } else if (msg.args[0] === 0) {
  //     on = false;
  //   } else if (on) {
  //     value = msg.args[0];
  //   }
  // });

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
    const path = new Path({
      path: `M 0 0 L 100 100 Z`,
      height: 100,
      width: 100,
      color: [1, 1, 1],
    });
    scene.add(path);
    if (on) {
      on = false;
    }
  }

  scene.start(renderFrame);
  dac.stream(scene);
})();
