import Ws from 'App/Services/Ws'
import { SocketExtended } from '../../start/socket'
import Match from 'App/Models/Match'
import MatchBattle from 'App/Models/MatchBattle'
import Question, { BASIC_TYPE } from 'App/Models/Question'
import * as faker from 'faker'

export const findGameRoomTitle = 'findGameRoom'
const ratingMatchPlayersCount = 2

export class MatchService {
  static matchmakingSelection = async () => {
    const sockets = await Ws.io.in(findGameRoomTitle).fetchSockets() as unknown as SocketExtended[]
    const sortedSockets = sockets.sort((a: SocketExtended, b: SocketExtended) => {
      const ratingA = a.user.rating ?? 0
      const ratingB = b.user.rating ?? 0

      return ratingA - ratingB
    })

    if (sortedSockets.length >= ratingMatchPlayersCount) {
      const readyUsers = sortedSockets.splice(0, ratingMatchPlayersCount)
      const match = await new Match().save()
      const readyUsersIds = readyUsers.map((socket) => socket.user.id)
      await match.related('users').attach(readyUsersIds)
      await match.load('users')
      await match.generateStages()

      for (let socket of readyUsers) {
        socket.leave(findGameRoomTitle)
        socket.join(match.getRoom)
        socket.emit('startGame')
      }
    }
  }

  // todo
  static defining = async (match: Match) => {
    const questions = await Question.query().where('type', BASIC_TYPE)
    const randomQuestionIndex = faker.datatype.number({ min: 0, max: questions.length})
    const battle = await MatchBattle.create({
      'question_id': questions[randomQuestionIndex].id,
      'match_id': match.id
    })

    await battle.related('users').attach(match.users.map((user) => user.id))
    await battle.load('users')

    Ws.io.to(match.getRoom).emit('matchEvent', {
      type: 'battleStarted',
      battle: battle
    })
  }
}
