import Ws from 'App/Services/Ws'
Ws.boot()

const findGameRoomTitle = 'findGameRoom'

const activeUsers: {[key: string]: string} = {}

const getData = (io) => {
  return {
    playersCount: io.engine.clientsCount,
    lookingForGamePlayersCount: io.sockets.adapter.rooms.get(findGameRoomTitle)?.size ?? 0,
  }
}

Ws.io
  .on('connection', (socket) => {
    const token = socket.handshake.auth.token

    if (token !== null && activeUsers.hasOwnProperty(token)) {
      socket.emit('gameCopyAlreadyOpen')
      socket.disconnect()
    }

    if (!activeUsers.hasOwnProperty(token))
      activeUsers[token] = ''

    Ws.io.emit('serverInfo', getData(Ws.io))

    socket.on('disconnect', () => {
      delete activeUsers[token]
      console.log(activeUsers)
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
