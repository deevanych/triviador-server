import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { PLAYER_TURN_TYPE } from 'App/Models/MatchStage'

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
        .nullable()
      table
        .integer('match_id')
        .unsigned()
        .references('matches.id')
        .onDelete('CASCADE')
        .notNullable()
      table.string('type').defaultTo(PLAYER_TURN_TYPE)
      table.boolean('is_passed').defaultTo(false)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
