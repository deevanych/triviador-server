import Ws from 'App/Services/Ws'
Ws.boot()

const findGameRoomTitle = 'findGameRoom'

const getData = (io) => {
  return {
    playersCount: io.engine.clientsCount,
    lookingForGamePlayersCount: io.sockets.adapter.rooms.get(findGameRoomTitle)?.size ?? 0,
  }
}

Ws.io
  .on('connection', (socket) => {
    Ws.io.emit('serverInfo', getData(Ws.io))

    socket.on('disconnect', () => {
      Ws.io.emit('serverInfo', getData(Ws.io))
    })

    socket.on('startGameSearch', () => {
      socket.join(findGameRoomTitle)
      socket.emit('gameSearchStarted')
      Ws.io.emit('serverInfo', getData(Ws.io))
    })

    socket.on('stopGameSearch', () => {
      socket.leave(findGameRoomTitle)
      socket.emit('gameSearchStopped')
      Ws.io.emit('serverInfo', getData(Ws.io))
    })
  })
