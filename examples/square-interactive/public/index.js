import WebsocketClient from './websocket.js';
import uuid from './uuid.js';

const host = window.document.location.host.replace(/:.*/, '');
const ws = new WebsocketClient();

function sendMessage(msg) {
  ws.send(JSON.stringify(msg));
}

function startMoving(e) {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const clientX = e.touches[0].clientX;
  const clientY = e.touches[0].clientY;

  const x = clientX / windowWidth;
  const y = clientY / windowHeight;
  console.log('Touched', 'x:', x, 'y:', y);

  sendMessage({
    type: 'MOVE',
    data: {
      x,
      y
    }
  });
}

function stopMoving() {
  sendMessage({
    type: 'REMOVE'
  });
}

ws.onopen = function() {
  console.log('Websocket connection opened.');

  document.removeEventListener('touchmove', startMoving);
  document.removeEventListener('touchstart', startMoving);
  document.removeEventListener('touchend', startMoving);

  document.addEventListener('touchmove', startMoving, false);
  document.addEventListener('touchstart', startMoving, false);
  document.addEventListener('touchend', stopMoving, false);
};

const uniqueId = uuid();

ws.open(`ws://${host}:8321?id=${uniqueId}`);
