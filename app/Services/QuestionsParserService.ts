import axios from 'axios'
import { parse } from 'node-html-parser'
import Question, { BASIC_TYPE, EXTENDED_TYPE } from 'App/Models/Question'
import Answer from 'App/Models/Answer'
import { Error } from 'memfs/lib/internal/errors'
import validator from 'validator'
import trim = validator.trim

const SITE_URL = 'baza-otvetov.ru'
const QUIZ_PATH = '/quiz/ask'
const CATEGORIES_PATH = '/categories'
const SITE_ANSWER_CHECK = '/quiz/check'

let QUESTIONS_PARSED_COUNT = 0

export class QuestionsParserService {
  private static error() {
    throw new Error('duplicate')
  }

  public static async parser(isBasic = false) {
    if (isBasic)
      return await this.basicQuestionsParser()

    return await this.extendedQuestionsParser()
  }

  private static async getCategories(): Promise<string[]> {
    try {
      const categoriesRequest = await axios.get(`https://${SITE_URL}${CATEGORIES_PATH}`, {
        headers: {
          'x-requested-with': 'XMLHttpRequest',
        },
      })
      const categoriesHtml = parse(categoriesRequest.data as string)
      const categoriesElements = categoriesHtml.querySelectorAll('.block > h2 > a')

      return categoriesElements.map((category) => {
        return category.getAttribute('href') as string
      })
    } catch (e) {
      throw e
    }
  }

  private static async createQuestion(text: string, answers: string[], rightAnswer = '') {
    try {
      const type = answers.length === 1 ? BASIC_TYPE : EXTENDED_TYPE
      const questionInstance = await Question.create(
        {
          text,
          type,
        },
      )

      for (let answer of answers) {
        let isRight = true
        if (answers.length !== 1)
          isRight = answer === rightAnswer

        await Answer.create({
          text: answer,
          isRight,
          questionId: questionInstance.id,
        })
      }
    } catch (e) {
      throw e
    }
  }

  private static async getQuestions(url: string): Promise<void> {
    const questionsRequest = await axios.get(`https://${SITE_URL}${url}`, {
      headers: {
        'x-requested-with': 'XMLHttpRequest',
      },
    })
    const html = parse(questionsRequest.data as string)

    const nextPageUrl = html.querySelector('.q-list__active-nav + a')?.getAttribute('href') as string
    const questionsElements = html.querySelectorAll('.tooltip')

    for (let question of questionsElements) {
      const rightAnswer = trim(question.querySelector('td:nth-of-type(3)')?.text as string)
      const questionText = trim(question.querySelector('td:nth-of-type(2) > a')?.text as string)
      const answersBlock = question.querySelector('td:nth-of-type(2) > .q-list__quiz-answers')
      const ifAnswerIsNumber = Number.isInteger(+rightAnswer)
      let answers: string[] = []

      if (!ifAnswerIsNumber && answersBlock === null)
        continue

      if (answersBlock !== null) {
        const answersText = trim(answersBlock?.text.split('Ответы для викторин: ')[1])
        answers = answersText.split(', ')
      }

      answers.push(rightAnswer)
      if (ifAnswerIsNumber) {
        let existsQuestion = await Question.query()
          .where('text', questionText)
          .where('type', BASIC_TYPE)
          .first()

        if (existsQuestion === null) {
          await this.createQuestion(questionText, [rightAnswer], rightAnswer)
          console.log(`Пёрнуто вопросов: ${++QUESTIONS_PARSED_COUNT}`)
        }
      }

      if (answers.length === 4) {
        const existsQuestion = await Question.query()
          .where('text', questionText)
          .where('type', EXTENDED_TYPE)
          .first()

        if (existsQuestion === null) {
          await this.createQuestion(questionText, answers, rightAnswer)
          console.log(`Пёрнуто вопросов: ${++QUESTIONS_PARSED_COUNT}`)
        }
      }
    }

    if (typeof nextPageUrl !== 'undefined')
      await this.getQuestions(nextPageUrl)
  }

  static async extendedQuestionsParser(): Promise<void> {
    try {
      const questionHtml = await axios.get(`https://${SITE_URL}${QUIZ_PATH}`, {
        headers: {
          'x-requested-with': 'XMLHttpRequest',
        },
      })

      const html = parse(questionHtml.data as string)
      const question = html.querySelector('.q_id')
      const questionText = trim(question?.text as string)
      const existsQuestion = await Question.query()
        .where('text', questionText)
        .where('type', BASIC_TYPE)
        .first()

      if (existsQuestion !== null)
        return this.error()

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

  static async basicQuestionsParser(): Promise<void> {
    try {
      const categories = await this.getCategories()

      for (let category of categories) {
        await this.getQuestions(category)
      }

      process.exit(1)
    } catch (e) {
      throw e
    }
  }
}
