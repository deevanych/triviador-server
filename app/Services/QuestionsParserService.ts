import axios from 'axios'
import { parse } from 'node-html-parser'
import Question from 'App/Models/Question'
import Answer from 'App/Models/Answer'

const SITE_URL = 'baza-otvetov.ru'
const SITE_PATH = '/quiz/ask'
const SITE_ANSWER_CHECK = '/quiz/check'

export class QuestionsParserService {
  static async run() {
    try {
      const questionHtml = await axios.get(`https://${SITE_URL}${SITE_PATH}`, {
        headers: {
          'x-requested-with': 'XMLHttpRequest',
        },
      })

      const html = parse(questionHtml.data as string)
      const question = html.querySelector('.q_id')
      const questionText = question?.text
      const questionInstance = await Question.create(
        {
          text: questionText,
        },
      )
      const questionId = question?.getAttribute('id')
      const answers = html.querySelectorAll('h4')
      const form = new URLSearchParams({
        q_id: questionId as string,
      })
      const answerHtml = await axios.post(
        `https://${SITE_URL}${SITE_ANSWER_CHECK}`,
        form,
        {
          headers: {
            'x-requested-with': 'XMLHttpRequest',
          },
        },
      )
      const html2 = parse(answerHtml.data as string)
      const rightAnswerBlock = html2.querySelector('h3 > span')?.text
      const rightAnswer = rightAnswerBlock?.split('Правильный ответ: ')[1]

      answers.forEach((answer) => {
        const isRight = answer.text === rightAnswer
        Answer.create({
          text: answer.text,
          isRight,
          questionId: questionInstance.id,
        })
      })
    } catch (e) {
      throw e
    }
  }
}
