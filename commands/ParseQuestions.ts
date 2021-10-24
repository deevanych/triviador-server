import { BaseCommand } from '@adonisjs/core/build/standalone'
import { QuestionsParserService } from 'App/Services/QuestionsParserService'

export default class ParseQuestions extends BaseCommand {

  /**
   * Command name is used to run the command
   */
  public static commandName = 'parse:questions'

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
    stayAlive: true,
  }

  public async run () {
    let recurringQuestionsInRowCount = 0
    let i = 0

    while (recurringQuestionsInRowCount < 1000) {
      try {
        await QuestionsParserService.run()
        i++
        recurringQuestionsInRowCount = 0
        console.log(`Вопросов пёрнуто: ${i}`)
      } catch (e) {
        if (e.message !== 'An invalid error message key was used: duplicate.')
          return false

        recurringQuestionsInRowCount++
        console.log(`Количество повторяющихся вопросов подряд: ${recurringQuestionsInRowCount}`)
      }
    }

    process.exit(1)
  }
}
