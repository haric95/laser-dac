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
    if (msg.address === '/Velocity1') {
      on = msg.args[0] === 0 ? false : true;
    } else if (msg.address === '/Note1') {
      value = msg.args[0] / 127;
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
    const path = new Path({
      path: `M 0 0 100 100`,
      // path: `M 0 50 C 25 ${((Math.sin(curTime * value) + 1) / 2) * 100} 75 ${
      //   ((Math.cos(curTime * value) + 1) / 2) * 100
      // } 100 50`,
      height: 100,
      width: 100,
      color: on
        ? [Math.random() / 2, value / 2 + 0.2, Math.random() / 2]
        : [0, 0, 0],
    });
    scene.add(path);
    if (on) {
      on = false;
    }
  }
  scene.start(renderFrame);
  dac.stream(scene);
})();
