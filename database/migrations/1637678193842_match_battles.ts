import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class MatchBattles extends BaseSchema {
  protected tableName = 'match_battles'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('match_id')
        .unsigned()
        .references('matches.id')
        .onDelete('CASCADE')
      table
        .integer('question_id')
        .unsigned()
        .references('questions.id')
        .onDelete('CASCADE')

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
