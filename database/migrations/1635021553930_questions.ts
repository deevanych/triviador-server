import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { EXTENDED_TYPE } from 'App/Models/Question'

export default class Questions extends BaseSchema {
  protected tableName = 'questions'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('text').unique().comment('Question text')
      table.string('question_type').defaultTo(EXTENDED_TYPE)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
