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
  const rooms = io.of('/').adapter.rooms
  let playersCount = 0

  rooms.forEach((_room, roomTitle) => {
    if (roomTitle.indexOf('match#') !== -1)
      playersCount += io.sockets.adapter.rooms.get(roomTitle)?.size
  })

  return {
    playersCount: Object.keys(activeUsers).length,
    lookingForGamePlayersCount: io.sockets.adapter.rooms.get(findGameRoomTitle)?.size ?? 0,
    playingPlayers: playersCount,
  }
}

Ws.io
  .on('connection', (socket: SocketExtended) => {
    const token = socket.handshake.auth.token

    Ws.io.emit('serverInfo', getData(Ws.io))

    if (token !== null && activeUsers.hasOwnProperty(token)) {
      socket.emit('gameCopyAlreadyOpen')
      socket.disconnect()
    }

    getUserByToken(token).then((user: User) => {
      if (!activeUsers.hasOwnProperty(token))
        activeUsers[token] = ''

      Ws.io.emit('serverInfo', getData(Ws.io))

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

        Ws.io.emit('serverInfo', getData(Ws.io))
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

        Ws.io.emit('serverInfo', getData(Ws.io))
      })

      socket.on('disconnect', () => {
        if (socket.user.isInMatch) {
          const match = socket.user.activeMatch as Match
          Ws.io.to(match.getRoom).emit('matchEvent', {
            type: 'userDisconnected',
            userId: socket.user.id,
          })
        }

        Ws.io.emit('serverInfo', getData(Ws.io))
      })

      socket.on('leaveMatch', () => {
        user.leaveMatch()
        const match = user.activeMatch as Match
        const roomPlayersCount = Ws.io.sockets.adapter.rooms.get(match?.getRoom)?.size
        console.log('roomPlayersCount', roomPlayersCount)
        if (roomPlayersCount === undefined) {
          match.setCompleted().then((data) => {
            console.log(data)
          })
        }

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
