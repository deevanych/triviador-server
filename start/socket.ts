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

    // if (token !== null && activeUsers.hasOwnProperty(token)) {
    //   socket.emit('gameCopyAlreadyOpen')
    //   socket.disconnect()
    // }

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

      socket.on('getMatchData',async () => {
        const user = await User.findOrFail(socket.user.id)
        const match = user.activeMatch as Match
        socket.user = user

        if (typeof match === 'undefined') {
          socket.emit('goToLobby')
          return false
        }

        await match.load('users')
        await match.load('stages')
        console.log(match.stages)

        socket.emit('matchData', match)

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

      socket.on('leaveMatch', async () => {
        await user.leaveMatch()
        const match = user.activeMatch as Match
        const roomPlayersCount = Ws.io.sockets.adapter.rooms.get(match?.getRoom)?.size
        if (roomPlayersCount === undefined) {
          match.setCompleted().then(r => r)
        }

        user = await User.findOrFail(socket.user.id)
        socket.emit('userUpdate', user)
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
