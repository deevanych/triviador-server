import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class MatchStages extends BaseSchema {
  protected tableName = 'match_stages'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('user_id')
        .unsigned()
        .references('users.id')
        .onDelete('CASCADE')
      table
        .integer('match_id')
        .unsigned()
        .references('matches.id')
        .onDelete('CASCADE')
      table.boolean('is_passed').defaultTo(false)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
