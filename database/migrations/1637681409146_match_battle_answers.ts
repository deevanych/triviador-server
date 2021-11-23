import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class MatchBattleAnswers extends BaseSchema {
  protected tableName = 'match_battle_answers'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('match_battle_id')
        .unsigned()
        .references('match_battles.id')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('question_id')
        .unsigned()
        .references('questions.id')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('user_id')
        .unsigned()
        .references('users.id')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('answer_id')
        .unsigned()
        .references('answers.id')
        .onDelete('CASCADE')
        .nullable()
      table.string('answer').nullable()
      table.unique(['match_battle_id', 'user_id'])
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
