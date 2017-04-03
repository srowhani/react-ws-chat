#!/usr/bin/env node
;(function (app, io, http) {
  http = http.Server(app)
  io = io(http)

  io.on('connection', (socket) => {
    socket.on('send', (message) => {
      socket.emit('recieve', {
        name: socket.id,
        message
      })
    })
  })
  http.listen(ENV.PORT || 3000)
})(
  require('express')(),
  require('socket.io'),
  require('http')
);
