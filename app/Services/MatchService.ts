import Ws from 'App/Services/Ws'
import { SocketExtended } from '../../start/socket'
import Match from 'App/Models/Match'

export const findGameRoomTitle = 'findGameRoom'
const ratingMatchPlayersCount = 3

export class MatchService {
  public static matchmakingSelection = () => {
    // @ts-ignore
    Ws.io.in(findGameRoomTitle).fetchSockets().then((sockets: SocketExtended[]): void => {
      const sortedSockets = sockets.sort((a: SocketExtended, b: SocketExtended) => {
        const ratingA = a.user.rating ?? 0
        const ratingB = b.user.rating ?? 0

        return ratingA - ratingB
      })

      if (sortedSockets.length >= ratingMatchPlayersCount) {
        const readyUsers = sortedSockets.splice(0, ratingMatchPlayersCount)
        new Match().save().then((match) => {
          readyUsers.forEach((socket) => {
            socket.leave(findGameRoomTitle)
            match.related('users').attach([socket.user.id])
            socket.join(`match#${ match.id }`)
            socket.emit('startGame')
          })
        })
      }
    });
  }
}
