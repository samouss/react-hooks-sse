const EventEmitter = require('events');
const uuid = require('uuid');
const cors = require('cors');
const express = require('express');

const server = express();
const emitter = new EventEmitter();

server.use(cors());

const state = {
  likes: 10,
  comments: 3,
};

server.get('/sse', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  const listener = (event, data) => {
    res.write(`id: ${uuid.v4()}\n`);
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  emitter.addListener('push', listener);

  req.on('close', () => {
    emitter.removeListener('push', listener);
  });
});

server.listen(8080, () => {
  console.log('Listen on port 8080...');
});

setInterval(() => {
  state.likes += Math.floor(Math.random() * 10) + 1;

  emitter.emit('push', 'likes', {
    value: state.likes,
  });
}, 2500);

setTimeout(() => {
  setInterval(() => {
    state.comments += Math.floor(Math.random() * 10) + 1;

    emitter.emit('push', 'comments', {
      value: state.comments,
    });
  }, 2500);
}, 1250);
