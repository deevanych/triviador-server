import Ws from 'App/Services/Ws'
import { findGameRoomTitle } from 'App/Services/MatchService'
import { getUserByToken } from 'App/Services/UserService'
import User from 'App/Models/User'
import { Socket } from 'socket.io'

Ws.boot()

export interface SocketExtended extends Socket {
  user?: User
}

const activeUsers: {[key: string]: string} = {}

const getData = (io) => {
  return {
    playersCount: io.engine.clientsCount,
    lookingForGamePlayersCount: io.sockets.adapter.rooms.get(findGameRoomTitle)?.size ?? 0,
  }
}

Ws.io
  .on('connection', (socket: SocketExtended) => {
    Ws.io.emit('serverInfo', getData(Ws.io))

    const token = socket.handshake.auth.token

    if (token !== null && activeUsers.hasOwnProperty(token)) {
      socket.emit('gameCopyAlreadyOpen')
      socket.disconnect()
    }

    if (!activeUsers.hasOwnProperty(token))
      activeUsers[token] = ''

    getUserByToken(token).then((user: User) => {
      socket.user = user
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
    }).catch(() => {
      socket.emit('userNotFound')
    })

    socket.on('disconnect', () => {
      delete activeUsers[token]
      Ws.io.emit('serverInfo', getData(Ws.io))
    })
  })
