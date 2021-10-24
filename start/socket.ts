import Ws from 'App/Services/Ws'
import { findGameRoomTitle } from 'App/Services/MatchService'
import { getUserByToken } from 'App/Services/UserService'
import User from 'App/Models/User'
import { Socket } from 'socket.io'
import Match from 'App/Models/Match'

Ws.boot()

export interface SocketExtended extends Socket {
  user: User
}

const activeUsers: {[key: string]: string} = {}

const getData = (io) => {
  return {
    playersCount: Object.keys(activeUsers).length,
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

      if (user.isInMatch) {
        socket.emit('goToActiveMatch')
      }

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

      socket.on('connectToMatch', () => {
        const match = socket.user.activeMatch as Match
        Ws.io.to(match.getRoom).emit('matchEvent', {
          type: 'userConnected',
          userId: socket.user.id,
        })
        socket.join(match.getRoom)
        socket.emit('startGame')
      })

      socket.on('getMatchData', () => {
        User.findOrFail(socket.user.id).then((user: User) => {
          const match = user.activeMatch
          socket.user = user
          if (typeof match === 'undefined') {
            socket.emit('goToLobby')
            return false
          }

          Match.findOrFail(match.id).then((data: Match) => {
            socket.emit('matchData', data)
          })
        })
      })

      socket.on('disconnect', () => {
        if (socket.user.isInMatch) {
          const match = socket.user.activeMatch as Match
          Ws.io.to(match.getRoom).emit('matchEvent', {
            type: 'userDisconnected',
            userId: socket.user.id,
          })
        }
      })

      socket.on('leaveMatch', () => {
        user.leaveMatch()
      })
    }).catch(() => {
      socket.emit('userNotFound')
    })

    socket.on('disconnect', () => {
      delete activeUsers[token]
      Ws.io.emit('serverInfo', getData(Ws.io))
    })
  })
