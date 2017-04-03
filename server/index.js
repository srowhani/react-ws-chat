#!/usr/bin/env node
;(function (app, io, http) {
  http = http.Server(app)
  io = io(http)
  io.set('transports', ['websocket', 'polling'])
  io.sockets.on('connection', (socket) => {
    socket.on('send', (message) => {
      io.sockets.emit('recieve', {
        name: socket.id,
        message
      })
    })
  })
  http.listen(3000)
})(
  require('express')(),
  require('socket.io'),
  require('http')
);
