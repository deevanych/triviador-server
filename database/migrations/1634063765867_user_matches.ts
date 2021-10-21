import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { DRAW_POINTS_AMOUNT } from 'App/Models/UserMatch'

export default class UserMatch extends BaseSchema {
  protected tableName = 'user_matches'

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
      table.unique(['user_id', 'match_id'])
      table.integer('amount', 2).defaultTo(DRAW_POINTS_AMOUNT)
      table.boolean('in_match').defaultTo(true)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
