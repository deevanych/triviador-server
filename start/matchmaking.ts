import { MatchService } from 'App/Services/MatchService'

const timeout = 5000

setInterval(() => {
  MatchService.matchmakingSelection()
}, timeout)
