import Ws from 'App/Services/Ws'
Ws.boot()

const getData = (engine) => {
  return {
    playersCount: engine.clientsCount,
    lookingForGamePlayersCount: 0,
  }
}

Ws.io
  .on('connection', (socket) => {
    Ws.io.emit('serverInfo', getData(Ws.io.engine))

    socket.on('disconnect', () => {
      Ws.io.emit('serverInfo', getData(Ws.io.engine))
    })

    socket.on('findGame', () => {
      socket.join('findGameRoom')
    })
  })
