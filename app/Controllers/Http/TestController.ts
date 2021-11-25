import MatchBattle from 'App/Models/MatchBattle'

export default class TestController {
  public async index() {
    return await MatchBattle.find(1)
  }
}
