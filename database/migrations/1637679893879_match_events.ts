import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class MatchEvents extends BaseSchema {
  protected tableName = 'match_events'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('event_type_id')
        .unsigned()
        .references('match_event_types.id')
        .onDelete('CASCADE')
      table
        .integer('match_battle_id')
        .unsigned()
        .references('match_battles.id')
        .onDelete('CASCADE')
      table
        .integer('user_id')
        .unsigned()
        .references('users.id')
        .onDelete('CASCADE')
      table.json('data')


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
