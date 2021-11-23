import { BaseCommand } from '@adonisjs/core/build/standalone'
import Match from 'App/Models/Match'
import { MatchService } from 'App/Services/MatchService'

export default class Test extends BaseCommand {

  /**
   * Command name is used to run the command
   */
  public static commandName = 'test'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = ''

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command
     */
    loadApp: true,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process
     */
    stayAlive: false,
  }

  public async run () {
    const match = await Match.find(5)
    await MatchService.defining(match as Match)
  }
}
